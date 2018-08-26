const nonce = require('nonce')();
const cookie = require('cookie');
const querystring = require('querystring');
const crypto = require('crypto');
const request = require('request-promise');

const express = require('express');
const router = express.Router();

const {
  SHOPIFY_API_KEY,
  SHOPIFY_API_SECRET,
  scopes,
  forwardingAddress
} = process.env;

router.get('/', (req, res) => {
  // NOTE: THE REQUEST MUST BE PROVIDED FROM A NGROK TUNNEL
  let shop = req.query.shop;

  if (shop) {
    let state = nonce();
    let redirectUri = `${forwardingAddress}/shopify/callback`;
    let installUrl = 
      `https://${shop}/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}&scope=${scopes}&state=${state}&redirect_uri=${redirectUri}`;
     
    res.cookie('state', state);
    res.redirect(installUrl) ;
  } else {
    res.status(400).json({message: 'Missing shop parameter'});
  }  
});

router.get('/callback', (req, res) => {
  let { shop, hmac, code, state } = req.query;
  let cookieState = cookie.parse(req.headers.cookie).state;

  if (cookieState !== state) {
    return res.status(403).json({message: 'Unable to verify request'});
  };

  ////// VALIDATE REQUEST IS SENT FROM SHOPIFY
  if (shop && hmac && code) {
    const map = Object.assign({}, req.query);
    delete map['signature'];
    delete map['hmac'];
    const message = querystring.stringify(map);
    const providedHmac = Buffer.from(hmac, 'utf-8');
    const generatedHash = Buffer.from(
      crypto
        .createHmac('sha256', SHOPIFY_API_SECRET)
        .update(message)
        .digest('hex'),
        'utf-8'
      );
    let hashEquals = false;
    // timingSafeEqual will prevent any timing attacks. Arguments must be buffers
    try {
      hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
    // timingSafeEqual will return an error if the input buffers are not the same length.
    } catch (e) {
      hashEquals = false;
    };

    if (!hashEquals) {
      return res.status(400).send('HMAC validation failed');
    }

    /////// EXCHANGE THE 'code' PARAM FOR A PERMANENT 'access-token'
    const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
    const accessTokenPayload = {
      client_id: SHOPIFY_API_KEY,
      client_secret: SHOPIFY_API_SECRET,
      code,
    };

    request.post(accessTokenRequestUrl, { json: accessTokenPayload })
      .then((accessTokenResponse) => {
        let accessToken = accessTokenResponse.access_token;
        res.status(200).json({
          message: 'Exchange access token successfully',
          accessToken
        });
      })
      .catch((error) => {
        res.status(error.statusCode).send(error.error.error_description);
      });

  } else {
    res.status(400).json({message: 'Required params missing'});
  }
});

module.exports = router;
