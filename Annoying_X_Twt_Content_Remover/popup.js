document.addEventListener('DOMContentLoaded', function () {
  const keywordsTextarea = document.getElementById('keywords');
  const saveButton = document.getElementById('save');
  const clearButton = document.getElementById('clear');
  const statusDiv = document.getElementById('status');

  chrome.storage.local.get(['filterKeywords'], function (result) {
    if (result.filterKeywords) {
      keywordsTextarea.value = result.filterKeywords.join('\n');
    }
  });

  saveButton.addEventListener('click', function () {
    const keywords = keywordsTextarea.value
      .split('\n')
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0);

    chrome.storage.local.set({ filterKeywords: keywords }, function () {
      statusDiv.textContent = 'Filters saved! Reload Twitter to apply changes.';
      setTimeout(() => {
        statusDiv.textContent = '';
      }, 3000);
    });
  });

  clearButton.addEventListener('click', function () {
    keywordsTextarea.value = '';
    chrome.storage.local.set({ filterKeywords: [] }, function () {
      statusDiv.textContent = 'Filters cleared! Reload Twitter to apply changes.';
      setTimeout(() => {
        statusDiv.textContent = '';
      }, 3000);
    });
  });
});