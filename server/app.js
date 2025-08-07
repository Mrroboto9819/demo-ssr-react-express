require('../client/babel-register.js')
const express = require('express');
const dotenv = require('dotenv')
const path = require('path');
const { DataStore } = require('./utils/db.js');
const { default:App } = require('../client/App.jsx')
const React = require('react')
const { renderToString } = require('react-dom/server');
dotenv.config()
const db = new DataStore(process.env.DATABASE)
db.init()
const app = express();
const PORT = process.env.PORT;
app.use('/static', express.static(path.join(__dirname, '../dist')))

app.get('/', async (req, res) => {
  try {
    let services = await db.get('services')
    let statuses = await db.get('statuses')
    let statusCodes = await db.get('statusCodes')

    let servicesFull = services?.map(service => {
      let conector = statuses.find(use => use.serviceId === service.id)
      return { ...service,  status: statusCodes[conector.status]}
    });
    let props = { services: servicesFull }
    const appHtml = renderToString(React.createElement(App, props));
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Web Platform Team</title>
        </head>
        <body>
          <div id="root">${appHtml}</div>
          <script>
            window.__INITIAL_DATA__ = ${JSON.stringify(props)};
          </script>
          <script src="/static/bundle.js"></script>
      </html>
    `);
  } catch (error) {
    console.error('SSR error:', error);
    res.status(500).send('Internal server error');
  }

})

app.get('/services', (req, res) => {
  res.send({ services: db.get('services') })
});

app.get('/statuses', (req, res) => {
  res.send({ statuses: db.get('statuses') })
});

app.get('/status-codes', (req, res) => {
  res.send({ statusCodes: db.get('statusCodes') })
});

app.get('/services-all', async (req, res) => {
  let services = await db.get('services')
  let statuses = await db.get('statuses')
  let statusCodes = await db.get('statusCodes')

  let servicesFull = services?.map(service => {
    let conector = statuses.find(use => use.serviceId === service.id)
    return { ...service,  status: statusCodes[conector.status]}
  });
  res.send(servicesFull)
})

app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
