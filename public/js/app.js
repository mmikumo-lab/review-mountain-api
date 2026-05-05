// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('searchButton');
  const searchInput = document.getElementById('searchInput');

  // 検索ボタンのクリックイベント
  searchButton.addEventListener('click', searchMountain);

  // Enterキーでも検索できるようにする
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchMountain();
    }
  });
});

// 山を検索
async function searchMountain() {
  const searchInput = document.getElementById('searchInput');
  const mountainName = searchInput.value.trim();
  const resultDiv = document.getElementById('result');

  // 入力チェック
  if (!mountainName) {
    resultDiv.innerHTML = '<p class="error">山の名前を入力してください</p>';
    return;
  }

  // ローディング表示
  resultDiv.innerHTML = '<p class="loading">検索中...</p>';

  try {
    // API呼び出し（スクレイピング対応）
    const response = await fetch(`/api/mountains?name=${encodeURIComponent(mountainName)}`);

    if (response.status === 404) {
      resultDiv.innerHTML = `<p class="error">「${mountainName}」は見つかりませんでした</p>`;
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const mountain = await response.json();
    displayResult(mountain);
  } catch (error) {
    console.error('検索エラー:', error);
    resultDiv.innerHTML = '<p class="error">エラーが発生しました。もう一度お試しください。</p>';
  }
}

// 検索結果を表示
function displayResult(mountain) {
  const resultDiv = document.getElementById('result');

  const notesHtml = mountain.notes
    ? `<p class="notes">備考: ${mountain.notes}</p>`
    : '<p class="notes no-notes">備考情報なし</p>';

  const totalTimeHtml = mountain.total_time
    ? `<p class="total-time">総歩行時間: <span class="time-value">${mountain.total_time}</span></p>`
    : '<p class="total-time no-time">総歩行時間: 不明</p>';

  resultDiv.innerHTML = `
    <div class="result-card">
      <h2>${mountain.name}</h2>
      <p class="elevation">標高差: <span class="elevation-value">${mountain.elevation_diff}m</span></p>
      ${totalTimeHtml}
      ${notesHtml}
    </div>
  `;
}
