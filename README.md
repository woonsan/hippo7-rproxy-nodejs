hippo7-rproxy-nodejs
====================

Node.js script for Reverse Proxy targeting Hippo CMS 7 and HST-2 applications.

Introduction
------------

TODO

How to run the reverse proxy server script
------------------------------------------

TODO

  Note: You need to install Node.js in order to run Reverse Proxy Server. See the next section for installation guide.

  Move to the project root folder in the command line console and run the following command:

  $ sudo node rproxy.js

  The above command will run the Reverse Proxy Server at port 80 by default.
  You can run it at a different port like the following example:

  $ node rproxy.js 8888


About installing Node.js and http-proxy module
----------------------------------------------

TODO

  1. Download a Node.js installer package from the following site and install it on your system.
    - http://nodejs.org/

  2. Move to the project root folder in the command console, and install http-proxy module with the following command:

    $ npm install http-proxy

    The `npm` command will be found in the Node.js installation directory. e.g., /usr/local/bin/npm

    For detail, see https://github.com/nodejitsu/node-http-proxy.


