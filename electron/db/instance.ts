import { app } from "electron";
import path from "path";
import fs from "fs";

// 数据库实例
let db: any = null;

// 初始化数据库
const initDatabase = () => {
  try {
    console.log("📁 初始化数据库连接...");

    // 加载 better-sqlite3 模块
    const Database = require("better-sqlite3");

    // 使用相对路径存储数据库文件
    const dbPath = path.join(__dirname, "trading.db");
    const dbDir = path.dirname(dbPath);

    // 确保目录存在
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
      console.log("✅ 数据库目录创建成功");
    }

    // 连接数据库
    db = new Database(dbPath);
    console.log("✅ 数据库连接成功");

    // 创建表结构
    createTables();

    return db;
  } catch (error) {
    console.error("❌ 数据库初始化失败:", error);
    throw error;
  }
};

// 创建表结构
const createTables = () => {
  if (!db) return;

  try {
    console.log("📋 创建表结构...");

    // 创建 methods 表
    db.exec(`
      CREATE TABLE IF NOT EXISTS methods (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        is_default INTEGER DEFAULT 0,
        usage_count INTEGER DEFAULT 0,
        win_rate REAL DEFAULT 0,
        total_pnl REAL DEFAULT 0
      )
    `);
    console.log("✅ methods 表创建成功");

    // 创建 trades 表
    db.exec(`
      CREATE TABLE IF NOT EXISTS trades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        symbol TEXT NOT NULL,
        direction TEXT CHECK (direction IN ('long', 'short')) NOT NULL,
        entryPrice REAL,
        exitPrice REAL,
        entryTime TEXT,
        exitTime TEXT,
        lots REAL,
        profit REAL,
        expectedProfit REAL DEFAULT NULL,
        methodId TEXT,
        methodName TEXT NOT NULL,
        notes TEXT,
        tags TEXT DEFAULT '[]',
        result TEXT CHECK (result IN ('win', 'loss', 'breakeven')),
        FOREIGN KEY (methodId) REFERENCES methods(id) ON DELETE SET NULL
      )
    `);
    console.log("✅ trades 表创建成功");

    console.log("✅ 表结构创建成功");
  } catch (error) {
    console.error("❌ 表结构创建失败:", error);
  }
};

// 导出数据库实例和初始化函数
export { initDatabase };
export default db;
