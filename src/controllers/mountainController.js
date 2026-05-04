const MountainModel = require('../models/mountainModel');
const { validateMountainName, validateElevationDiff } = require('../utils/validator');

class MountainController {
  static async getMountain(req, res) {
    try {
      const { name } = req.query;

      if (!name || name.trim() === '') {
        return res.status(400).json({
          error: 'Bad Request',
          message: '山の名前を指定してください'
        });
      }

      // Phase 2: DBから検索のみ（Phase 3でスクレイピング機能を追加予定）
      const mountain = await MountainModel.findByName(name.trim());

      if (!mountain) {
        return res.status(404).json({
          error: 'Mountain not found',
          message: '指定された山が見つかりません'
        });
      }

      return res.status(200).json({
        id: mountain.id,
        name: mountain.name,
        elevation_diff: mountain.elevation_diff
      });

    } catch (error) {
      console.error('Error in getMountain:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'サーバーエラーが発生しました'
      });
    }
  }

  static async searchMountain(req, res) {
    try {
      const { name } = req.body;

      if (!name || name.trim() === '') {
        return res.status(400).json({
          error: 'Bad Request',
          message: '山の名前を入力してください'
        });
      }

      const mountain = await MountainModel.findByName(name.trim());

      if (!mountain) {
        return res.status(404).json({
          error: 'Mountain not found',
          message: '指定された山が見つかりません'
        });
      }

      return res.status(200).json({
        id: mountain.id,
        name: mountain.name,
        elevation_diff: mountain.elevation_diff
      });

    } catch (error) {
      console.error('Error in searchMountain:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'サーバーエラーが発生しました'
      });
    }
  }

  static async createMountain(req, res) {
    try {
      const { name, elevation_diff } = req.body;

      if (!name || elevation_diff === undefined) {
        return res.status(400).json({
          error: 'Bad Request',
          message: '山の名前と標高差は必須です'
        });
      }

      const nameValidation = validateMountainName(name);
      if (!nameValidation.isValid) {
        return res.status(400).json({
          error: 'Bad Request',
          message: nameValidation.error
        });
      }

      const elevationValidation = validateElevationDiff(elevation_diff);
      if (!elevationValidation.isValid) {
        return res.status(400).json({
          error: 'Bad Request',
          message: elevationValidation.error
        });
      }

      const mountain = await MountainModel.create(name.trim(), elevation_diff);

      return res.status(201).json({
        id: mountain.id,
        name: mountain.name,
        elevation_diff: mountain.elevation_diff,
        created_at: mountain.created_at
      });

    } catch (error) {
      if (error.code === 'DUPLICATE') {
        return res.status(409).json({
          error: 'Conflict',
          message: 'この山は既に登録されています'
        });
      }

      console.error('Error in createMountain:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'サーバーエラーが発生しました'
      });
    }
  }

  static async updateMountain(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { name, elevation_diff } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'IDは数値で指定してください'
        });
      }

      if (name === undefined && elevation_diff === undefined) {
        return res.status(400).json({
          error: 'Bad Request',
          message: '更新する内容を指定してください'
        });
      }

      const updates = {};

      if (name !== undefined) {
        const nameValidation = validateMountainName(name);
        if (!nameValidation.isValid) {
          return res.status(400).json({
            error: 'Bad Request',
            message: nameValidation.error
          });
        }
        updates.name = name.trim();
      }

      if (elevation_diff !== undefined) {
        const elevationValidation = validateElevationDiff(elevation_diff);
        if (!elevationValidation.isValid) {
          return res.status(400).json({
            error: 'Bad Request',
            message: elevationValidation.error
          });
        }
        updates.elevation_diff = elevation_diff;
      }

      const mountain = await MountainModel.update(id, updates);

      if (!mountain) {
        return res.status(404).json({
          error: 'Mountain not found',
          message: '指定された山が見つかりません'
        });
      }

      return res.status(200).json({
        id: mountain.id,
        name: mountain.name,
        elevation_diff: mountain.elevation_diff,
        updated_at: mountain.updated_at
      });

    } catch (error) {
      if (error.code === 'DUPLICATE') {
        return res.status(409).json({
          error: 'Conflict',
          message: 'この山は既に登録されています'
        });
      }

      console.error('Error in updateMountain:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'サーバーエラーが発生しました'
      });
    }
  }

  static async deleteMountain(req, res) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'IDは数値で指定してください'
        });
      }

      const mountain = await MountainModel.delete(id);

      if (!mountain) {
        return res.status(404).json({
          error: 'Mountain not found',
          message: '指定された山が見つかりません'
        });
      }

      return res.status(200).json({
        message: '山を削除しました',
        id: mountain.id,
        name: mountain.name
      });

    } catch (error) {
      console.error('Error in deleteMountain:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'サーバーエラーが発生しました'
      });
    }
  }
}

module.exports = MountainController;
