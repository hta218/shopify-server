const express = require('express');
const router = express.Router();
const shopifyRouter = require('./shopify');
const productRouter = require('./product');
const pageRouter = require('./page');

router.use('/shopify', shopifyRouter);
router.use('/products', productRouter);
router.use('/pages', pageRouter);

module.exports = router;
