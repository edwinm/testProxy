/**
 testProxy 1.2.0
 Test your local websites on other devices
 @copyright 2016 Edwin Martin
 @see {@link http://www.bitstorm.org/javascript/}
 @license MIT
 */

const http = require('http');
const httpProxy = require('http-proxy');

try {
	const args = getArguments();

	const url = startProxy(args.host, args.port, args.listenPort);

	if (args.qr) {
		showQR(url);
	}
} catch(e) {
	printUsage(e);
}

//=== Function declarations ============

/**
 * Parse command line arguments
 */
function getArguments() {
	let url, host, port, listenPort, qr = true;

    if (process.argv.length < 3) {
	    throw {message: "testProxy does not see enough arguments."};
    }

	process.argv.forEach(arg => {
		url = parseUrl(arg);
		if (url) {
			({host, port} = url);
		}
		listenPort = listenPort || parseListenPort(arg);
		qr = qr && !parseQR(arg);
	});

	if (listenPort == null) {
		listenPort = 0; // Dynamically find IP
	}

    return {
        host,
        port,
	    listenPort,
	    qr
    };
}

function parseListenPort(arg) {
	const match = arg.match(/-l([0-9]+)/);

	if (match) {
		return parseInt(match[1], 10);
	}
}

function parseUrl(url) {
	let host, port;
	const match = url.match(/http(s?):\/\/([-a-z0-9\.]+):?([0-9]+)?\/?/);

	if (match) {
		host = match[2];
		port = match[3] || 80;

		return {
			host,
			port
		};
	}
}

function parseQR(arg) {
	return arg == '-noqr';
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

/**
 * Start the actual proxy
 * @returns {String} (First) url
 */
function startProxy(hostname, port, listenPort) {
    const proxy = httpProxy.createProxyServer({});
	let returnUrl;

    proxy.on('proxyReq', proxyReq =>
        proxyReq.setHeader('Host', hostname)
    );

    const server = http.createServer((req, res) =>
        proxy.web(req, res, {
            target: `http://${hostname}:${port}`
        })
    );

	server.listen(listenPort);

	if (listenPort === 0) {
		listenPort = server.address().port;
	}

    getIpAddresses().forEach(ip => {
		const url = `http://${ip.address}:${listenPort}`;
	    returnUrl = returnUrl || url;
	    console.log(`Listening on ${url}`);
    }
    );

	return returnUrl;
}

function printUsage(error) {
	console.error("Oops. " + error.message);
	console.error("Usage: node testproxy <url> [-l<listen-port>] [-noqr]");
}

/**
 * Show QR code on the terminal
 * @param url
 */
function showQR(url) {
    const qrcode = require('qrcode-terminal');

    qrcode.generate(url);
}

