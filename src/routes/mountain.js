const express = require('express');
const router = express.Router();
const mountainController = require('../controllers/mountainController');

// POST /api/mountains - 山を作成
router.post('/mountains', mountainController.createMountain);

// GET /api/mountains/:id - IDで山を取得
router.get('/mountains/:id', mountainController.getMountainById);

// PUT /api/mountains/:id - 山を更新
router.put('/mountains/:id', mountainController.updateMountain);

// DELETE /api/mountains/:id - 山を削除
router.delete('/mountains/:id', mountainController.deleteMountain);

module.exports = router;
