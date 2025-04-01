const CHECK_INTERVAL = 1000;
let filterKeywords = [];

function loadKeywords() {
  chrome.storage.local.get(['filterKeywords'], function (result) {
    if (result.filterKeywords) {
      filterKeywords = result.filterKeywords;
      console.log('Twitter Filter: Loaded', filterKeywords.length, 'keywords');
    }
  });
}

function shouldFilter(text) {
  if (!text || filterKeywords.length === 0) return false;

  const lowerText = text.toLowerCase();
  return filterKeywords.some(keyword =>
    lowerText.includes(keyword.toLowerCase())
  );
}

function processFeed() {
  const postSelectors = [
    'article[data-testid="tweet"]',
    'div[data-testid="cellInnerDiv"]',
  ];

  postSelectors.forEach(selector => {
    const posts = document.querySelectorAll(selector);

    posts.forEach(post => {
      if (post.dataset.filtered) return;

      post.dataset.filtered = "true";

      const text = post.textContent || '';

      if (shouldFilter(text)) {
        post.style.display = 'none';
        console.log('Twitter Filter: Hiding post containing filtered keywords');
      }
    });
  });
}

function init() {
  loadKeywords();

  processFeed();

  const observer = new MutationObserver(function (mutations) {
    processFeed();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  setInterval(processFeed, CHECK_INTERVAL);

  chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (changes.filterKeywords) {
      filterKeywords = changes.filterKeywords.newValue || [];
      processFeed();
    }
  });
}

init();