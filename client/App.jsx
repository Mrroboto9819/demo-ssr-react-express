import axios from 'axios'
import React, { useState, useEffect } from 'react'
import './styles.css';

const App = ({ services }) => {

  const colors = {
    online: '#8FCD77',
    degraded: '#CC0100',
    offline: '#ebebebff',
    maintenance: '#FFD966'
  }

  let [isLoading, setIsLoading] = useState(false)
  let [isLoadingStates, setIsLoadingStates] = useState(true)
  let [servicesList, setServiceList] = useState([])

  useEffect(() => {
    setServiceList(services)
    setTimeout(() => {
      setIsLoading(false)
      setIsLoadingStates(false)
    }, 5000)
  }, []);

  const reFetchStatus  = async () => {
    try {
      setIsLoadingStates(true)
      let response = await axios.get('/services-all')
      setTimeout(() => {
        setServiceList(response.data)
      }, 5000)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoadingStates(false)
    }
    // console.log(response, "<-- ")

  }

  return (
    <>
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.3)'
        }}>
            <div>
              <span className="loader"></span>
            </div>
        </div>
      )}
      <main style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', 
        width: '100%', 
        height: '100vh',
      }}> 
          <div style={{
            borderRadius: '20px',
            width: '100%',
            maxWidth: '400px',
            minWidth: '320px',
            padding: '1.5rem', 
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            border: '1px solid #f1f1f1'
          }}>
            <div
              onClick={() => reFetchStatus()}
              style={{
                padding: '0.2rem',
                width:'7rem',
                borderRadius: 4,
                fontSize: 12,
                textTransform: 'capitalize',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                alignContent: 'center',
                fontWeight: 500,
                color: '#fff',
                background: '#1E3A8A'
              }}>
              <span>
                Reload the services
              </span>
            </div>
            {servicesList.map((item, index) => {
                return (
                <div 
                  style={{ 
                    display: 'flex',
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    verticalAlign: 'middle',
                  }} 
                  key={item?.id}
                >
                  <div>
                    <p style={{
                      color: '#696969ff',
                      fontSize: 14,
                      fontWeight: 600,
                      textTransform: 'capitalize',
                    }}> {item?.name} </p> 
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center'
                  }}>
                    {isLoadingStates 
                      ? (<div style={{
                          padding: '0.2rem',
                          width:'7rem',
                          height: '1.2rem',
                          borderRadius: 4,
                          textTransform: 'capitalize',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignContent: 'center',
                          backgroundColor: '#bbbbbbff'
                        }}></div>)
                      : (<div
                          style={{
                            padding: '0.2rem',
                            width:'7rem',
                            borderRadius: 4,
                            fontSize: 12,
                            textTransform: 'capitalize',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignContent: 'center',
                            fontWeight: 500,
                            color: ['#FFD966', '#ebebebff'].includes(colors[item?.status]) ? '#797979ff' : '#fff',
                            backgroundColor: colors[item?.status] // #8FCD77 #FFD966 #CC0100
                          }}
                        >
                          <span> {item?.status} </span>
                        </div>)}
                  </div>
                </div>)
            })}
          </div>
      </main>
    </>
  )
}

export default App
