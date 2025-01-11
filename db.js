const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres.uhodljmqfiabqzdyiplf',
  host: 'aws-0-us-west-1.pooler.supabase.com',
  database: 'postgres',
  password: 'Mari#2004',
  port: 6543,
});

module.exports = pool;
