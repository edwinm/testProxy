/**
 testProxy 1.1.0
 Test your local websites on other devices
 @copyright 2016 Edwin Martin
 @see {@link http://www.bitstorm.org/javascript/}
 @license MIT
 */

const http = require('http');
const httpProxy = require('http-proxy');

try {
	const args = getArguments();
	startProxy(args.host, args.port, args.listenPort)
} catch(e) {
	console.log('e', e);
	console.error("Oops. " + e.message);
	console.error("Usage: node testproxy.js <url>");
	console.error("or     node testproxy.js <url> <listen-port>");
}

//=== Function declarations ============

/**
 * Parse command line arguments
 */
function getArguments() {
	var host, port, listenPort;

    if (process.argv.length < 3) {
	    throw {message: "testProxy does not see enough arguments."};
    }

	({host, port} = parseHost(process.argv[2]));
	listenPort = process.argv[3] || 0;


    return {
        host,
        port,
	    listenPort
    };
}

function parseHost(host) {
	var match = host.match(/http(s?):\/\/([-a-z0-9\.]+):?([0-9]+)?\/?/);

	if (!match || !match[2]) {
		throw {message: "testProxy does not inderstand the URL."};
	}

	if (match[1] == 's') {
		throw {message: "testProxy does not work with https."};
	}

	var host = match[2];
	var port = match[3] || 80;

	return {
		host,
		port
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

function startProxy(hostname, port, listenPort) {
    const proxy = httpProxy.createProxyServer({});

    proxy.on('proxyReq', proxyReq =>
        proxyReq.setHeader('Host', hostname)
    );

    const server = http.createServer((req, res) =>
        proxy.web(req, res, {
            target: `http://${hostname}:${port}`
        })
    );

	server.listen(listenPort);

	listenPort = server.address().port;

    getIpAddresses().forEach(ip =>
        console.log(`Listening on http://${ip.address}:${listenPort}`)
    );
}


/**
 * Show QR code on the terminal
 * @param url
 */
function showQR(url) {
    const qrcode = require('qrcode-terminal');

    qrcode.generate(url);
}

