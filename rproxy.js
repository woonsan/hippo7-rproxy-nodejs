/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 *
 * Reverse Proxy Script using Node.js
 *
 * Usage: `sudo node rproxy.js` will open 80 port.
 *        `node rproxy.js 8888` will open 8888 port.
 *        `node rproxy.js 8888 8443` will open 8888 port and 8443 ssl port.
 *
 */


/*============================================================*/
/* Reverse Proxy Server Default Options Configuration         */
/*------------------------------------------------------------*/

var defaultOptions = {
  xfwd: true, // add X-Forwarded-* headers
};

// SSL Key file paths; change those paths if you have those in other paths.
var ssl_private_key_path = './priv.pem';
var ssl_certificate_path = './cert.pem';

/*------------------------------------------------------------*/
/* URL Path Mappings Configuration for Reverse Proxy Targets  */
/*------------------------------------------------------------*/
// You can add edit mappings below!

var mappings = [
  {
    host: '*',
    pathregex: /^\/cms(\/|$)/,
    route: {
      target: 'http://127.0.0.1:8080'
    }
  },
  {
    host: '*',
    pathregex: /^\/site(\/|$)/,
    route: {
      target: 'http://127.0.0.1:8080'
    }
  },
  {
    host: '*',
    pathregex: /^/,
    pathreplace: '/site',
    route: {
      target: 'http://127.0.0.1:8080'
    }
  },
];

/*------------------------------------------------------------*/
/* End of Configuration                                       */
/*============================================================*/


// Normally you don't need to look into the detail below
// in most cases unless you want to debug. :-)


/**************************************************************/
/* Internal Server Handling Code from here                    */
/*------------------------------------------------------------*/

// find out the port number command line argument
var port = 80;
if (process.argv[2]) {
  port = parseInt(process.argv[2]);
}

// build up the ssl options
var sslOptions = {};
var fs = require('fs');
if (fs.existsSync(ssl_private_key_path)) {
  sslOptions.key = fs.readFileSync(ssl_private_key_path, 'utf8');
} else {
  console.log('SSL Error! SSL private key file does not exist: ' + ssl_private_key_path);
}
if (fs.existsSync(ssl_certificate_path)) {
  sslOptions.cert = fs.readFileSync(ssl_certificate_path, 'utf8');
} else {
  console.log('SSL Error! SSL certificate does not exist: ' + ssl_certificate_path);
}

// let's start building proxy server from here

var http = require('http'),
    httpProxy = require('http-proxy');

//
// Create a proxy server with custom application logic
//
var proxyServer = httpProxy.createProxyServer(defaultOptions);

// proxy handler function
var proxyHandler = function(req, res) {
  var url = req.url;
  var um = null;
  var foundMapping = null;
  var host = req.headers['host'];

  for (var i in mappings) {
    um = mappings[i];
    if (um.host && um.host != '*' && um.host != host) {
      continue;
    }
    if (um.pathregex) {
      if (url.match(um.pathregex)) {
        foundMapping = um;
        if (um.pathreplace) {
          req.url = url.replace(um.pathregex, um.pathreplace);
        }
        break;
      }
    } else {
      break;
    }
  }

  if (!foundMapping) {
    console.log('ERROR', host + url, '\n        ->', 'No mapping found.');
  } else {
    console.log('INFO ', host + url, '\n        ->', um.route.target + req.url);
  }

  proxyServer.web(req, res, um.route);
};

//
// Create your custom server and just call `proxy.web()` to proxy 
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
//
http.createServer(proxyHandler).listen(port); 
console.log('');
console.log('Reverse Proxy Server started at port', port, '...');

// start another server at ssl port if configured
if (sslOptions.key && sslOptions.cert) {
  var sslPort = 443;
  if (process.argv[3]) {
    sslPort = parseInt(process.argv[3]);
  }
  // TODO: create another proxy server at ssl port
  console.log('Reverse Proxy Server started at SSL port', sslPort, '...');
}

// print out the route mapping information
console.log('');
console.log('Route mappings are as follows:');
console.log('***********************************************************');
console.log(mappings);
console.log('***********************************************************');
console.log('');
