const express = require('express');
const router = express.Router();
const pool = require('../db');

// 获取所有交易记录（兼容旧端点）
const getTrades = async (req, res) => {
  try {
    const { symbol, methodId, result, startDate, endDate } = req.query;
    
    let query = 'SELECT * FROM trades WHERE 1=1';
    const params = [];

    if (symbol) {
      query += ' AND symbol = ?';
      params.push(symbol);
    }
    if (methodId) {
      query += ' AND methodId = ?';
      params.push(methodId);
    }
    if (result) {
      query += ' AND result = ?';
      params.push(result);
    }
    if (startDate) {
      query += ' AND entryTime >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND entryTime <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY exitTime DESC';

    const [rows] = await pool.query(query, params);
    
    // 处理 tags (MySQL 中存储为 JSON 字符串或 JSON 类型)
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
};

// 获取单个交易记录（兼容旧端点）
const getTrade = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM trades WHERE id = ?', [req.params.id]);
    if (rows.length > 0) {
      const trade = rows[0];
      trade.tags = typeof trade.tags === 'string' ? JSON.parse(trade.tags) : trade.tags;
      res.json({
        success: true,
        data: trade
      });
    } else {
      res.status(404).json({
        success: false,
        message: '交易记录不存在'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 创建新交易记录（兼容旧端点）
const createTrade = async (req, res) => {
  try {
    const trade = req.body;
    // 使用用户手动输入的盈亏值，而不是计算值
    const profit = trade.profit;

    // 如果没有提供methodName，尝试从methods表中查询
    let methodName = trade.methodName;
    if (!methodName && trade.methodId) {
      const [methodRows] = await pool.query('SELECT name FROM methods WHERE id = ?', [trade.methodId]);
      if (methodRows.length > 0) {
        methodName = methodRows[0].name;
      }
    }

    const [result] = await pool.query(
      'INSERT INTO trades (symbol, direction, entryPrice, exitPrice, entryTime, exitTime, lots, profit, expectedProfit, methodId, methodName, notes, tags, result) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        trade.symbol, trade.direction, trade.entryPrice || null, trade.exitPrice || null,
        trade.entryTime, trade.exitTime, trade.lots || null, profit || null,
        trade.expectedProfit || null,
        trade.methodId, methodName || '', trade.notes || '',
        JSON.stringify(trade.tags || []), trade.result || null
      ]
    );

    // 更新方法统计数据
    await updateMethodStats(trade.methodId);

    res.status(201).json({
      success: true,
      data: { id: result.insertId, ...trade }
    });
  } catch (error) {
    console.error('创建交易失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 更新交易记录（兼容旧端点）
const updateTrade = async (req, res) => {
  try {
    const trade = req.body;
    // 使用用户手动输入的盈亏值，而不是计算值
    const profit = trade.profit;

    // 获取旧的交易记录，以便比较methodId是否改变
    const [oldTradeResult] = await pool.query('SELECT methodId FROM trades WHERE id = ?', [req.params.id]);
    const oldMethodId = oldTradeResult[0]?.methodId;

    // 如果没有提供methodName，尝试从methods表中查询
    let methodName = trade.methodName;
    if (!methodName && trade.methodId) {
      const [methodRows] = await pool.query('SELECT name FROM methods WHERE id = ?', [trade.methodId]);
      if (methodRows.length > 0) {
        methodName = methodRows[0].name;
      }
    }

    const [result] = await pool.query(
      'UPDATE trades SET symbol = ?, direction = ?, entryPrice = ?, exitPrice = ?, entryTime = ?, exitTime = ?, lots = ?, profit = ?, expectedProfit = ?, methodId = ?, methodName = ?, notes = ?, tags = ?, result = ? WHERE id = ?',
      [
        trade.symbol, trade.direction, trade.entryPrice || null, trade.exitPrice || null,
        trade.entryTime, trade.exitTime, trade.lots || null, profit || null,
        trade.expectedProfit || null,
        trade.methodId, methodName || '', trade.notes || '',
        JSON.stringify(trade.tags || []), trade.result || null,
        req.params.id
      ]
    );

    if (result.affectedRows > 0) {
      // 如果methodId改变了，需要更新两个方法的统计数据
      if (oldMethodId !== trade.methodId) {
        await updateMethodStats(oldMethodId);
      }
      await updateMethodStats(trade.methodId);

      res.json({
        success: true,
        data: { id: req.params.id, ...trade }
      });
    } else {
      res.status(404).json({
        success: false,
        message: '交易记录不存在'
      });
    }
  } catch (error) {
    console.error('更新交易失败:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 删除交易记录（兼容旧端点）
const deleteTrade = async (req, res) => {
  try {
    // 获取要删除的交易记录的methodId
    const [tradeResult] = await pool.query('SELECT methodId FROM trades WHERE id = ?', [req.params.id]);
    const methodId = tradeResult[0]?.methodId;
    
    const [result] = await pool.query('DELETE FROM trades WHERE id = ?', [req.params.id]);
    if (result.affectedRows > 0) {
      // 更新方法统计数据
      await updateMethodStats(methodId);
      
      res.json({
        success: true,
        message: '删除成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '交易记录不存在'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 新的语义化端点
router.get('/list', getTrades);
router.get('/detail/:id', getTrade);
router.post('/create', createTrade);
router.put('/update/:id', updateTrade);
router.delete('/delete/:id', deleteTrade);

// 辅助函数：计算盈亏
function calculateProfit(trade) {
  const { direction, entryPrice, exitPrice, lots } = trade;
  const pipValue = 10; 
  const pips = direction === 'long' 
    ? (exitPrice - entryPrice) * 10000 
    : (entryPrice - exitPrice) * 10000;
  return Math.round(pips * lots * pipValue);
}

// 辅助函数：计算盈亏百分比
function calculateProfitPercent(trade) {
  const { direction, entryPrice, exitPrice } = trade;
  const percent = direction === 'long'
    ? ((exitPrice - entryPrice) / entryPrice) * 100
    : ((entryPrice - exitPrice) / entryPrice) * 100;
  return Math.round(percent * 100) / 100;
}

// 辅助函数：更新方法统计数据（使用次数和胜率）
async function updateMethodStats(methodId) {
  if (!methodId) return;
  
  try {
    // 统计该方法的使用次数
    const [usageResult] = await pool.query(
      'SELECT COUNT(*) as count FROM trades WHERE methodId = ?', 
      [methodId]
    );
    const usageCount = usageResult[0].count;
    
    // 统计该方法的胜率
    const [winResult] = await pool.query(
      'SELECT COUNT(*) as count FROM trades WHERE methodId = ? AND result = "win"', 
      [methodId]
    );
    const winCount = winResult[0].count;
    const winRate = usageCount > 0 ? Math.round((winCount / usageCount) * 100) / 100 : 0;
    
    // 统计总盈亏
    const [pnlResult] = await pool.query(
      'SELECT SUM(profit) as total FROM trades WHERE methodId = ?', 
      [methodId]
    );
    const totalPnl = pnlResult[0].total || 0;
    
    // 更新方法的统计数据
    await pool.query(
      'UPDATE methods SET usage_count = ?, win_rate = ?, total_pnl = ? WHERE id = ?', 
      [usageCount, winRate, totalPnl, methodId]
    );
    
    console.log(`更新方法 ${methodId} 的统计数据：使用次数=${usageCount}，胜率=${winRate}，总盈亏=${totalPnl}`);
  } catch (error) {
    console.error('更新方法统计数据失败:', error);
  }
}

module.exports = router;