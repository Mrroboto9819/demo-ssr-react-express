import { readFile } from 'node:fs/promises'

export class DataStore {
    constructor (path) {
        this.path = path
        this.data = {}
    }

    async init () {
        const raw = await readFile(this.path, 'utf8')
        this.data = JSON.parse(raw)
    }

    get (collection) {
        return this.data[collection] || []
    }

    findOne (collection, query) {
        const list = this.get(collection)
        if (typeof query === 'function') return list.find(query)
    }

    findMany (collection, query) {
        const list = this.get(collection)
        if (typeof query === 'function') return list.find(query)

        return list.filter(obj => Object.entries(query).every(([i, j]) => obj[i] === j))
    }
}