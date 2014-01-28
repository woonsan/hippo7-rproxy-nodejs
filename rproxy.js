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
 * Usage: `sudo node rproxy.js` will open 80 port.
 *        `node rproxy.js 8888` will open 8888 port.
 */

/**************************************************************/
/* URL Path Mappings for Reverse Proxying to Target Servers   */
/**************************************************************/
/* You can add edit mappings below!                           */

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


/*
 * Internal Server Handling Codes.
 * Normally you don't have to look into it below.
 */

var port = 80;

if (process.argv[2]) {
  port = parseInt(process.argv[2]);
}

var getHostPort = function(req) {
  var res = req.headers.host.match(/:(\d+)/);
  return res ?
    res[1] :
    req.connection.pair ? '443' : '80' ;
};

var setXForwardHeaders = function(req) {
  var values = {
    for : req.connection.remoteAddress || req.socket.remoteAddress,
    port : getHostPort(req),
    proto: req.isSpdy ? 'https' : (req.connection.pair ? 'https' : 'http')
  };

  ['for', 'port', 'proto'].forEach(function(header) {
    req.headers['x-forwarded-' + header] =
      (req.headers['x-forwarded-' + header] || '') +
      (req.headers['x-forwarded-' + header] ? ',' : '') +
      values[header];
  });
};

var http = require('http'),
    httpProxy = require('http-proxy');

//
// Create a proxy server with custom application logic
//
var proxy = httpProxy.createProxyServer({});

//
// Create your custom server and just call `proxy.web()` to proxy 
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
//
var server = http.createServer(function(req, res) {

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

  setXForwardHeaders(req);

  proxy.web(req, res, um.route);
});

server.listen(port);

console.log('');
console.log('Reverse Proxy Server started at port', port, '...');
console.log('');
console.log('Route mappings are as follows:');
console.log('***********************************************************');
console.log(mappings);
console.log('***********************************************************');
console.log('');
