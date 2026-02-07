/*
 * @Author: NanluQingshi
 * @Date: 2026-02-06 15:25:31
 * @LastEditors: NanluQingshi
 * @LastEditTime: 2026-02-06 21:29:55
 * @Description:
 */
import { app } from "electron";
import path from "path";
import fs from "fs";
import { createRequire } from "module";

// 创建 require 函数
const require = createRequire(import.meta.url);

// 数据库实例
let db: any = null;

// 初始化数据库
export const initDatabase = () => {
  try {
    // 加载 better-sqlite3 模块
    const Database = require("better-sqlite3");

    // 使用 userData 目录存储数据库文件（可写目录）
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, "trading.db");
    const dbDir = path.dirname(dbPath);

    // 确保目录存在
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // 连接数据库
    db = new Database(dbPath);

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
        screenshot TEXT,
        tags TEXT DEFAULT '[]',
        result TEXT CHECK (result IN ('win', 'loss', 'breakeven')),
        FOREIGN KEY (methodId) REFERENCES methods(id) ON DELETE SET NULL
      )
    `);
  } catch (error) {
    console.error("❌ 表结构创建失败:", error);
  }
};

// 获取数据库实例
export const getDb = () => {
  return db;
};

// 导出默认值
export default getDb;
