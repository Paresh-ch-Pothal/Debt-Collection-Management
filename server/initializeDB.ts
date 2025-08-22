import { pool } from "./connectSQL";

export async function initDb() {
  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS csv_records (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT,
      phoneNo TEXT,
      email TEXT NOT NULL,
      debt INT NOT NULL,
      sentiment TEXT,
      response TEXT,
      send_status BOOLEAN DEFAULT FALSE,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE
    );
  `);
}
