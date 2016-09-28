/**
 testProxy 1.2.1
 Test your local websites on other devices
 @copyright 2016 Edwin Martin
 @see {@link http://www.bitstorm.org/javascript/}
 @license MIT
 */

const http = require('http');
const httpProxy = require('http-proxy');

try {
	const args = getArguments();
	startProxy(args.host, args.port, args.listenPort);

	if (args.qr) {
		showQR(args);
	}
} catch(e) {
	printUsage(e);
}

//=== Function declarations ============

/**
 * Parse command line arguments
 */
function getArguments() {
	let opt = {};

    if (process.argv.length < 3) {
	    throw {message: "testProxy does not see enough arguments."};
    }

	process.argv.forEach(arg => {
		parseUrl(opt, arg);
		parseListenPort(opt, arg);
		parseQR(opt, arg);
	});

    return opt;

	//== functions

	function parseListenPort(opt, arg) {
		const match = arg.match(/-l([0-9]+)/);

		if (match) {
			opt.listenPort = parseInt(match[1], 10);
		} else if (!opt.listenPort) {
			opt.listenPort = 0;
		}
	}

	function parseUrl(opt, url) {
		const match = url.match(/http(s?):\/\/([-a-z0-9\.]+):?([0-9]+)?(\/.*)?/);

		if (match) {
			opt.host = match[2];
			opt.port = match[3] || 80;
			opt.path = match[4];
		}
	}

	function parseQR(opt, arg) {
		if (arg == '-noqr') {
			opt.qr = false;
		} else if (opt.qr == null) {
			opt.qr = true;
		}
	}
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
 * @param args
 */
function showQR(args) {
    const qrcode = require('qrcode-terminal');
	const url = `http://${args.host}:${args.port}${args.path}`;
    qrcode.generate(url);
}

