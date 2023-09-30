const express = require('express');
const app = express();
const xlsx = require('xlsx');
const path = require('path');
// Serve static files (e.g., your Excel file)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to handle risk index lookup
app.get('/lookup', (req, res) => {
  const { lat, long } = req.query;
  const workbook = xlsx.readFile('public/risk-data.xlsx'); // Change the filename as needed
  const sheetName = 'Sheet1'; // Change the sheet name as needed

  const worksheet = workbook.Sheets[sheetName];
  //console.log("worksheet", worksheet)
  if (!worksheet) {
    res.status(500).json({ error: 'Worksheet not found' });
    return;
  }

  // Find the corresponding row based on latitude and longitude
  const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  const latIndex = rows[0].indexOf('Lat');
  const longIndex = rows[0].indexOf('Long');
  const riskIndexIndex = rows[0].indexOf('Riskindex');
  //console.log(latIndex)
  //console.log(longIndex)
  //console.log(riskIndexIndex)
  //console.log(rows)
  if (latIndex === -1 || longIndex === -1 || riskIndexIndex === -1) {
    res.status(500).json({ error: 'Columns not found' });
    return;
  }
  console.log(lat)
  console.log(long)
  const rowIndex = rows.findIndex(row => row[latIndex] === lat && row[longIndex] === long);
  //console.log(rows.findIndex (row => row[latIndex] === lat))
  if (rowIndex !== -1 && rows[rowIndex][riskIndexIndex] !== undefined) {
    const riskIndex = rows[rowIndex][riskIndexIndex];
    console.log("risk", riskIndex)
    res.json({ riskIndex });
  } else {
    res.status(404).json({ error: 'Data not found' });
  }
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
