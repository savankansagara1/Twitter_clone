import dotenv from 'dotenv';
import mysql, { Pool } from 'mysql2/promise';

dotenv.config();

const db:Pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port:3306,
  waitForConnections:true,
  connectionLimit:10,
  queueLimit:0,
   timezone: 'Z' // use 'Z' for UTC
});

const checkConnection = async () => {
    try{
        const connection = await db.getConnection()
        console.log(`MYSQL CONNECTED TO DB: ${process.env.DB_NAME}`)
    }
    catch(err){
        console.log(`DB connection failed ${err}`);
    }
}

checkConnection();

export default db;