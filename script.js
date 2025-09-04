async function generateLeads() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    const cseId = document.getElementById('cseIdInput').value.trim();
    const keyword = document.getElementById('keywordInput').value.trim();

    const leadsTableDiv = document.getElementById('leadsTable');
    const totalLeadsDiv = document.getElementById('totalLeads');

    // Remove any previous download button
    const oldDownloadBtn = document.getElementById('downloadCsvBtn');
    if (oldDownloadBtn) oldDownloadBtn.remove();

    if (!apiKey || !cseId || !keyword) {
        leadsTableDiv.innerHTML = '<div class="error">Please enter API Key, CSE ID, and hashtag/keyword.</div>';
        totalLeadsDiv.textContent = 'Total Leads: 0';
        return;
    }

    leadsTableDiv.innerHTML = 'Searching...';

    try {
        const query = encodeURIComponent(keyword + ' site:instagram.com');
        const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cseId}&q=${query}&num=10`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            leadsTableDiv.innerHTML = `<div class="error">API Error: ${data.error.message}</div>`;
            totalLeadsDiv.textContent = 'Total Leads: 0';
            return;
        }

        if (!data.items || data.items.length === 0) {
            leadsTableDiv.innerHTML = '<div>No results found.</div>';
            totalLeadsDiv.textContent = 'Total Leads: 0';
            return;
        }

        const table = document.createElement('table');
        const headerRow = table.insertRow();
        headerRow.innerHTML = '<th>Username</th><th>Profile Link</th>';

        const usernames = new Set();

        data.items.forEach(item => {
            const link = item.link;
            const match = link.match(/instagram\.com\/([a-zA-Z0-9._]+)/);
            if (match && !usernames.has(match[1])) {
                usernames.add(match[1]);
                const row = table.insertRow();
                row.innerHTML = `<td>${match[1]}</td><td><a href="${link}" target="_blank">${link}</a></td>`;
            }
        });

        leadsTableDiv.innerHTML = '';
        leadsTableDiv.appendChild(table);
        totalLeadsDiv.textContent = 'Total Leads: ' + usernames.size;

        // Add download CSV button
        if (usernames.size > 0) {
            const downloadBtn = document.createElement('button');
            downloadBtn.id = 'downloadCsvBtn';
            downloadBtn.textContent = 'Download CSV';
            downloadBtn.style.backgroundColor = 'skyblue';
            downloadBtn.style.padding = '8px';
            downloadBtn.style.border = 'none';
            downloadBtn.style.cursor = 'pointer';
            downloadBtn.style.marginTop = '10px';
            downloadBtn.onclick = () => downloadCSV(usernames);
            leadsTableDiv.appendChild(downloadBtn);
        }

        // Update keyword history
        const history = document.getElementById('keywordHistory');
        const li = document.createElement('li');
        li.textContent = keyword;
        history.appendChild(li);

    } catch (err) {
        leadsTableDiv.innerHTML = `<div class="error">Error fetching data: ${err.message}</div>`;
        totalLeadsDiv.textContent = 'Total Leads: 0';
    }
}

// Function to download CSV
function downloadCSV(usernamesSet) {
    const csvRows = [];
    csvRows.push(['Username', 'Profile Link']); // header row

    usernamesSet.forEach(username => {
        const profileLink = `https://instagram.com/${username}`;
        csvRows.push([username, profileLink]);
    });

    const csvContent = csvRows.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'instagram_leads.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
