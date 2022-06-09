const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://oqoedkkoxgpmxc:5816d51615e233705b1f8318b8c833e228c9bc450f2efe38696ad88a0323b84c@ec2-63-34-180-86.eu-west-1.compute.amazonaws.com:5432/dcrrvi6jvtd0o8',
  ssl: {
    rejectUnauthorized: false
  }
})

module.exports = {
  query: (text, params) => pool.query(text, params),
}