chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get('blockedCompanies', (data) => {
    if (!data.blockedCompanies) {
      chrome.storage.sync.set({ blockedCompanies: [] });
    }
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getBlockedCompanies") {
    chrome.storage.sync.get('blockedCompanies', (data) => {
      sendResponse({ blockedCompanies: data.blockedCompanies || [] });
    });
    return true;
  }
});