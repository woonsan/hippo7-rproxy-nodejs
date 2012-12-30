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
to install Apache HTTP Server on a developer's laptop.

So, I looked for an alternative solution for developer's convenience, testing in the same environment as
the production server. The solution is Node.js!
Yes, I was able to implement a full-featured, reliable reverse proxy script with Node.js very quickly.

How to run the reverse proxy server script
------------------------------------------

  Note: First, you need to install Node.js in order to run Reverse Proxy Server script.
        See the next section for installation guide.

  1. Copy rproxy.js into the root folder of your Hippo CMS 7 project.

  2. Move to the root folder of your Hippo CMS 7 project in the command line console and run the following command:

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


