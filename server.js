const PORT = 9000;

const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'frontend/build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
