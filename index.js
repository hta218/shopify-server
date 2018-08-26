const dotenv = require('dotenv').config();
const express = require('express');

const app = express();

const route = require('./route');

app.get('/', (req, res) => {
  res.status(200).json({message: "Test request successfully"});
});

app.use('/', route);

const { port } = process.env;
app.listen(port, () => console.log(`Shopify server is running on port ${port}`));
