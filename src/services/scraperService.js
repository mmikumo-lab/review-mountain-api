const axios = require('axios');
const cheerio = require('cheerio');

const SCRAPER_CONFIG = {
  timeout: 10000,
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  baseUrl: 'http://www.yamaquest.com/list/search.php',
};

/**
 * yamaquest.comから標高差をスクレイピング
 * @param {string} mountainName - 山の名前
 * @returns {Promise<number|null>} 標高差（m）、見つからない場合はnull
 */
const scrapeElevationDiff = async (mountainName) => {
  try {
    console.log(`スクレイピング開始: ${mountainName}`);

    // yamaquest.comの検索APIにアクセス
    const response = await axios.get(SCRAPER_CONFIG.baseUrl, {
      params: { keyw: mountainName },
      timeout: SCRAPER_CONFIG.timeout,
      headers: {
        'User-Agent': SCRAPER_CONFIG.userAgent,
      },
    });

    const $ = cheerio.load(response.data);

    // 最初の検索結果から標高差を抽出
    // HTML構造: <table class="li-data"> の中の4番目の<td>に標高差がある
    const firstResult = $('.li-box').first();

    if (firstResult.length === 0) {
      console.log(`スクレイピング結果: ${mountainName} は見つかりませんでした`);
      return null;
    }

    // テーブルから標高差を取得（4番目のtd）
    const elevationDiffText = firstResult.find('.li-data tr:nth-child(2) td:nth-child(4)').text().trim();

    // "1675m" から数値のみ抽出
    const elevationDiff = parseInt(elevationDiffText.replace(/[^\d]/g, ''), 10);

    if (isNaN(elevationDiff)) {
      console.log(`スクレイピング結果: ${mountainName} の標高差を抽出できませんでした`);
      return null;
    }

    console.log(`スクレイピング成功: ${mountainName} = ${elevationDiff}m`);
    return elevationDiff;
  } catch (error) {
    console.error('scrapeElevationDiff error:', error.message);
    return null;
  }
};

module.exports = {
  scrapeElevationDiff,
};
