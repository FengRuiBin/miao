const Database = require('better-sqlite3')

const db = new Database(__dirname + '/vote.sqlite3')

module.exports = db
