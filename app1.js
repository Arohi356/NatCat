const express = require('express');
const app = express();
const xlsx = require('xlsx');
const path = require('path');

// Start the server
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

