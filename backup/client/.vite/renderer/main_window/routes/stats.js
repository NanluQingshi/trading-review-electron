const express = require('express');
const router = express.Router();
const pool = require('../db');

// 获取统计数据
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (startDate) {
      whereClause += ' AND entryTime >= ?';
      params.push(startDate);
    }
    if (endDate) {
      whereClause += ' AND entryTime <= ?';
      params.push(endDate);
    }

    // 1. 基础统计
    const [overviewRows] = await pool.query(`
      SELECT 
        COUNT(*) as totalTrades,
        SUM(CASE WHEN result = 'win' THEN 1 ELSE 0 END) as winTrades,
        SUM(CASE WHEN result = 'loss' THEN 1 ELSE 0 END) as lossTrades,
        SUM(CASE WHEN result = 'breakeven' THEN 1 ELSE 0 END) as breakevenTrades,
        SUM(profit) as totalProfit,
        AVG(profit) as avgProfit,
        AVG(CASE WHEN result = 'win' THEN profit ELSE NULL END) as avgWin,
        AVG(CASE WHEN result = 'loss' THEN ABS(profit) ELSE NULL END) as avgLoss,
        SUM(CASE WHEN result = 'win' THEN profit ELSE 0 END) as totalWinProfit,
        SUM(CASE WHEN result = 'loss' THEN ABS(profit) ELSE 0 END) as totalLossProfit,
        SUM(expectedProfit) as totalExpectedProfit,
        AVG(expectedProfit) as avgExpectedProfit
      FROM trades
      ${whereClause}
    `, params);

    const overview = overviewRows[0];
    const winRate = overview.totalTrades > 0 ? (overview.winTrades / overview.totalTrades * 100).toFixed(2) : 0;
    const profitFactor = overview.totalLossProfit > 0 ? (overview.totalWinProfit / overview.totalLossProfit).toFixed(2) : 0;

    // 2. 按货币对统计
    const [symbolRows] = await pool.query(`
      SELECT 
        symbol,
        COUNT(*) as count,
        SUM(CASE WHEN result = 'win' THEN 1 ELSE 0 END) as wins,
        SUM(profit) as profit,
        SUM(expectedProfit) as expectedProfit
      FROM trades
      ${whereClause}
      GROUP BY symbol
    `, params);

    const symbolStats = symbolRows.map(s => ({
      ...s,
      winRate: s.count > 0 ? ((s.wins / s.count) * 100).toFixed(2) : 0
    }));

    // 3. 按方法统计
    const [methodRows] = await pool.query(`
      SELECT 
        methodId,
        methodName,
        COUNT(*) as count,
        SUM(CASE WHEN result = 'win' THEN 1 ELSE 0 END) as wins,
        SUM(profit) as profit,
        SUM(expectedProfit) as expectedProfit
      FROM trades
      ${whereClause}
      GROUP BY methodId, methodName
    `, params);

    const methodStats = methodRows.map(m => ({
      ...m,
      winRate: m.count > 0 ? ((m.wins / m.count) * 100).toFixed(2) : 0
    }));

    // 4. 每日盈亏曲线
    const [curveRows] = await pool.query(`
      SELECT 
        DATE(entryTime) as date,
        SUM(profit) as profit
      FROM trades
      ${whereClause}
      GROUP BY DATE(entryTime)
      ORDER BY date
    `, params);

    let cumulativeProfit = 0;
    const profitCurve = curveRows.map(row => {
      cumulativeProfit += row.profit;
      return {
        date: row.date ? row.date.toISOString().split('T')[0] : '',
        profit: row.profit,
        cumulative: cumulativeProfit
      };
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalTrades: overview.totalTrades,
          winTrades: overview.winTrades,
          lossTrades: overview.lossTrades,
          breakevenTrades: overview.breakevenTrades,
          winRate: parseFloat(winRate),
          totalProfit: overview.totalProfit || 0,
          avgProfit: parseFloat(overview.avgProfit || 0).toFixed(2),
          avgWin: parseFloat(overview.avgWin || 0).toFixed(2),
          avgLoss: parseFloat(overview.avgLoss || 0).toFixed(2),
          profitFactor: parseFloat(profitFactor),
          totalExpectedProfit: overview.totalExpectedProfit || 0,
          avgExpectedProfit: parseFloat(overview.avgExpectedProfit || 0).toFixed(2)
        },
        symbolStats,
        methodStats,
        profitCurve
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取最近交易
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const [rows] = await pool.query('SELECT * FROM trades ORDER BY entryTime DESC LIMIT ?', [limit]);
    
    const formattedRows = rows.map(row => ({
      ...row,
      tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags
    }));

    res.json({
      success: true,
      data: formattedRows
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;