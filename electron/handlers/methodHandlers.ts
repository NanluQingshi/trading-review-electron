import db, { initDatabase } from "../db/instance";

// 初始化数据库
initDatabase();

// 使用 better-sqlite3 的同步 API
const runQuery = (sql: string, params: any[] = []) => {
  if (!db) {
    throw new Error("Database not initialized");
  }
  const stmt = db.prepare(sql);
  const result = stmt.run(params);
  return { changes: result.changes };
};

const getQuery = (sql: string, params: any[] = []) => {
  if (!db) {
    throw new Error("Database not initialized");
  }
  const stmt = db.prepare(sql);
  return stmt.get(params);
};

const allQuery = (sql: string, params: any[] = []) => {
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

// 清理脏数据（没有id的策略方法）
export const cleanupDirtyMethods = async () => {
  try {
    const result = await runQuery(
      "DELETE FROM methods WHERE id IS NULL OR id = ''",
    );
    if (result.changes > 0) {
      console.log(`✅ 清理了 ${result.changes} 条没有id的脏数据`);
    }
  } catch (error) {
    console.error("清理脏数据失败:", error);
  }
};

// 注册策略方法相关的IPC处理函数
export function registerMethodHandlers() {
  // 这里将在main.ts中通过ipcMain.handle注册
}

// 获取所有策略方法
export const getMethods = () => {
  try {
    const rows = allQuery(
      "SELECT * FROM methods ORDER BY usage_count DESC, win_rate DESC",
    );

    // 过滤掉没有id的脏数据
    const validRows = rows.filter((row) => row.id);

    return {
      success: true,
      data: validRows,
    };
  } catch (error) {
    console.error("获取策略方法失败:", error);
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

// 获取单个策略方法
export const getMethod = (id: string) => {
  try {
    const row = getQuery("SELECT * FROM methods WHERE id = ?", [id]);

    if (row) {
      return {
        success: true,
        data: row,
      };
    } else {
      return {
        success: false,
        message: "策略方法不存在",
      };
    }
  } catch (error) {
    console.error("获取策略方法失败:", error);
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

// 创建新策略方法
export const createMethod = (method: Method) => {
  try {
    // 生成唯一id
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

    return {
      success: true,
      data: { ...method, id },
    };
  } catch (error) {
    console.error("创建策略方法失败:", error);
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

// 更新策略方法
export const updateMethod = (id: string, method: Partial<Method>) => {
  try {
    const result = runQuery(
      "UPDATE methods SET code = ?, name = ?, description = ?, is_default = ? WHERE id = ?",
      [
        method.code || "",
        method.name || "",
        method.description || "",
        method.is_default || 0,
        id,
      ],
    );

    if (result.changes > 0) {
      return {
        success: true,
        data: { id, ...method },
      };
    } else {
      return {
        success: false,
        message: "策略方法不存在",
      };
    }
  } catch (error) {
    console.error("更新策略方法失败:", error);
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

// 删除策略方法
export const deleteMethod = (id: string) => {
  try {
    const result = runQuery("DELETE FROM methods WHERE id = ?", [id]);

    if (result.changes > 0) {
      return {
        success: true,
        message: "删除成功",
      };
    } else {
      return {
        success: false,
        message: "策略方法不存在",
      };
    }
  } catch (error) {
    console.error("删除策略方法失败:", error);
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

// 获取默认策略方法
export const getDefaultMethod = () => {
  try {
    // 获取所有有效策略方法（有id的）
    const validMethods = allQuery(
      "SELECT * FROM methods WHERE id IS NOT NULL ORDER BY usage_count DESC, win_rate DESC",
    );

    // 查找默认策略
    const defaultMethod = validMethods.find(
      (method) => method.is_default === 1,
    );
    if (defaultMethod) {
      return {
        success: true,
        data: defaultMethod,
      };
    } else {
      // 如果没有默认策略，返回第一个有效策略
      if (validMethods.length > 0) {
        return {
          success: true,
          data: validMethods[0],
        };
      } else {
        return {
          success: false,
          message: "没有策略方法",
        };
      }
    }
  } catch (error) {
    console.error("获取默认策略方法失败:", error);
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

// 设置默认策略方法
export const setDefaultMethod = (id: string) => {
  try {
    // 首先将所有策略的is_default设置为0
    db.prepare("UPDATE methods SET is_default = 0").run();

    // 然后将指定的策略设置为默认
    const result = db
      .prepare("UPDATE methods SET is_default = 1 WHERE id = ?")
      .run(id);

    if (result.changes > 0) {
      return {
        success: true,
        message: "设置默认策略成功",
      };
    } else {
      return {
        success: false,
        message: "策略方法不存在",
      };
    }
  } catch (error) {
    console.error("设置默认策略方法失败:", error);
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};
