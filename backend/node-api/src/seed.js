require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mysql = require('mysql2/promise');

const run = async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
  await conn.end();

  const db = require('./config/db');

  // ── Core auth tables ──────────────────────────────────────────────────────
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      name         VARCHAR(100)  NOT NULL,
      email        VARCHAR(150)  NOT NULL UNIQUE,
      password     VARCHAR(255)  NOT NULL,
      avatar_url   VARCHAR(500)  NULL,
      public_slug  VARCHAR(100)  NULL UNIQUE,
      is_public    TINYINT(1)    DEFAULT 0,
      created_at   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
      updated_at   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      user_id    INT          NOT NULL,
      token      VARCHAR(512) NOT NULL UNIQUE,
      created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // ── Platform connections ──────────────────────────────────────────────────
  await db.query(`
    CREATE TABLE IF NOT EXISTS connected_accounts (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      user_id     INT          NOT NULL,
      provider    VARCHAR(50)  NOT NULL,
      username    VARCHAR(150) NOT NULL,
      display_name VARCHAR(200) NULL,
      avatar_url  VARCHAR(500) NULL,
      profile_url VARCHAR(500) NULL,
      is_verified TINYINT(1)   DEFAULT 0,
      created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
      updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY unique_user_provider (user_id, provider)
    )
  `);

  // ── Raw platform data snapshots ───────────────────────────────────────────
  await db.query(`
    CREATE TABLE IF NOT EXISTS platform_data (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      user_id     INT          NOT NULL,
      provider    VARCHAR(50)  NOT NULL,
      raw_data    JSON         NOT NULL,
      fetched_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_platform_data_user_provider (user_id, provider)
    )
  `);

  // ── Analysis reports ──────────────────────────────────────────────────────
  await db.query(`
    CREATE TABLE IF NOT EXISTS reports (
      id               INT AUTO_INCREMENT PRIMARY KEY,
      user_id          INT          NOT NULL,
      github_username  VARCHAR(100) NOT NULL,
      platforms        JSON         NULL,
      scores           JSON         NOT NULL,
      ai_insights      JSON         NOT NULL,
      comparison       JSON         NULL,
      created_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // ── AI chat messages ──────────────────────────────────────────────────────
  await db.query(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      user_id    INT          NOT NULL,
      report_id  INT          NULL,
      role       ENUM('user','assistant') NOT NULL,
      content    TEXT         NOT NULL,
      created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
      FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE SET NULL
    )
  `);

  // ── Notifications ─────────────────────────────────────────────────────────
  await db.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      user_id    INT          NOT NULL,
      type       VARCHAR(50)  NOT NULL,
      title      VARCHAR(200) NOT NULL,
      body       TEXT         NULL,
      is_read    TINYINT(1)   DEFAULT 0,
      created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_notifications_user (user_id, is_read)
    )
  `);

  // ── Indexes ───────────────────────────────────────────────────────────────
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_reports_user_id         ON reports(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_reports_github_username ON reports(github_username)',
    'CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id  ON refresh_tokens(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_connected_accounts_user ON connected_accounts(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_chat_messages_user      ON chat_messages(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_users_public_slug       ON users(public_slug)',
  ];
  for (const sql of indexes) await db.query(sql).catch(() => {});

  console.log('✅ All tables and indexes created successfully');
  process.exit(0);
};

run().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
