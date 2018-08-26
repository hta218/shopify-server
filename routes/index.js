const express = require('express');
const router = express.Router();
const shopifyRouter = require('./shopify');
const productRouter = require('./product');

router.use('/shopify', shopifyRouter);
router.use('/products', productRouter);

module.exports = router;
