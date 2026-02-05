import { initDatabase } from "../db/instance";

// 获取数据库实例
const db = initDatabase();

// 交易记录类型定义
export interface Trade {
  id?: number;
  symbol: string;
  direction: "long" | "short";
  entryPrice?: number;
  exitPrice?: number;
  entryTime: string;
  exitTime: string;
  lots?: number;
  profit?: number;
  expectedProfit?: number;
  methodId?: string;
  methodName: string;
  notes?: string;
  tags?: string[];
  result?: "win" | "loss" | "breakeven";
}

// 注册交易相关的IPC处理函数
export function registerTradeHandlers() {
  // 这里将在main.ts中通过ipcMain.handle注册
}

// 获取所有交易记录
export const getTrades = (filters?: {
  symbol?: string;
  methodId?: string;
  result?: string;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    let query = "SELECT * FROM trades WHERE 1=1";
    const params: any[] = [];

    if (filters?.symbol) {
      query += " AND symbol = ?";
      params.push(filters.symbol);
    }
    if (filters?.methodId) {
      query += " AND methodId = ?";
      params.push(filters.methodId);
    }
    if (filters?.result) {
      query += " AND result = ?";
      params.push(filters.result);
    }
    if (filters?.startDate) {
      query += " AND entryTime >= ?";
      params.push(filters.startDate);
    }
    if (filters?.endDate) {
      query += " AND entryTime <= ?";
      params.push(filters.endDate);
    }

    query += " ORDER BY exitTime DESC";

    const rows = db.prepare(query).all(params);

    // 处理 tags 字段
    const formattedRows = rows.map((row: any) => ({
      ...row,
      tags: typeof row.tags === "string" ? JSON.parse(row.tags) : row.tags,
    }));

    return {
      success: true,
      data: formattedRows,
    };
  } catch (error) {
    console.error("获取交易记录失败:", error);
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

// 获取单个交易记录
export const getTrade = (id: number) => {
  try {
    const row = db.prepare("SELECT * FROM trades WHERE id = ?").get(id);

    if (row) {
      const trade = {
        ...row,
        tags: typeof row.tags === "string" ? JSON.parse(row.tags) : row.tags,
      };
      return {
        success: true,
        data: trade,
      };
    } else {
      return {
        success: false,
        message: "交易记录不存在",
      };
    }
  } catch (error) {
    console.error("获取交易记录失败:", error);
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

// 创建新交易记录
export const createTrade = (trade: Trade) => {
  try {
    // 使用用户手动输入的盈亏值
    const profit = trade.profit;

    // 如果没有提供methodName，尝试从methods表中查询
    let methodName = trade.methodName;
    if (!methodName && trade.methodId) {
      const method = db
        .prepare("SELECT name FROM methods WHERE id = ?")
        .get(trade.methodId);
      if (method) {
        methodName = method.name;
      }
    }

    const result = db
      .prepare(
        "INSERT INTO trades (symbol, direction, entryPrice, exitPrice, entryTime, exitTime, lots, profit, expectedProfit, methodId, methodName, notes, tags, result) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      )
      .run(
        trade.symbol,
        trade.direction,
        trade.entryPrice || null,
        trade.exitPrice || null,
        trade.entryTime,
        trade.exitTime,
        trade.lots || null,
        profit || null,
        trade.expectedProfit || null,
        trade.methodId,
        methodName || "",
        trade.notes || "",
        JSON.stringify(trade.tags || []),
        trade.result || null,
      );

    // 更新方法统计数据
    if (trade.methodId) {
      updateMethodStats(trade.methodId);
    }

    return {
      success: true,
      data: { id: result.lastInsertRowid, ...trade },
    };
  } catch (error) {
    console.error("创建交易失败:", error);
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

// 更新交易记录
export const updateTrade = (id: number, trade: Trade) => {
  try {
    // 使用用户手动输入的盈亏值
    const profit = trade.profit;

    // 获取旧的交易记录，以便比较methodId是否改变
    const oldTrade = db
      .prepare("SELECT methodId FROM trades WHERE id = ?")
      .get(id);
    const oldMethodId = oldTrade?.methodId;

    // 如果没有提供methodName，尝试从methods表中查询
    let methodName = trade.methodName;
    if (!methodName && trade.methodId) {
      const method = db
        .prepare("SELECT name FROM methods WHERE id = ?")
        .get(trade.methodId);
      if (method) {
        methodName = method.name;
      }
    }

    const result = db
      .prepare(
        "UPDATE trades SET symbol = ?, direction = ?, entryPrice = ?, exitPrice = ?, entryTime = ?, exitTime = ?, lots = ?, profit = ?, expectedProfit = ?, methodId = ?, methodName = ?, notes = ?, tags = ?, result = ? WHERE id = ?",
      )
      .run(
        trade.symbol,
        trade.direction,
        trade.entryPrice || null,
        trade.exitPrice || null,
        trade.entryTime,
        trade.exitTime,
        trade.lots || null,
        profit || null,
        trade.expectedProfit || null,
        trade.methodId,
        methodName || "",
        trade.notes || "",
        JSON.stringify(trade.tags || []),
        trade.result || null,
        id,
      );

    if (result.changes > 0) {
      // 如果methodId改变了，需要更新两个方法的统计数据
      if (oldMethodId !== trade.methodId) {
        if (oldMethodId) {
          updateMethodStats(oldMethodId);
        }
      }
      if (trade.methodId) {
        updateMethodStats(trade.methodId);
      }

      return {
        success: true,
        data: { id, ...trade },
      };
    } else {
      return {
        success: false,
        message: "交易记录不存在",
      };
    }
  } catch (error) {
    console.error("更新交易失败:", error);
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

// 删除交易记录
export const deleteTrade = (id: number) => {
  try {
    // 获取要删除的交易记录的methodId
    const trade = db
      .prepare("SELECT methodId FROM trades WHERE id = ?")
      .get(id);
    const methodId = trade?.methodId;

    const result = db.prepare("DELETE FROM trades WHERE id = ?").run(id);

    if (result.changes > 0) {
      // 更新方法统计数据
      if (methodId) {
        updateMethodStats(methodId);
      }

      return {
        success: true,
        message: "删除成功",
      };
    } else {
      return {
        success: false,
        message: "交易记录不存在",
      };
    }
  } catch (error) {
    console.error("删除交易失败:", error);
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

// 辅助函数：更新方法统计数据（使用次数和胜率）
export const updateMethodStats = (methodId: string) => {
  if (!methodId) return;

  try {
    // 统计该方法的使用次数
    const usageResult = db
      .prepare("SELECT COUNT(*) as count FROM trades WHERE methodId = ?")
      .get(methodId);
    const usageCount = usageResult?.count || 0;

    // 统计该方法的胜率
    const winResult = db
      .prepare(
        "SELECT COUNT(*) as count FROM trades WHERE methodId = ? AND result = 'win'",
      )
      .get(methodId);
    const winCount = winResult?.count || 0;
    const winRate =
      usageCount > 0 ? Math.round((winCount / usageCount) * 100) / 100 : 0;

    // 统计总盈亏
    const pnlResult = db
      .prepare("SELECT SUM(profit) as total FROM trades WHERE methodId = ?")
      .get(methodId);
    const totalPnl = pnlResult?.total || 0;

    // 更新方法的统计数据
    db.prepare(
      "UPDATE methods SET usage_count = ?, win_rate = ?, total_pnl = ? WHERE id = ?",
    ).run(usageCount, winRate, totalPnl, methodId);

    console.log(
      `📊 更新方法 ${methodId} 的统计数据：使用次数=${usageCount}，胜率=${winRate}，总盈亏=${totalPnl}`,
    );
  } catch (error) {
    console.error("更新方法统计数据失败:", error);
  }
};
