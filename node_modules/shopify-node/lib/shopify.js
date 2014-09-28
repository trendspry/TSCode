function ShopifyConnect(params) {
    var utils         = require('./utils'),
    querystring       = require('querystring');
    https             = require('https'),
    $scope            = this;

  var defaults = {
    shop_name: '',
    scope: 'read_products,read_content,read_themes,read_customers,read_orders,read_script_tags,read_fulfillments,read_shipping,write_products,write_content,write_themes,write_customers,write_orders,write_script_tags,write_fulfillments,write_shipping',
    id: '',
    secret: '',
    redirect: '',
    access_token: null
  };
  
  $scope.config = utils.extend(defaults, params);
  
  $scope.setAccessToken = function(access_token) {
    $scope.config.access_token = access_token;
    return $scope;
  };
  
  $scope.createURL = function() {
    return 'https://' + $scope.config.shop_name + '.myshopify.com/admin/oauth/authorize?'
      + 'client_id=' + $scope.config.id 
      + '&scope=' + $scope.config.scope 
      + '&redirect_uri=' + $scope.config.redirect;
  };

  function doReq(opts, d, callback) {

    var q = null;
    if(d) {
      q = JSON.stringify(d);
    }

    if(!opts.method) {
      opts.method = 'get';
    }
    opts.method = opts.method.toLowerCase();
    if(opts.method === 'post' || opts.method === 'put' || opts.method === 'delete') {
      opts.headers['Content-Length'] = q ? q.length : 0;
    }

    var req = https.request(opts, function(sock) {
      sock.setEncoding('utf-8');
    });
    req.on('response', function(res) {
      var responseData = '';
      res.on('data', function(chunk) {
        responseData += chunk;
      });

      res.on('end', function() {
        var error = null;
        try {
          var j = JSON.parse(responseData);
          if(j.errors || j.error) {
            error = {
              error: true,
              message: 'Error on: [' + opts.method + '] ' + opts.path,
              details: responseData,
              arguments: opts
            };
            j.arguments = opts;
          }
        } catch(e) {
          error = {
            error: true,
            message: 'Error on: [' + opts.method + '] ' + opts.path,
            details: responseData,
            arguments: opts
          };
        }

        if(error) {
          return callback(error, null);
        }

        return callback(null, j);
      });
    });

    req.on('error', function(e) {
      callback(e, null);
    });

    if(q && q.length) {
      if (opts.method === 'post' || opts.method === 'put' || opts.method === 'delete') {
        req.write(q);
      }
    }
    
    req.end();
  }
  
  $scope.getAccessToken = function(code, callback) {
    if(typeof code === 'undefined') {
      callback({
        error: true,
        message: 'No code parameter given'
      }, null);
    }
    
    var d = {
      client_id: $scope.config.id,
      client_secret: $scope.config.secret,
      code: code
    };
    
    var opts = {
      host: $scope.config.shop_name + '.myshopify.com',
      path: '/admin/oauth/access_token',
      port: 443,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'node-shopify (www.typefoo.com)',
      }
    };

    doReq(opts, d, function(err, json) {
      if(err) {
        return callback(err, null);
      }

      callback(null, json.access_token);
    });
  };
  
  $scope.request = function(access_token, path, method, data, callback) {
    var used_args = arguments;
    if(access_token === null) {
      return callback({
        error: true,
        message: 'No access token set.'
      }, null);
    }
    
    method = method.toLowerCase();
    
    var opts = {
      host: $scope.config.shop_name + '.myshopify.com',
      path: path,
      method: method,
      port: 443,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'node-shopify (www.typefoo.com)',
        'X-Shopify-Access-Token': access_token
      }
    };
    
    doReq(opts, data, function(err, json) {
      if(err) {
        return callback(err, null);
      }

      callback(null, json);
    });
  };
  
  $scope.get = function(path, data, callback) {
    if(arguments.length < 3) {
      callback = data;
      data = null;
    }
    $scope.request($scope.config.access_token, path, 'get', data, callback);
  };
  
  $scope.post = function(path, data, callback) {
    $scope.request($scope.config.access_token, path, 'post', data, callback);
  };
  
  $scope.put = function(path, data, callback) {
    $scope.request($scope.config.access_token, path, 'put', data, callback);
  };
  
  $scope.del = $scope['delete'] = function(path, data, callback) { // need to remove .delete for future versions, will allow it to continue for now.
    if(arguments.length < 3) {
      callback = data;
      data = null;
    }
    $scope.request($scope.config.access_token, path, 'delete', data, callback);
  };
  
  return $scope;
}

module.exports = ShopifyConnect;
