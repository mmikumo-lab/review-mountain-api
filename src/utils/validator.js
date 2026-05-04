// バリデーション関数

/**
 * 山名のバリデーション
 * @param {string} name - 山の名前
 * @returns {Object} { valid: boolean, error?: string }
 */
const validateMountainName = (name) => {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: '山の名前は必須です' };
  }
  if (name.trim().length === 0) {
    return { valid: false, error: '山の名前を入力してください' };
  }
  if (name.length > 100) {
    return { valid: false, error: '山の名前は100文字以内で入力してください' };
  }
  return { valid: true };
};

/**
 * 標高差のバリデーション
 * @param {number} elevation_diff - 標高差（メートル）
 * @returns {Object} { valid: boolean, error?: string }
 */
const validateElevationDiff = (elevation_diff) => {
  if (elevation_diff === undefined || elevation_diff === null) {
    return { valid: false, error: '標高差は必須です' };
  }
  const num = Number(elevation_diff);
  if (!Number.isInteger(num)) {
    return { valid: false, error: '標高差は整数で入力してください' };
  }
  if (num < 0) {
    return { valid: false, error: '標高差は0以上の値を入力してください' };
  }
  if (num > 10000) {
    return { valid: false, error: '標高差は10000m以下で入力してください' };
  }
  return { valid: true };
};

module.exports = {
  validateMountainName,
  validateElevationDiff,
};
