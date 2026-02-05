import { initDatabase } from "../db/instance";

// 获取数据库实例
const db = initDatabase();

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

// 注册策略方法相关的IPC处理函数
export function registerMethodHandlers() {
  // 这里将在main.ts中通过ipcMain.handle注册
}

// 获取所有策略方法
export const getMethods = () => {
  try {
    const rows = db
      .prepare("SELECT * FROM methods ORDER BY usage_count DESC, win_rate DESC")
      .all();
    return {
      success: true,
      data: rows,
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
    const row = db.prepare("SELECT * FROM methods WHERE id = ?").get(id);
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
    db.prepare(
      "INSERT INTO methods (id, code, name, description, is_default, usage_count, win_rate, total_pnl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    ).run(
      method.id,
      method.code,
      method.name,
      method.description || "",
      method.is_default || 0,
      method.usage_count || 0,
      method.win_rate || 0,
      method.total_pnl || 0,
    );

    return {
      success: true,
      data: method,
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
    const result = db
      .prepare(
        "UPDATE methods SET code = ?, name = ?, description = ?, is_default = ? WHERE id = ?",
      )
      .run(
        method.code || "",
        method.name || "",
        method.description || "",
        method.is_default || 0,
        id,
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
    const result = db.prepare("DELETE FROM methods WHERE id = ?").run(id);

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
    const row = db.prepare("SELECT * FROM methods WHERE is_default = 1").get();
    if (row) {
      return {
        success: true,
        data: row,
      };
    } else {
      // 如果没有默认策略，返回第一个策略
      const firstMethod = db.prepare("SELECT * FROM methods LIMIT 1").get();
      if (firstMethod) {
        return {
          success: true,
          data: firstMethod,
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
