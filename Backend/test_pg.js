import pg from 'pg';

const passwords = ['', 'postgres', 'admin', 'root', 'password', '1234', '123456', '12345678', 'yash@200'];
const databases = ['postgres', 'shopzone'];

async function testConnection() {
  for (const db of databases) {
    for (const password of passwords) {
      const config = {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: password,
        database: db,
        connectionTimeoutMillis: 2000,
      };
      
      const client = new pg.Client(config);
      try {
        console.log(`Trying postgres:${password || '<empty>'}@localhost:5432/${db}...`);
        await client.connect();
        console.log(`\n🎉 SUCCESS! Connected with credentials: postgres:${password || '<empty>'}@localhost:5432/${db}\n`);
        await client.end();
        return { password, db };
      } catch (err) {
        console.log(`  Failed: ${err.message}`);
      }
    }
  }
  console.log('\n❌ All password attempts failed.');
  return null;
}

testConnection();
