var prompt     = require('prompt');
var https      = require('https');
var shopifyObj = require('../lib/shopify');

var shopify = new shopifyObj({
  shop_name: 'typefoo',
  id: '',
  secret: '',
  redirect: 'http://localhost:9000/#/oauth'
});

prompt.start();

prompt.get([
  {
    name: 'access_token',
    message: 'Enter access token (optional)'
  }
], function(err, result) {
  if(result.access_token) {
    shopify.setAccessToken(result.access_token);
    return sampleCalls();
  }
  
  doAuthorization();
});

function doAuthorization() {
  var url = shopify.createURL();
  console.log('\n\nGo to the following URL:\n\n' + url + '\n\n');

  prompt.get([
    {
      name: 'code',
      message: 'Enter the code parameter from the returned URL',
      required: true
    }
  ], function(err, result) {
    console.log('\n\nConnecting to Shopify, retrieving Access Token...\n\n');
    shopify.getAccessToken(result.code, function(err, access_token) {
      if(err) {
        return console.log(err);
      }
  
      console.log(access_token);
      shopify.setAccessToken(access_token);
      sampleCalls();
    });
  });

}

function sampleCalls() {
  // GET
  shopify.get('/admin/orders.json', function(err, resp) {
    if(err) {
      return console.log(err);
    }
    console.log('GET:');
    console.log(resp);
  });
  
  // POST
  var postData = {
    product: {
      title: 'Burton Custom Freestlye 151',
      body_html: '<strong>Good snowboard!</strong>',
      vendor: 'Burton',
      product_type: 'Snowboard',
      variants: [
        {
          option1: 'First',
          price: '10.00',
          sku: 123
        },
        {
          option1: 'Second',
          price: '20.00',
          sku: '123'
        }
      ]
    }
  };
  shopify.post('/admin/products.json', postData, function(err, resp) {
    if(err) {
      return console.log(err);
    }
    console.log('POST:');
    console.log(resp);
    // PUT
    var productData = {
      product: {
        title: 'Altered Burton Custom Freestyle 151'
      }
    };
    shopify.put('/admin/products/' + resp.product.id + '.json', productData, function(err, resp) {
      if(err) {
        return console.log(err);
      }
      console.log('PUT:');
      console.log(resp);
      // DELETE
      shopify.delete('/admin/products/' + resp.product.id + '.json', function(err, resp) {
        if(err) {
          return console.log(err);
        }
        console.log('DELETE:');
        console.log(resp);
      });
    });
  });
}