require('dotenv').config({ path: require('path').resolve(__dirname, '../node-api/.env') });
const mysql = require('mysql2/promise');

const run = async () => {
  // Ensure the database exists before the pool connects
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
  await conn.end();

  const db = require('../node-api/src/config/db');
  // Users
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      name        VARCHAR(100)  NOT NULL,
      email       VARCHAR(150)  NOT NULL UNIQUE,
      password    VARCHAR(255)  NOT NULL,
      created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
      updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Refresh tokens (one-time use, rotated on every refresh)
  await db.query(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      user_id     INT           NOT NULL,
      token       VARCHAR(512)  NOT NULL UNIQUE,
      created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Connected accounts (GitHub, etc.)
  await db.query(`
    CREATE TABLE IF NOT EXISTS connected_accounts (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      user_id     INT           NOT NULL,
      provider    VARCHAR(50)   NOT NULL,
      username    VARCHAR(100)  NOT NULL,
      created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
      updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY  unique_user_provider (user_id, provider)
    )
  `);

  // Reports
  await db.query(`
    CREATE TABLE IF NOT EXISTS reports (
      id               INT AUTO_INCREMENT PRIMARY KEY,
      user_id          INT           NOT NULL,
      github_username  VARCHAR(100)  NOT NULL,
      scores           JSON          NOT NULL,
      ai_insights      JSON          NOT NULL,
      created_at       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Indexes for query performance
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_reports_user_id        ON reports(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_reports_github_username ON reports(github_username)',
    'CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id  ON refresh_tokens(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_connected_accounts_user ON connected_accounts(user_id)',
  ];

  for (const sql of indexes) {
    await db.query(sql).catch(() => {}); // ignore "already exists" errors
  }

  console.log('\u2705 Tables and indexes created successfully');
  process.exit(0);
};

run().catch((err) => {
  console.error('\u274c Seed failed:', err.message);
  process.exit(1);
});
