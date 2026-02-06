import sqlite3 from "sqlite3";
import { app } from "electron";
import path from "path";
import fs from "fs";

// 延迟初始化数据库，确保 app 已完全初始化
let db: sqlite3.Database | null = null;

const initDatabase = () => {
  try {
    console.log("📁 初始化数据库连接...");

    // 获取系统路径
    const userDataPath = app.getPath("userData");
    console.log("📁 UserData 路径:", userDataPath);

    // 确保目录存在
    if (!fs.existsSync(userDataPath)) {
      console.log("📁 创建 UserData 目录...");
      fs.mkdirSync(userDataPath, { recursive: true });
      console.log("✅ UserData 目录创建成功");
    }

    const dbPath = path.join(userDataPath, "trading.db");
    console.log("📁 数据库文件路径:", dbPath);

    // 检查目录是否可写
    const testFile = path.join(userDataPath, "test.txt");
    fs.writeFileSync(testFile, "test");
    fs.unlinkSync(testFile);
    console.log("✅ 目录可写性检查成功");

    // 连接数据库
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error("❌ 数据库连接失败:", err);
        return;
      }
      console.log("✅ 数据库连接成功");

      // 创建表结构
      createTables();
    });

    return db;
  } catch (error) {
    console.error("❌ 数据库初始化失败:", error);
    // 尝试使用相对路径作为备选方案
    try {
      console.log("🔄 尝试使用相对路径作为备选方案...");
      const fallbackDbPath = path.join(__dirname, "trading.db");
      console.log("📁 备选数据库文件路径:", fallbackDbPath);

      // 确保目录存在
      const fallbackDir = path.dirname(fallbackDbPath);
      if (!fs.existsSync(fallbackDir)) {
        fs.mkdirSync(fallbackDir, { recursive: true });
      }

      // 连接数据库
      db = new sqlite3.Database(fallbackDbPath, (err) => {
        if (err) {
          console.error("❌ 备选数据库连接失败:", err);
          return;
        }
        console.log("✅ 备选数据库连接成功");

        // 创建表结构
        createTables();
      });

      return db;
    } catch (fallbackError) {
      console.error("❌ 备选数据库初始化也失败:", fallbackError);
      throw error;
    }
  }
};

// 创建表结构
const createTables = () => {
  if (!db) return;

  try {
    console.log("📋 创建表结构...");

    // 创建 methods 表
    db.run(`
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
    `, (err) => {
      if (err) {
        console.error("❌ 创建 methods 表失败:", err);
        return;
      }
      console.log("✅ methods 表创建成功");
    });

    // 创建 trades 表
    db.run(`
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
    `, (err) => {
      if (err) {
        console.error("❌ 创建 trades 表失败:", err);
        return;
      }
      console.log("✅ trades 表创建成功");
    });

    console.log("✅ 表结构创建成功");
  } catch (error) {
    console.error("❌ 表结构创建失败:", error);
  }
};

// 导出数据库实例和初始化函数
export { initDatabase };
export default db;
