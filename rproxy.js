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
 * Reverse Proxy Script using Node.js
 * 
 * Usage: `sudo node rproxy.js` will open 80 port and 443 ssl port.
 *        `node rproxy.js 8888` will open 8888 port and 443 ssl port.
 *        `node rproxy.js 8888 8443` will open 8888 port and 8443 ssl port.
 */

var fs = require('fs');

/**************************************************************/
/* Reverse Proxy Server Options                               */
/**************************************************************/
var options = {
  enable : {
    xforward: true // enables X-Forwarded-For
  }
};

// SSL Key file paths; change those paths if you have those in other paths.
var ssl_private_key_path = './priv.pem';
var ssl_certificate_path = './cert.pem';

// internal building for ssl options...
var sslOptions = {
  enable : {
    xforward: true // enables X-Forwarded-For
  },
  https: {
    key: null,
    cert: null 
  }
};
if (fs.existsSync(ssl_private_key_path)) {
  sslOptions.https.key = fs.readFileSync(ssl_private_key_path, 'utf8');
} else {
  console.log('SSL Error! SSL private key file does not exist: ' + ssl_private_key_path);
}
if (fs.existsSync(ssl_certificate_path)) {
  sslOptions.https.cert = fs.readFileSync(ssl_certificate_path, 'utf8');
} else {
  console.log('SSL Error! SSL certificate does not exist: ' + ssl_certificate_path);
}

/**************************************************************/
/* URL Path Mappings for Reverse Proxying to Target Servers   */
/**************************************************************/
/* You can add edit mappings below!                           */

var mappings = [
  {
    host: '*',
    pathregex: /^\/cms(\/|$)/,
    route: {
      host: 'localhost',
      port: 8080
    }
  },
  {
    host: '*',
    pathregex: /^\/site(\/|$)/,
    route: {
      host: 'localhost',
      port: 8080
    }
  },
  {
    host: '*',
    pathregex: /^/,
    pathreplace: '/site',
    route: {
      host: 'localhost',
      port: 8080
    }
  },
];

/* Mapping ends!                                              */
/**************************************************************/

/*
 * Internal Server Handling Codes. 
 * Normally you don't have to look into it below.
 */

var port = 80;

if (process.argv[2]) {
  port = parseInt(process.argv[2]);
}

var http = require('http'), httpProxy = require('http-proxy');

var handler = function(req, res, proxy) {
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
    console.log('[rproxy]', 'There is no mapping found for the request url:', host + req.url);
  } else {
    console.log('[rproxy]', host + url, '->', 'http://' + um.route.host + ':' + um.route.port + req.url);
  }

  proxy.proxyRequest(req, res, um.route);
};

httpProxy.createServer(options, handler).listen(port);

console.log('');
console.log('Reverse Proxy Server started at port', port, '...');

/**************************************************************/

/*
 * Internal SSL Server Handling Codes. 
 * Normally you don't have to look into it below.
 */

if (sslOptions.https.key && sslOptions.https.cert) {
  var sslPort = 443;

  if (process.argv[3]) {
    sslPort = parseInt(process.argv[3]);
  }

  httpProxy.createServer(sslOptions, handler).listen(sslPort);
  console.log('Reverse Proxy Server started at SSL port', sslPort, '...');
}

console.log('');
console.log('Route mappings are as follows:');
console.log('***********************************************************');
console.log(mappings);
console.log('***********************************************************');
console.log('');
