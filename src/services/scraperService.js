const axios = require('axios');
const cheerio = require('cheerio');

const SCRAPER_CONFIG = {
  timeout: 10000,
  userAgent: 'Mozilla/5.0',
  retryCount: 3,
  retryDelay: 1000,
};

// ダミーデータ（yamaquest.comの実際の構造に応じて実装を変更）
const MOCK_DATA = {
  '白馬岳': 1200,
  '槍ヶ岳': 1400,
  '剣岳': 1300,
  '北岳': 1500,
  '穂高岳': 1350,
  '立山': 1100,
  '八ヶ岳': 1100,
  '赤岳': 950,
  '甲斐駒ヶ岳': 1400,
  '仙丈ヶ岳': 1350,
};

/**
 * yamaquest.comから標高差をスクレイピング
 * @param {string} mountainName - 山の名前
 * @returns {Promise<number|null>} 標高差（m）、見つからない場合はnull
 */
const scrapeElevationDiff = async (mountainName) => {
  try {
    console.log(`スクレイピング開始: ${mountainName}`);

    // ダミー実装: モックデータから取得
    // 実際の実装では、yamaquest.comにアクセスしてスクレイピング
    if (MOCK_DATA[mountainName]) {
      console.log(`モックデータから取得: ${mountainName} = ${MOCK_DATA[mountainName]}m`);
      return MOCK_DATA[mountainName];
    }

    // 実際の実装例（コメントアウト）
    /*
    const response = await axios.get('http://www.yamaquest.com/', {
      params: { search: mountainName },
      timeout: SCRAPER_CONFIG.timeout,
      headers: {
        'User-Agent': SCRAPER_CONFIG.userAgent,
      },
    });

    const $ = cheerio.load(response.data);

    // サイトのHTML構造に応じて標高差を抽出
    const elevationDiffText = $('.elevation-diff').text();
    const elevationDiff = parseInt(elevationDiffText, 10);

    if (isNaN(elevationDiff)) {
      return null;
    }

    return elevationDiff;
    */

    // 見つからない場合
    console.log(`スクレイピング結果: ${mountainName} は見つかりませんでした`);
    return null;
  } catch (error) {
    console.error('scrapeElevationDiff error:', error);
    return null;
  }
};

module.exports = {
  scrapeElevationDiff,
};
