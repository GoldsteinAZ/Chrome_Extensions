function removeBlockedCompanyOffers(blockedCompanies) {
  if (!blockedCompanies || blockedCompanies.length === 0) return;
  
  const blockedLowerCase = blockedCompanies.map(company => company.toLowerCase());
  
  const companyNameElements = document.querySelectorAll('[data-test="text-company-name"]');
  
  companyNameElements.forEach(element => {
    const companyName = element.textContent.trim().toLowerCase();
    
    if (blockedLowerCase.includes(companyName)) {

      let offerContainer = element.closest('.tiles_b18pwp01');
      if (!offerContainer) {
        offerContainer = element.closest('.tiles_cobg3mp');
      }
      if (!offerContainer) {
        offerContainer = element.closest('[data-test="default-offer"]');
      }
      
      if (offerContainer) {
        offerContainer.style.transition = "opacity 0.3s";
        offerContainer.style.opacity = "0";
        
        setTimeout(() => {
          if (offerContainer.parentNode) {
            offerContainer.parentNode.removeChild(offerContainer);
          }
        }, 300);
      }
    }
  });
}

function observeDOMChanges() {
  const config = { 
    childList: true, 
    subtree: true 
  };
  
  const callback = function(mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        chrome.runtime.sendMessage({ action: "getBlockedCompanies" }, (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
          }
          removeBlockedCompanyOffers(response.blockedCompanies);
        });
        break;
      }
    }
  };
  
  const observer = new MutationObserver(callback);
  
  observer.observe(document.body, config);
}

chrome.runtime.sendMessage({ action: "getBlockedCompanies" }, (response) => {
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError);
    return;
  }
  
  removeBlockedCompanyOffers(response.blockedCompanies);
  observeDOMChanges();
});