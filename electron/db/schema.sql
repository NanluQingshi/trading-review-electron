-- 创建 methods 表
CREATE TABLE IF NOT EXISTS methods (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_default INTEGER DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  win_rate REAL DEFAULT 0,
  total_pnl REAL DEFAULT 0
);

-- 创建 trades 表
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