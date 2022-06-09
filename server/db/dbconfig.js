const { Pool } = require('pg')

const pool = new Pool({
  /* Either configure an environment database url or insert your connection string below */
  connectionString: process.env.DATABASE_URL || 'YOUR POSTGRE HEROKU STRING HERE',
  ssl: {
    rejectUnauthorized: false
  }
})

module.exports = {
  query: (text, params) => pool.query(text, params),
}
