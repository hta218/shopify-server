const express = require('express');
const request = require('request-promise');
const router = express.Router();

const shop = process.env.SHOPIFY_SHOP_NAME;
const pageRequestUrl = `https://${shop}/admin/pages.json`;

router.get('/', (req, res) => {
  let shopRequestHeaders = {
    'X-Shopify-Access-Token': req.query['X-Shopify-Access-Token']
  };

  request.get(pageRequestUrl, { headers: shopRequestHeaders })
    .then((shopResponse) => {
      res.status(200).send(shopResponse);
    })
    .catch((error) => {
      res.status(error.statusCode).send(error);
    });
});

router.post('/', (req, res) => {
  let shopRequestHeaders = {
    'X-Shopify-Access-Token': req.query['X-Shopify-Access-Token']
  };

  request({
    method: 'POST',
    uri: pageRequestUrl, 
    headers: shopRequestHeaders, 
    body: req.body,
    json: true
  }).then((shopResponse) => {
      res.status(200).send(shopResponse);
    })
    .catch((error) => {
      res.status(error.statusCode).send(error);
    });
});

router.put('/:id', (req, res) => {
  let shopRequestHeaders = {
    'X-Shopify-Access-Token': req.query['X-Shopify-Access-Token']
  };
  
  request({
    method: 'PUT',
    uri: `https://${shop}/admin/pages/${req.params.id}.json`, 
    headers: shopRequestHeaders, 
    body: req.body,
    json: true
  }).then((shopResponse) => {
      res.status(200).send(shopResponse);
    })
    .catch((error) => {
      res.status(error.statusCode).send(error);
    });
});

router.delete('/:id', (req, res) => {
  let shopRequestHeaders = {
    'X-Shopify-Access-Token': req.query['X-Shopify-Access-Token']
  };

  request({
    method: 'DELETE',
    uri: `https://${shop}/admin/pages/${req.params.id}.json`, 
    headers: shopRequestHeaders, 
  }).then((shopResponse) => {
      res.status(200).send(shopResponse);
    })
    .catch((error) => {
      res.status(error.statusCode).send(error);
    });
});

module.exports = router;