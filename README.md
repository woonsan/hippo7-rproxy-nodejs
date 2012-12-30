hippo7-rproxy-nodejs
====================

Node.js script for Reverse Proxy targeting Hippo CMS 7 and HST-2 applications.

Introduction
------------

Hippo CMS 7 is a Java based Open Source Web Content Management Solution. 
You can rapidly build multi-lingual, multi-channel web sites.
(See http://www.onehippo.org/7_8/trails/developer-trail/hippo-baby-steps if you want to quickly follow.)

Hippo CMS 7 solution usually consists of multiple web applications and 
system administrators often deploy a reverse proxy server before Java application servers for many reasons.

Apache HTTP Server with mod_proxy is a popular solution for the reverse proxy node, but it is not so convenient
to install Apache HTTP Server on a developer's computer.

So, I looked for an alternative solution for convenience of developers who want to test in the same environment as
the production server.

The solution is <a href="http://nodejs.org/">Node.js</a>!
Yes, I was able to implement a full-featured, reliable reverse proxy script with Node.js very quickly.

How to run the reverse proxy server script
------------------------------------------

  Note: First, you need to install <a href="http://nodejs.org/">Node.js</a> in order to run Reverse Proxy Server script.
        See the next section for installation guide.

  1. Copy <a href="https://github.com/woonsan/hippo7-rproxy-nodejs/blob/master/rproxy.js">rproxy.js</a>
     into the root folder of your Hippo CMS 7 project.

  2. Move to the root folder of your Hippo CMS 7 project in the command line console and run the following command:

    $ sudo node rproxy.js

    The above command will run the Reverse Proxy Server at port 80 by default.

    You can run it at a different port like the following example:

    $ node rproxy.js 8888


About installing Node.js and http-proxy module
----------------------------------------------

  1. Download a Node.js installer package from the following site and install it on your system.
    - http://nodejs.org/

  2. Move to the project root folder in the command console, and install http-proxy module with the following command:

    $ npm install http-proxy

    The `npm` command will be found in the Node.js installation directory. e.g., /usr/local/bin/npm

    For detail, see https://github.com/nodejitsu/node-http-proxy.

Reverse Proxy Mapping Configuration
-----------------------------------

  If you open the 'rproxy.js' file, you can fine the following as the default mapping configuration:
  
<pre>
  /**************************************************************/
  /* URL Path Mappings for Reverse Proxying to Target Servers */
  /**************************************************************/
  /* You can add edit mappings below! */

  var mappings = [
    {
      pathregex: /^\/cms\//,
      route: {
        host: 'localhost',
        port: 8080
      }
    },
    {
      pathregex: /^/,
      pathreplace: '/site',
      route: {
        host: 'localhost',
        port: 8080
      }
    },
  ];
</pre>

  Based on the 'mappings' array object, the 'rproxy.js' will do reverse proxying for each target.
  In the above default example mappings, there are two mappings defined.
  
  The first mapping checks if the request path starts with '/cms/' (e.g., http://localhost:8080/cms/...).
  If the request path starts with '/cms/', then it routes the request to the target, 'localhost:8080'.
  And, in this case, the request path doesn't change.
  So, the request path like '/cms/...', will be targeted to 'http://localhost:8080/cms/...'.
  
  The second mapping checks if the request path starts with *any* (by the regular expression, /^/), then
  it prepends the request path by '/site' and the request is targeted to the 'localhost:8080'.
  So, the request path like '/news/...', will be targeted to 'http://localhost:8080/site/news/...'.
  'pathreplace' property is optional. If it's defined, then it is used to replace the found match by 'pathregex' property.

  You can add or remove mapping in 'mappings' object just by editing 'rproxy.js'.


OK. Now enjoy working with rproxy.js (powered by Node.js) !!
