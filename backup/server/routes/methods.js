const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const pool = require('../db');

// 获取所有方法（兼容旧端点）
const getMethods = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM methods');
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 获取单个方法（兼容旧端点）
const getMethod = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM methods WHERE id = ?', [req.params.id]);
    if (rows.length > 0) {
      res.json({
        success: true,
        data: rows[0]
      });
    } else {
      res.status(404).json({
        success: false,
        message: '方法不存在'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 创建新方法（兼容旧端点）
const createMethod = async (req, res) => {
  try {
    const { code, name, description, is_default } = req.body;
    const id = uuidv4();
    const win_rate = req.body.win_rate ?? 0;
    const usage_count = req.body.usage_count ?? 0;
    const total_pnl = req.body.total_pnl ?? 0;

    await pool.query(
      'INSERT INTO methods (id, code, name, description, is_default, win_rate, usage_count, total_pnl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, code, name, description, is_default, win_rate, usage_count, total_pnl]
    );

    res.status(201).json({
      success: true,
      data: { id, code, name, description, is_default, win_rate, usage_count, total_pnl }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 更新方法（兼容旧端点）
const updateMethod = async (req, res) => {
  try {
    const { code, name, description, is_default, win_rate, usage_count, total_pnl } = req.body;
    const [result] = await pool.query(
      'UPDATE methods SET code = ?, name = ?, description = ?, is_default = ?, win_rate = ?, usage_count = ?, total_pnl = ? WHERE id = ?',
      [code, name, description, is_default, win_rate, usage_count, total_pnl, req.params.id]
    );

    if (result.affectedRows > 0) {
      res.json({
        success: true,
        data: { id: req.params.id, ...req.body }
      });
    } else {
      res.status(404).json({
        success: false,
        message: '方法不存在'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 删除方法（兼容旧端点）
const deleteMethod = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM methods WHERE id = ?', [req.params.id]);
    if (result.affectedRows > 0) {
      res.json({
        success: true,
        message: '删除成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '方法不存在'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 新的语义化端点
router.get('/list', getMethods);
router.get('/detail/:id', getMethod);
router.post('/create', createMethod);
router.put('/update/:id', updateMethod);
router.delete('/delete/:id', deleteMethod);

module.exports = router;