let leads = [];

function addKeywordToHistory(keyword) {
  if (!keyword) return;
  const historyList = document.getElementById("keywordHistory");
  const li = document.createElement("li");
  li.textContent = keyword;
  historyList.appendChild(li);
}

async function generateLeads() {
  const apiKey = document.getElementById("apiKeyInput").value.trim();
  const cseId = document.getElementById("cseIdInput").value.trim();
  const keyword = document.getElementById("keywordInput").value.trim();

  if (!apiKey || !cseId || !keyword) {
    alert("Please enter API key, CSE ID, and keyword.");
    return;
  }

  addKeywordToHistory(keyword);

  leads = [];
  renderResults(); // clear previous results

  try {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cseId}&q=site:instagram.com+${encodeURIComponent(keyword)}`
    );
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      alert("No results found.");
      return;
    }

    data.items.forEach(item => {
      const url = item.link;
      // Extract username from URL
      const match = url.match(/instagram\.com\/([a-zA-Z0-9._]+)/);
      if (match) {
        const username = match[1];
        leads.push({ username, profileLink: `https://www.instagram.com/${username}/` });
      }
    });

    renderResults();
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Error fetching data. Check console.");
  }
}

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
