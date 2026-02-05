-- 禁用外键约束检查，以便删除表
PRAGMA foreign_keys = OFF;

-- 删除旧的trades表（如果存在）
DROP TABLE IF EXISTS trades;

-- 创建新的trades表，只对direction、symbol和methodName设置非空约束
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
);

-- 重新启用外键约束检查
PRAGMA foreign_keys = ON;

-- 验证表结构
.schema trades
