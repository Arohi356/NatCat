const express = require('express');
const app = express();
const xlsx = require('xlsx');
const path = require('path');

const port = process.env.PORT || 10000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Serve static files (e.g., your Excel file)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to handle risk index lookup
app.get('/', (req, res) => {
    // Your logic for the home route
    res.send('Hello, this is the home page.');
});

app.get('/lookup', (req, res) => {
  res.send('Hello, this is the home page2.');
  const { lat, long } = req.query;
  const workbook = xlsx.readFile('public/risk-data.xlsx'); // Change the filename as needed
  const sheetName = 'Sheet1'; // Change the sheet name as needed

  const worksheet = workbook.Sheets[sheetName];
  res.send('Hello, this is the home page3.');
  if (!worksheet) {
    res.status(500).json({ error: 'Worksheet not found' });
    return;
  }

  const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  const latIndex = rows[0].indexOf('Lat');
  const longIndex = rows[0].indexOf('Long');
  const riskIndexIndex = rows[0].indexOf('Riskindex');

  if (latIndex === -1 || longIndex === -1 || riskIndexIndex === -1) {
    res.status(500).json({ error: 'Columns not found' });
    return;
  }

  const rowIndex = rows.findIndex(row => row[latIndex] === lat && row[longIndex] === long);

  if (rowIndex !== -1 && rows[rowIndex][riskIndexIndex] !== undefined) {
    const riskIndex = rows[rowIndex][riskIndexIndex];
    res.json({ riskIndex });
  } else {
    res.status(404).json({ error: 'Data not found' });
  }
});

module.exports = app;

