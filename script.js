async function generateLeads() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    const cseId = document.getElementById('cseIdInput').value.trim();
    const keywordInput = document.getElementById('keywordInput').value.trim();

    const leadsTableDiv = document.getElementById('leadsTable');
    const totalLeadsDiv = document.getElementById('totalLeads');

    // Remove previous download button if exists
    const oldDownloadBtn = document.getElementById('downloadCsvBtn');
    if (oldDownloadBtn) oldDownloadBtn.remove();

    if (!apiKey || !cseId || !keywordInput) {
        leadsTableDiv.innerHTML = '<div class="error">Please enter API Key, CSE ID, and at least one keyword.</div>';
        totalLeadsDiv.textContent = 'Total Leads: 0';
        return;
    }

    // Split keywords by comma
    const keywords = keywordInput.split(',').map(k => k.trim()).filter(k => k.length > 0);
    if (keywords.length === 0) {
        leadsTableDiv.innerHTML = '<div class="error">Please enter valid keywords.</div>';
        totalLeadsDiv.textContent = 'Total Leads: 0';
        return;
    }

    leadsTableDiv.innerHTML = 'Searching...';

    const usernames = new Set();
    const batchSize = 10; // max results per API request

    try {
        for (const keyword of keywords) {
            let startIndex = 1;
            let moreResults = true;

            while (moreResults && startIndex <= 91) { // max start = 91 to stay <=100 results
                const query = encodeURIComponent(`${keyword} site:instagram.com`);
                const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cseId}&q=${query}&num=${batchSize}&start=${startIndex}`;

                const response = await fetch(url);
                const data = await response.json();

                if (data.error) {
                    leadsTableDiv.innerHTML = `<div class="error">API Error: ${data.error.message}</div>`;
                    return;
                }

                if (!data.items || data.items.length === 0) {
                    moreResults = false;
                    break;
                }

                data.items.forEach(item => {
                    const link = item.link;
                    const match = link.match(/instagram\.com\/([a-zA-Z0-9._]+)/);
                    if (match) usernames.add(match[1]);
                });

                startIndex += batchSize;
            }

            // Add keyword to search history
            const history = document.getElementById('keywordHistory');
            const li = document.createElement('li');
            li.textContent = keyword;
            history.appendChild(li);
        }

        // Build the table
        if (usernames.size === 0) {
            leadsTableDiv.innerHTML = '<div>No results found.</div>';
            totalLeadsDiv.textContent = 'Total Leads: 0';
        } else {
            const table = document.createElement('table');
            const headerRow = table.insertRow();
            headerRow.innerHTML = '<th>Username</th><th>Profile Link</th>';

            usernames.forEach(username => {
                const row = table.insertRow();
                row.innerHTML = `<td>${username}</td><td><a href="https://instagram.com/${username}" target="_blank">https://instagram.com/${username}</a></td>`;
            });

            leadsTableDiv.innerHTML = '';
            leadsTableDiv.appendChild(table);
            totalLeadsDiv.textContent = 'Total Leads: ' + usernames.size;

            // Add CSV download button
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

    } catch (err) {
        leadsTableDiv.innerHTML = `<div class="error">Error fetching data: ${err.message}</div>`;
        totalLeadsDiv.textContent = 'Total Leads: 0';
    }
}

// CSV download function
function downloadCSV(usernamesSet) {
    const csvRows = [];
    csvRows.push(['Username', 'Profile Link']);

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
