const express = require('express');
const router = express.Router();
const mountainController = require('../controllers/mountainController');

// POST /api/mountains - 山を作成
router.post('/mountains', mountainController.createMountain);

// GET /api/mountains - 全件取得 or 名前検索
// クエリパラメータ name の有無で処理を分岐
router.get('/mountains', (req, res, next) => {
  // クエリパラメータ name がない場合は全件取得
  if (!req.query.name) {
    return mountainController.getAllMountains(req, res);
  }
  // name がある場合は名前検索（スクレイピング対応）
  mountainController.getMountainByNameSearch(req, res);
});

// GET /api/mountains/:id - IDで山を取得
router.get('/mountains/:id', mountainController.getMountainById);

// PUT /api/mountains/:id - 山を更新
router.put('/mountains/:id', mountainController.updateMountain);

// DELETE /api/mountains/:id - 山を削除
router.delete('/mountains/:id', mountainController.deleteMountain);

module.exports = router;
