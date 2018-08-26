const express = require('express');
const request = require('request-promise');
const router = express.Router();

const shop = process.env.SHOPIFY_SHOP_NAME;
const productRequestUrl = `https://${shop}/admin/products.json`;

router.get('/', (req, res) => {
  let shopRequestHeaders = {
    'X-Shopify-Access-Token': req.query['X-Shopify-Access-Token']
  };

  request.get(productRequestUrl, { headers: shopRequestHeaders })
    .then((shopResponse) => {
      res.status(200).send(shopResponse);
    })
    .catch((error) => {
      res.status(error.statusCode).send(error.error.error_description);
    });
});

module.exports = router;