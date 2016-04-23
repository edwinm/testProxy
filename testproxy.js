/**
 testProxy 1.0.0
 Test your local websites on other devices
 @copyright 2016 Edwin Martin
 @see {@link http://www.bitstorm.org/javascript/}
 @license MIT
 */

const http = require('http');
const httpProxy = require('http-proxy');

const args = getArguments();
if (args) {
    startProxy(args.hostname, args.port)
} else {
    console.log("Usage: node testproxy.js <domainname> <port>");
}

//=== Function declarations ============

/**
 * Parse command line arguments
 */
function getArguments() {
    if (process.argv.length < 3) {
        return null;
    }
    return {
        hostname: process.argv[2],
        port: process.argv[3] || 9000
    };
}

/**
 * Find ip addresses of local computer
 * @returns {Array} ip-addresses
 */
function getIpAddresses() {
    const os = require('os');
    const ifaces = os.networkInterfaces();

    return Object.keys(ifaces).reduce((prev, iface) =>
        prev.concat(ifaces[iface].filter(address =>
            !address.internal && address.family == 'IPv4'
        ))
    , []);
}

function startProxy(hostname, port) {
    const proxy = httpProxy.createProxyServer({});

    proxy.on('proxyReq', proxyReq =>
        proxyReq.setHeader('Host', hostname)
    );

    const server = http.createServer((req, res) =>
        proxy.web(req, res, {
            target: `http://${hostname}`
        })
    );

    server.listen(port);

    getIpAddresses().forEach(ip =>
        console.log(`Listening on http://${ip.address}:${port}`)
    );
}
