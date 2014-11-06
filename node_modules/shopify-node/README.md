# Shopify Node

    npm install shopify-node

You can run the test by cloning this repo and running:

    npm install
    node test/test

For setting up:

    var shopifyObj = require('shopify-node');
    
    var shopify = new shopifyObj({
    	shop_name: 'typefoo',
    	id: '639e5b59d03a4135d4f4cd176d8b0d0c',
    	secret: '07e3e4d5711054ead625ac7356552660',
    	redirect: 'http://localhost:9000/#/oauth'
    	// scope: 'write_products', as an example. The default scope has access to all.
    	// For more on scopes: http://docs.shopify.com/api/tutorials/oauth
    });
    
    var url = shopify.createURL();

After you have obtained the 'code' (either via your redirect or elsewhere):

    var code = ''; // put the short-time auth code in here.

    shopify.getAccessToken(code, function(err, access_token) {
  		console.log(err);
  		console.log(access_token);
  	});
  	
If you have saved your access token in some sort of session or cookie data, you can skip the authorization request:

    var shopify = new shopifyObj({
    	shop_name: 'typefoo',
    	id: '639e5b59d03a4135d4f4cd176d8b0d0c',
    	secret: '07e3e4d5711054ead625ac7356552660',
    	redirect: 'http://localhost:9000/#/oauth',
    	access_token: '' // your access token to be used
    });
    
Once authorized, you can perform typical REST services (http://docs.shopify.com/api/ for reference):

    // GET
    shopify.get('/admin/orders.json', function(err, resp) {
      if(err) {
        return console.log(err);
      }
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
      console.log(resp);
    });
    
    // PUT
    shopify.put('/admin/products/1234.json', postData, function(err, resp) {
      if(err) {
        return console.log(err);
      }
      console.log(resp);
    });
    
    // DELETE
    shopify.delete('/admin/products/1234.json', function(err, resp) {
      if(err) {
        return console.log(err);
      }
      console.log(resp);
    });

Built in Carolina & Ohio. www.typefoo.com