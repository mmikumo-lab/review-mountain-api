const mountainModel = require('../models/mountainModel');
const { validateMountainName, validateElevationDiff } = require('../utils/validator');
const scraperService = require('../services/scraperService');

/**
 * POST /api/mountains - 山を作成
 */
const createMountain = async (req, res) => {
  try {
    const { name, elevation_diff } = req.body;

    // バリデーション
    const nameValidation = validateMountainName(name);
    if (!nameValidation.valid) {
      return res.status(400).json({ error: nameValidation.error });
    }

    const elevationValidation = validateElevationDiff(elevation_diff);
    if (!elevationValidation.valid) {
      return res.status(400).json({ error: elevationValidation.error });
    }

    // 重複チェック
    const existing = await mountainModel.getMountainByName(name);
    if (existing) {
      return res.status(409).json({ error: 'この山は既に登録されています' });
    }

    // 作成
    const mountain = await mountainModel.createMountain(name, elevation_diff);
    res.status(201).json(mountain);
  } catch (error) {
    console.error('createMountain error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
};

/**
 * GET /api/mountains/:id - IDで山を取得
 */
const getMountainById = async (req, res) => {
  try {
    const { id } = req.params;
    const mountain = await mountainModel.getMountainById(id);

    if (!mountain) {
      return res.status(404).json({ error: '山が見つかりません' });
    }

    res.json(mountain);
  } catch (error) {
    console.error('getMountainById error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
};

/**
 * PUT /api/mountains/:id - 山を更新
 */
const updateMountain = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, elevation_diff } = req.body;

    // 存在チェック
    const existing = await mountainModel.getMountainById(id);
    if (!existing) {
      return res.status(404).json({ error: '山が見つかりません' });
    }

    // バリデーション
    const nameValidation = validateMountainName(name);
    if (!nameValidation.valid) {
      return res.status(400).json({ error: nameValidation.error });
    }

    const elevationValidation = validateElevationDiff(elevation_diff);
    if (!elevationValidation.valid) {
      return res.status(400).json({ error: elevationValidation.error });
    }

    // 更新
    const mountain = await mountainModel.updateMountain(id, name, elevation_diff);
    res.json(mountain);
  } catch (error) {
    console.error('updateMountain error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
};

/**
 * GET /api/mountains?name={mountainName} - 山を名前で検索（スクレイピング対応）
 */
const getMountainByNameSearch = async (req, res) => {
  try {
    const { name } = req.query;

    // バリデーション
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: '山の名前を指定してください',
      });
    }

    // DBで検索
    let mountain = await mountainModel.getMountainByName(name);

    // DBにない場合はスクレイピング
    if (!mountain) {
      console.log(`山 "${name}" がDBにありません。スクレイピングを試みます...`);

      const elevationDiff = await scraperService.scrapeElevationDiff(name);

      if (elevationDiff === null) {
        return res.status(404).json({
          error: 'Mountain not found',
          message: '指定された山が見つかりません',
        });
      }

      // スクレイピング結果をDBに保存
      mountain = await mountainModel.createMountain(name, elevationDiff);
      console.log(`山 "${name}" をDBに保存しました（標高差: ${elevationDiff}m）`);
    }

    res.json(mountain);
  } catch (error) {
    console.error('getMountainByNameSearch error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'サーバーエラーが発生しました',
    });
  }
};

/**
 * GET /api/mountains - 全ての山を取得
 */
const getAllMountains = async (req, res) => {
  try {
    const mountains = await mountainModel.getAllMountains();
    res.json(mountains);
  } catch (error) {
    console.error('getAllMountains error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'サーバーエラーが発生しました',
    });
  }
};

/**
 * DELETE /api/mountains/:id - 山を削除
 */
const deleteMountain = async (req, res) => {
  try {
    const { id } = req.params;
    const mountain = await mountainModel.deleteMountain(id);

    if (!mountain) {
      return res.status(404).json({ error: '山が見つかりません' });
    }

    res.json({ message: '山を削除しました', mountain });
  } catch (error) {
    console.error('deleteMountain error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
};

module.exports = {
  createMountain,
  getMountainById,
  getMountainByNameSearch,
  updateMountain,
  deleteMountain,
  getAllMountains,
};
