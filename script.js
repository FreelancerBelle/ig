<!DOCTYPE html>
<html>
<head>
  <title>Instagram Lead Generator</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; display: flex; }
    #inputSection { width: 300px; margin-right: 20px; }
    #results { flex: 1; }
    #keywordHistory { background-color: #ffc0cb; padding: 10px; list-style: none; max-height: 200px; overflow-y: auto; }
    table { border-collapse: collapse; width: 100%; margin-top: 10px; }
    th, td { border: 1px solid #ddd; padding: 8px; color: black; }
    th { background-color: #98ff98; }
    #downloadBtn { margin-top: 10px; display: none; }
    input, textarea { width: 100%; margin-top: 5px; padding: 5px; background-color: #cce5ff; border: 1px solid #007bff; }
    button { margin-top: 10px; background-color: #007bff; color: white; padding: 8px; border: none; cursor: pointer; }
  </style>
</head>
<body>

<div id="inputSection">
  <h3>Instagram Lead Generator</h3>
  <input id="apiKeyInput" placeholder="Enter API Key(s), comma separated">
  <input id="cseIdInput" placeholder="Enter Custom Search Engine ID">
  <textarea id="keywordInput" placeholder="Enter hashtag or keyword"></textarea>
  <button onclick="generateLeads()">Generate Leads</button>

  <h4>Search History</h4>
  <ul id="keywordHistory"></ul>

  <button id="downloadBtn" onclick="downloadExcel()">Download to Excel</button>
</div>

<div id="results"></div>

<script src="script.js"></script>
</body>
</html>
