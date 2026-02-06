import { initDatabase } from "../db/instance";
import sqlite3 from "sqlite3";

// 获取数据库实例
const db = initDatabase();

// Promise 包装器
const runQuery = (sql: string, params: any[] = []) => {
  return new Promise<{ changes: number }>((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ changes: this.changes });
      }
    });
  });
};

const getQuery = (sql: string, params: any[] = []) => {
  return new Promise<any>((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const allQuery = (sql: string, params: any[] = []) => {
  return new Promise<any[]>((resolve, reject) => {
    if (!db) {
      reject(new Error("Database not initialized"));
      return;
    }
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// 统计数据类型定义
export interface Stats {
  totalTrades: number;
  totalWin: number;
  totalLoss: number;
  totalBreakeven: number;
  winRate: number;
  totalProfit: number;
  averageProfit: number;
  maxProfit: number;
  maxLoss: number;
  profitFactor: number;
  averageHoldingTime: number;
}

// 方法统计数据类型定义
export interface MethodStats {
  methodId: string;
  methodName: string;
  totalTrades: number;
  winRate: number;
  totalProfit: number;
  averageProfit: number;
  profitFactor: number;
}

// 符号统计数据类型定义
export interface SymbolStats {
  symbol: string;
  totalTrades: number;
  winRate: number;
  totalProfit: number;
  averageProfit: number;
}

// 注册统计相关的IPC处理函数
export function registerStatsHandlers() {
  // 这里将在main.ts中通过ipcMain.handle注册
}

// 获取总体统计数据
export const getOverallStats = async () => {
  try {
    // 获取交易总数
    const totalTradesResult = await getQuery("SELECT COUNT(*) as count FROM trades");
    const totalTrades = totalTradesResult?.count || 0;

    if (totalTrades === 0) {
      return {
        success: true,
        data: {
          totalTrades: 0,
          totalWin: 0,
          totalLoss: 0,
          totalBreakeven: 0,
          winRate: 0,
          totalProfit: 0,
          averageProfit: 0,
          maxProfit: 0,
          maxLoss: 0,
          profitFactor: 0,
          averageHoldingTime: 0,
          totalExpectedProfit: 0,
          avgExpectedProfit: 0,
          avgWin: 0,
          avgLoss: 0,
        },
      };
    }

    // 获取盈利、亏损、保本的交易数量
    const winResult = await getQuery("SELECT COUNT(*) as count FROM trades WHERE result = 'win'");
    const lossResult = await getQuery("SELECT COUNT(*) as count FROM trades WHERE result = 'loss'");
    const breakevenResult = await getQuery(
      "SELECT COUNT(*) as count FROM trades WHERE result = 'breakeven'"
    );

    const totalWin = winResult?.count || 0;
    const totalLoss = lossResult?.count || 0;
    const totalBreakeven = breakevenResult?.count || 0;

    // 计算胜率
    const winRate = Math.round((totalWin / totalTrades) * 100) / 100;

    // 获取总盈亏
    const profitResult = await getQuery("SELECT SUM(profit) as total FROM trades");
    const totalProfit = profitResult?.total || 0;

    // 计算平均盈亏
    const averageProfit = Math.round((totalProfit / totalTrades) * 100) / 100;

    // 获取最大盈利和最大亏损
    const maxProfitResult = await getQuery("SELECT MAX(profit) as max FROM trades WHERE profit > 0");
    const maxLossResult = await getQuery("SELECT MIN(profit) as min FROM trades WHERE profit < 0");

    const maxProfit = maxProfitResult?.max || 0;
    const maxLoss = maxLossResult?.min || 0;

    // 计算盈利因子
    const totalWinAmountResult = await getQuery("SELECT SUM(profit) as total FROM trades WHERE result = 'win'");
    const totalLossAmountResult = await getQuery(
      "SELECT SUM(ABS(profit)) as total FROM trades WHERE result = 'loss'"
    );

    const totalWinAmount = totalWinAmountResult?.total || 0;
    const totalLossAmount = totalLossAmountResult?.total || 1; // 避免除以0

    const profitFactor =
      Math.round((totalWinAmount / totalLossAmount) * 100) / 100;

    // 计算平均持有时间（简化计算，以小时为单位）
    const holdingTimeResult = await getQuery(
      "SELECT AVG((JULIANDAY(exitTime) - JULIANDAY(entryTime)) * 24) as avg FROM trades WHERE entryTime AND exitTime"
    );

    const averageHoldingTime = Math.round(
      ((holdingTimeResult?.avg || 0) * 100) / 100,
    );

    // 计算总预期盈亏和平均预期盈亏
    const expectedProfitResult = await getQuery(
      "SELECT SUM(expectedProfit) as total, AVG(expectedProfit) as avg FROM trades WHERE expectedProfit IS NOT NULL"
    );
    const totalExpectedProfit =
      Math.round((expectedProfitResult?.total || 0) * 100) / 100;
    const avgExpectedProfit =
      Math.round((expectedProfitResult?.avg || 0) * 100) / 100;

    // 计算平均盈利和平均亏损
    const avgWinResult = await getQuery("SELECT AVG(profit) as avg FROM trades WHERE result = 'win'");
    const avgLossResult = await getQuery(
      "SELECT AVG(ABS(profit)) as avg FROM trades WHERE result = 'loss'"
    );
    const avgWin = Math.round((avgWinResult?.avg || 0) * 100) / 100;
    const avgLoss = Math.round((avgLossResult?.avg || 0) * 100) / 100;

    return {
      success: true,
      data: {
        totalTrades,
        totalWin,
        totalLoss,
        totalBreakeven,
        winRate,
        totalProfit,
        averageProfit,
        maxProfit,
        maxLoss,
        profitFactor,
        averageHoldingTime,
        totalExpectedProfit,
        avgExpectedProfit,
        avgWin,
        avgLoss,
      },
    };
  } catch (error) {
    console.error("获取总体统计数据失败:", error);
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

// 获取方法统计数据
export const getMethodStats = async () => {
  try {
    const rows = await allQuery(
      `
      SELECT 
        m.id as methodId, 
        m.name as methodName, 
        COUNT(t.id) as totalTrades,
        SUM(CASE WHEN t.result = 'win' THEN 1 ELSE 0 END) as winCount,
        SUM(t.profit) as totalProfit,
        SUM(t.expectedProfit) as totalExpectedProfit,
        SUM(CASE WHEN t.result = 'win' THEN t.profit ELSE 0 END) as totalWinAmount,
        SUM(CASE WHEN t.result = 'loss' THEN ABS(t.profit) ELSE 0 END) as totalLossAmount
      FROM 
        methods m
      LEFT JOIN 
        trades t ON m.id = t.methodId
      GROUP BY 
        m.id, m.name
      ORDER BY 
        totalTrades DESC
    `
    );

    const stats = rows.map((row: any) => {
      const winRate =
        row.totalTrades > 0
          ? Math.round((row.winCount / row.totalTrades) * 100) / 100
          : 0;
      const averageProfit =
        row.totalTrades > 0
          ? Math.round((row.totalProfit / row.totalTrades) * 100) / 100
          : 0;
      const profitFactor =
        row.totalLossAmount > 0
          ? Math.round((row.totalWinAmount / row.totalLossAmount) * 100) / 100
          : 0;

      return {
        methodId: row.methodId,
        methodName: row.methodName,
        totalTrades: row.totalTrades,
        winCount: row.winCount || 0,
        winRate,
        totalProfit: row.totalProfit || 0,
        totalExpectedProfit: row.totalExpectedProfit || 0,
        averageProfit,
        profitFactor,
      };
    });

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error("获取方法统计数据失败:", error);
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

// 获取符号统计数据
export const getSymbolStats = async () => {
  try {
    const rows = await allQuery(
      `
      SELECT 
        symbol,
        COUNT(*) as totalTrades,
        SUM(CASE WHEN result = 'win' THEN 1 ELSE 0 END) as winCount,
        SUM(profit) as totalProfit,
        SUM(expectedProfit) as totalExpectedProfit
      FROM 
        trades
      GROUP BY 
        symbol
      ORDER BY 
        totalTrades DESC
    `
    );

    const stats = rows.map((row: any) => {
      const winRate =
        row.totalTrades > 0
          ? Math.round((row.winCount / row.totalTrades) * 100) / 100
          : 0;
      const averageProfit =
        row.totalTrades > 0
          ? Math.round((row.totalProfit / row.totalTrades) * 100) / 100
          : 0;

      return {
        symbol: row.symbol,
        totalTrades: row.totalTrades,
        winCount: row.winCount || 0,
        winRate,
        totalProfit: row.totalProfit || 0,
        totalExpectedProfit: row.totalExpectedProfit || 0,
        averageProfit,
      };
    });

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error("获取符号统计数据失败:", error);
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

// 获取按时间周期的统计数据（日、周、月）
export const getTimePeriodStats = async (period: "day" | "week" | "month") => {
  try {
    let dateFormat = "%Y-%m-%d"; // 默认按天
    if (period === "week") {
      dateFormat = "%Y-%W"; // 按周
    } else if (period === "month") {
      dateFormat = "%Y-%m"; // 按月
    }

    const rows = await allQuery(
      `
      SELECT 
        strftime('${dateFormat}', entryTime) as period,
        COUNT(*) as totalTrades,
        SUM(CASE WHEN result = 'win' THEN 1 ELSE 0 END) as winCount,
        SUM(profit) as totalProfit
      FROM 
        trades
      GROUP BY 
        period
      ORDER BY 
        period
    `
    );

    const stats = rows.map((row: any) => {
      const winRate =
        row.totalTrades > 0
          ? Math.round((row.winCount / row.totalTrades) * 100) / 100
          : 0;

      return {
        period: row.period,
        totalTrades: row.totalTrades,
        winRate,
        totalProfit: row.totalProfit || 0,
      };
    });

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error("获取时间周期统计数据失败:", error);
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};

// 获取盈利曲线数据
export const getProfitCurve = async () => {
  try {
    const rows = await allQuery("SELECT exitTime, profit FROM trades ORDER BY exitTime");

    let cumulativeProfit = 0;
    const curve = rows.map((row: any) => {
      cumulativeProfit += row.profit || 0;
      return {
        time: row.exitTime,
        cumulativeProfit: Math.round(cumulativeProfit * 100) / 100,
      };
    });

    return {
      success: true,
      data: curve,
    };
  } catch (error) {
    console.error("获取盈利曲线数据失败:", error);
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};
