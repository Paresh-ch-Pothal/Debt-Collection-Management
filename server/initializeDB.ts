import { pool } from "./connectSQL";

export async function initDb() {
  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );


    CREATE TABLE IF NOT EXISTS csv_records (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT,
      phoneNo TEXT,
      email TEXT NOT NULL,
      debt INT NOT NULL,
      -- summary metrics (optional, can be computed dynamically)
      total_messages_sent INT DEFAULT 0,
      total_replies INT DEFAULT 0,
      avg_reply_time INTERVAL,
      last_reply_at TIMESTAMP,
      reply_percentage NUMERIC(5,2),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      chat_id BIGINT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS messages (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      debtor_id UUID REFERENCES csv_records(id) ON DELETE CASCADE,
      direction TEXT CHECK (direction IN ('sent', 'reply')), -- message direction
      message TEXT,
      sentiment TEXT,
      reply_to_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

  `);
}
