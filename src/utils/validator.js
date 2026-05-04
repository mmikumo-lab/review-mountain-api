/**
 * 入力値バリデーション用ユーティリティ
 */

/**
 * 山の名前のバリデーション
 * @param {string} name - 山の名前
 * @returns {object} { isValid: boolean, error: string|null }
 */
function validateMountainName(name) {
  if (!name) {
    return {
      isValid: false,
      error: '山の名前を入力してください'
    };
  }

  if (typeof name !== 'string') {
    return {
      isValid: false,
      error: '山の名前は文字列で入力してください'
    };
  }

  const trimmedName = name.trim();

  if (trimmedName.length === 0) {
    return {
      isValid: false,
      error: '山の名前を入力してください'
    };
  }

  if (trimmedName.length > 100) {
    return {
      isValid: false,
      error: '山の名前は100文字以内で入力してください'
    };
  }

  return {
    isValid: true,
    error: null
  };
}

/**
 * 標高差のバリデーション
 * @param {number} elevationDiff - 標高差（m）
 * @returns {object} { isValid: boolean, error: string|null }
 */
function validateElevationDiff(elevationDiff) {
  if (elevationDiff === undefined || elevationDiff === null) {
    return {
      isValid: false,
      error: '標高差を入力してください'
    };
  }

  if (typeof elevationDiff !== 'number' || isNaN(elevationDiff)) {
    return {
      isValid: false,
      error: '標高差は数値で入力してください'
    };
  }

  if (!Number.isInteger(elevationDiff)) {
    return {
      isValid: false,
      error: '標高差は整数で入力してください'
    };
  }

  if (elevationDiff < 1) {
    return {
      isValid: false,
      error: '標高差は1以上の整数で入力してください'
    };
  }

  return {
    isValid: true,
    error: null
  };
}

module.exports = {
  validateMountainName,
  validateElevationDiff
};
