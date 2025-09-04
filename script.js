let leads = [];

// Add keyword to baby pink search history
function addKeywordToHistory(keyword) {
  if (!keyword) return;
  const historyList = document.getElementById("keywordHistory");
  const li = document.createElement("li");
  li.textContent = keyword;
  historyList.appendChild(li);
}

// Helper to fetch one page of results
async function fetchGoogleResults(apiKey, cseId, keyword, start) {
  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cseId}&q=site:instagram.com+${encodeURIComponent(keyword)}&start=${start}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.items || [];
}

// Main function to generate leads
async function generateLeads() {
  const apiKeys = document.getElementById("apiKeyInput").value.trim().split(',').map(k => k.trim());
  const cseId = document.getElementById("cseIdInput").value.trim();
  const keyword = document.getElementById("keywordInput").value.trim();

  if (!apiKeys.length || !cseId || !keyword) {
    alert("Please enter API key(s), CSE ID, and keyword.");
    return;
  }

  addKeywordToHistory(keyword);
  leads = [];
  renderResults(); // clear previous

  try {
    let apiIndex = 0;
    let start = 1;
    let totalFetched = 0;

    while (totalFetched < 500) { // target up to 500 leads
      const currentApiKey = apiKeys[apiIndex % apiKeys.length];
      const items = await fetchGoogleResults(currentApiKey, cseId, keyword, start);

      if (!items.length) break; // no more results

      items.forEach(item => {
        const url = item.link;
        const match = url.match(/instagram\.com\/([a-zA-Z0-9._]+)/);
        if (match) {
          const username = match[1];
          if (!leads.some(l => l.username === username)) {
            leads.push({ username, profileLink: `https://www.instagram.com/${username}/` });
            totalFetched++;
          }
        }
      });

      start += 10;
      apiIndex++; // rotate API keys
      // Stop if Google max 100 per key reached
      if (start > 90 * apiKeys.length) break;
    }

    if (leads.length === 0) {
      alert("No results found.");
    }

    renderResults();

  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Error fetching data. Check console.");
  }
}

// Render table
function renderResults() {
  const resultsDiv = document.getElementById("results");
  if (leads.length === 0) {
    resultsDiv.innerHTML = "<p>No leads found.</p>";
    document.getElementById("downloadBtn").style.display = "none";
    return;
  }

  let html = `<table>
    <tr>
      <th>Username</th>
      <th>Profile Link</th>
    </tr>`;

  leads.forEach(lead => {
    html += `<tr>
      <td>${lead.username}</td>
      <td><a href="${lead.profileLink}" target="_blank">${lead.profileLink}</a></td>
    </tr>`;
  });

  html += `</table>`;
  resultsDiv.innerHTML = html;
  document.getElementById("downloadBtn").style.display = "block";
}

// Download to Excel
function downloadExcel() {
  if (leads.length === 0) return;

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Username,Profile Link\n";

  leads.forEach(lead => {
    csvContent += `"${lead.username}","${lead.profileLink}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "instagram_leads.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
