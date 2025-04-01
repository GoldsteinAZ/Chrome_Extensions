function updateBlockedCompaniesList(companies) {
  const listElement = document.getElementById('blockedCompaniesList');
  listElement.innerHTML = '';
  
  if (companies && companies.length > 0) {
    companies.forEach(company => {
      const listItem = document.createElement('li');
      
      const companyName = document.createElement('span');
      companyName.textContent = company;
      listItem.appendChild(companyName);
      
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Usuń';
      removeBtn.className = 'remove-btn';
      removeBtn.addEventListener('click', () => removeCompany(company));
      listItem.appendChild(removeBtn);
      
      listElement.appendChild(listItem);
    });
  } else {
    const listItem = document.createElement('li');
    listItem.textContent = 'Brak blokowanych firm';
    listElement.appendChild(listItem);
  }
}

function addCompany() {
  const companyInput = document.getElementById('companyInput');
  const companyName = companyInput.value.trim();
  
  if (!companyName) {
    alert('Wprowadź nazwę pracodawcy');
    return;
  }
  
  chrome.storage.sync.get('blockedCompanies', (data) => {
    const blockedCompanies = data.blockedCompanies || [];
    
    const companyExists = blockedCompanies.some(
      company => company.toLowerCase() === companyName.toLowerCase()
    );
    
    if (!companyExists) {
      blockedCompanies.push(companyName);
      chrome.storage.sync.set({ blockedCompanies }, () => {
        companyInput.value = '';
        updateBlockedCompaniesList(blockedCompanies);
      });
    } else {
      alert('Ta firma jest już na liście blokowanych');
    }
  });
}

function removeCompany(companyName) {
  chrome.storage.sync.get('blockedCompanies', (data) => {
    let blockedCompanies = data.blockedCompanies || [];
    
    blockedCompanies = blockedCompanies.filter(
      company => company.toLowerCase() !== companyName.toLowerCase()
    );
    
    chrome.storage.sync.set({ blockedCompanies }, () => {
      updateBlockedCompaniesList(blockedCompanies);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get('blockedCompanies', (data) => {
    updateBlockedCompaniesList(data.blockedCompanies || []);
  });
  
  document.getElementById('addCompany').addEventListener('click', addCompany);
  
  document.getElementById('companyInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addCompany();
    }
  });
});