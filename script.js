let leads = [];

// Add keyword to baby pink search history box
function addKeywordToHistory(keyword) {
  if (!keyword) return;
  const historyList = document.getElementById("keywordHistory");
  const li = document.createElement("li");
  li.textContent = keyword;
  historyList.appendChild(li);
}

function generateLeads() {
  const input = document.getElementById("usernameInput").value.trim();
  if (!input) {
    alert("Please enter usernames or keywords.");
    return;
  }

  addKeywordToHistory(input);

  leads = [];

  // Split input by newlines or commas, trim whitespace
  const usernames = input
    .split(/[\r\n,]+/)
    .map(u => u.trim())
    .filter(u => u !== "");

  usernames.forEach(username => {
    const profileLink = `https://www.instagram.com/${username}/`;
    leads.push({ username, profileLink });
  });

  renderResults();
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
