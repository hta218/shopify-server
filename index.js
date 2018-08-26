require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const route = require('./routes');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).json({message: "Test request successfully"});
});

app.use('/', route);

const { port } = process.env;
app.listen(port, () => console.log(`Shopify server is running on port ${port}`));
