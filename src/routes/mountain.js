const express = require('express');
const router = express.Router();
const MountainController = require('../controllers/mountainController');

// GET /api/mountains?name={name} - 山の標高差取得（Phase 3でスクレイピング対応予定）
router.get('/mountains', MountainController.getMountain);

// POST /api/mountains - 山の新規登録
router.post('/mountains', MountainController.createMountain);

// PUT /api/mountains/:id - 山の情報更新
router.put('/mountains/:id', MountainController.updateMountain);

// DELETE /api/mountains/:id - 山の削除
router.delete('/mountains/:id', MountainController.deleteMountain);

// POST /api/mountains/search - 既存の検索エンドポイント（後方互換性のため残す）
router.post('/mountains/search', MountainController.searchMountain);

module.exports = router;
