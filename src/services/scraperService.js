const axios = require('axios');
const cheerio = require('cheerio');

const SCRAPER_CONFIG = {
  timeout: 10000,
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  baseUrl: 'http://www.yamaquest.com/list/search.php',
};

/**
 * yamaquest.comから山の情報をスクレイピング
 * @param {string} mountainName - 山の名前
 * @returns {Promise<Object|null>} 山の情報（標高差、総歩行時間）、見つからない場合はnull
 */
const scrapeMountainInfo = async (mountainName) => {
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

    // 最初の検索結果から情報を抽出
    const firstResult = $('.li-box').first();

    if (firstResult.length === 0) {
      console.log(`スクレイピング結果: ${mountainName} は見つかりませんでした`);
      return null;
    }

    // テーブルから標高差を取得（4番目のtd）
    const elevationDiffText = firstResult.find('.li-data tr:nth-child(2) td:nth-child(4)').text().trim();
    const elevationDiff = parseInt(elevationDiffText.replace(/[^\d]/g, ''), 10);

    if (isNaN(elevationDiff)) {
      console.log(`スクレイピング結果: ${mountainName} の標高差を抽出できませんでした`);
      return null;
    }

    // 詳細ページのURLを取得
    const detailUrl = firstResult.find('a').attr('href');
    let totalTime = null;

    if (detailUrl) {
      const fullDetailUrl = `http://www.yamaquest.com${detailUrl}`;
      console.log(`詳細ページにアクセス: ${fullDetailUrl}`);

      // 詳細ページから総歩行時間を取得
      const detailResponse = await axios.get(fullDetailUrl, {
        timeout: SCRAPER_CONFIG.timeout,
        headers: {
          'User-Agent': SCRAPER_CONFIG.userAgent,
        },
      });

      const $detail = cheerio.load(detailResponse.data);

      // 総歩行時間を抽出
      $detail('th').each((i, elem) => {
        if ($detail(elem).text().trim() === '総歩行時間') {
          // 次の<tr>要素の中の.ch-data1-valを探す
          const nextRow = $detail(elem).closest('tr').next();
          const timeText = nextRow.find('.ch-data1-val').text().trim();
          if (timeText) {
            totalTime = timeText.replace(/\s+/g, '');
          }
        }
      });
    }

    console.log(`スクレイピング成功: ${mountainName} = ${elevationDiff}m, 総歩行時間: ${totalTime || '不明'}`);

    return {
      elevation_diff: elevationDiff,
      total_time: totalTime,
    };
  } catch (error) {
    console.error('scrapeMountainInfo error:', error.message);
    return null;
  }
};

/**
 * 後方互換性のため、標高差のみを返す関数
 * @param {string} mountainName - 山の名前
 * @returns {Promise<number|null>} 標高差（m）、見つからない場合はnull
 */
const scrapeElevationDiff = async (mountainName) => {
  const info = await scrapeMountainInfo(mountainName);
  return info ? info.elevation_diff : null;
};

module.exports = {
  scrapeElevationDiff,
  scrapeMountainInfo,
};
