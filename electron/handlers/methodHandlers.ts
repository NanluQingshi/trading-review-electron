import { initDatabase, getDb } from "@electron/db/instance";

// 确保数据库初始化完成
const ensureDatabaseInitialized = () => {
  const db = getDb();
  if (!db) {
    console.log("🔧 确保数据库初始化完成...");
    initDatabase();
    console.log("✅ 数据库初始化完成");
  }
};

// 初始化数据库
initDatabase();

// 使用 better-sqlite3 的同步 API
const runQuery = (sql: string, params: any[] = []) => {
  ensureDatabaseInitialized();
  const db = getDb();
  if (!db) {
    throw new Error("Database not initialized");
  }
  const stmt = db.prepare(sql);
  const result = stmt.run(params);
  return { changes: result.changes };
};

const getQuery = (sql: string, params: any[] = []) => {
  ensureDatabaseInitialized();
  const db = getDb();
  if (!db) {
    throw new Error("Database not initialized");
  }
  const stmt = db.prepare(sql);
  return stmt.get(params);
};

const allQuery = (sql: string, params: any[] = []) => {
  ensureDatabaseInitialized();
  const db = getDb();
  if (!db) {
    throw new Error("Database not initialized");
  }
  const stmt = db.prepare(sql);
  return stmt.all(params);
};

// 策略方法类型定义
export interface Method {
  id: string;
  code: string;
  name: string;
  description?: string;
  is_default?: number;
  usage_count?: number;
  win_rate?: number;
  total_pnl?: number;
}

// 创建新策略方法
export const createMethod = (method: Method) => {
  try {
    const id =
      method.id ||
      `method_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    runQuery(
      "INSERT INTO methods (id, code, name, description, is_default, usage_count, win_rate, total_pnl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        method.code,
        method.name,
        method.description || "",
        method.is_default || 0,
        method.usage_count || 0,
        method.win_rate || 0,
        method.total_pnl || 0,
      ],
    );
    return { success: true, data: { ...method, id } };
  } catch (error) {
    console.error("创建策略方法失败:", error);
    return { success: false, message: (error as Error).message };
  }
};

// 获取所有策略方法
export const getAllMethods = () => {
  try {
    const methods = allQuery("SELECT * FROM methods");
    return { success: true, data: methods };
  } catch (error) {
    console.error("获取策略方法失败:", error);
    return { success: false, message: (error as Error).message };
  }
};

// 更新策略方法
export const updateMethod = (id: string, method: Method) => {
  try {
    runQuery(
      "UPDATE methods SET code = ?, name = ?, description = ?, is_default = ?, usage_count = ?, win_rate = ?, total_pnl = ? WHERE id = ?",
      [
        method.code,
        method.name,
        method.description || "",
        method.is_default || 0,
        method.usage_count || 0,
        method.win_rate || 0,
        method.total_pnl || 0,
        id,
      ],
    );
    return { success: true, data: { ...method, id } };
  } catch (error) {
    console.error("更新策略方法失败:", error);
    return { success: false, message: (error as Error).message };
  }
};

// 删除策略方法
export const deleteMethod = (id: string) => {
  try {
    runQuery("DELETE FROM methods WHERE id = ?", [id]);
    return { success: true };
  } catch (error) {
    console.error("删除策略方法失败:", error);
    return { success: false, message: (error as Error).message };
  }
};

// 获取单个策略方法
export const getMethod = (id: string) => {
  try {
    const method = getQuery("SELECT * FROM methods WHERE id = ?", [id]);
    if (method) {
      return { success: true, data: method };
    } else {
      return { success: false, message: "策略方法不存在" };
    }
  } catch (error) {
    console.error("获取策略方法失败:", error);
    return { success: false, message: (error as Error).message };
  }
};

// 获取默认策略方法
export const getDefaultMethod = () => {
  try {
    const method = getQuery(
      "SELECT * FROM methods WHERE is_default = 1 LIMIT 1",
    );
    if (method) {
      return { success: true, data: method };
    } else {
      return { success: false, message: "默认策略方法不存在" };
    }
  } catch (error) {
    console.error("获取默认策略方法失败:", error);
    return { success: false, message: (error as Error).message };
  }
};

// 设置默认策略方法
export const setDefaultMethod = (id: string) => {
  try {
    // 先将所有方法的 is_default 设置为 0
    runQuery("UPDATE methods SET is_default = 0");
    // 再将指定方法的 is_default 设置为 1
    runQuery("UPDATE methods SET is_default = 1 WHERE id = ?", [id]);
    return { success: true };
  } catch (error) {
    console.error("设置默认策略方法失败:", error);
    return { success: false, message: (error as Error).message };
  }
};

// 清理脏数据
export const cleanupDirtyMethods = () => {
  try {
    // 这里可以添加清理脏数据的逻辑
    console.log("🧹 清理脏数据...");
    return { success: true };
  } catch (error) {
    console.error("清理脏数据失败:", error);
    return { success: false, message: (error as Error).message };
  }
};
