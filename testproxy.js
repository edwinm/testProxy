#! /usr/bin/env node

/**
 testProxy 1.4.0
 Test your local websites on other devices
 @copyright 2025 Edwin Martin
 @license MIT
 */

const http = require('http');
const httpProxy = require('http-proxy');

const args = getArguments();

if (args.error) {
	printUsage(args.error);
} else {
	const url = startProxy(args.host, args.port, args.listenPort);

	if (args.qr) {
		showQR(url);
	}
}

//=== Function declarations ============

/**
 * Parse command line arguments
 */
function getArguments() {
	let opt = {};

	if (process.argv.length < 3) {
		return {error: "testProxy does not see enough arguments."};
	}

	process.argv.forEach(arg => {
		parseUrl(opt, arg);
		parseListenPort(opt, arg);
		parseQR(opt, arg);
	});

	return opt;

	//== functions

	function parseListenPort(opt, arg) {
		const match = arg.match(/-[lp] ?([0-9]+)/);

		if (match) {
			opt.listenPort = parseInt(match[1], 10);
		} else if (!opt.listenPort) {
			opt.listenPort = 0;
		}
	}

	function parseUrl(opt, url) {
		const match = url.match(/http(s?):\/\/([-a-z0-9.]+):?([0-9]+)?(\/.*)?/);

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

	proxy.on('proxyReq', (proxyReq, req, res) => {
			const host = proxyReq.getHeader('host');
			const hostname = getHostname(host)
			proxyReq.setHeader('Host', hostname);
			proxyReq.setHeader('X-Forwarded-Host', hostname);
			const forwarded = [
				`by=${formatIpForForwarded(req.socket.localAddress)}:${listenPort}`,
				`for=${formatIpForForwarded(req.socket.remoteAddress)}`,
				`host=${host}`,
				`proto=${req.socket.encrypted ? 'https' : 'http'}`,
			].join(';');
			proxyReq.appendHeader('Forwarded', forwarded);
		}
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
			const url = getUrl(ip.address, listenPort);
			returnUrl = returnUrl || url;
			console.log(`Listening on ${url}`);
		}
	);

	return returnUrl;
}

/**
 * Print usage
 * @param error
 */
function printUsage(error) {
	console.error(`Oops. ${error}`);
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

/**
 * Get hostname from host
 * @param host
 * @returns hostname
 */
function getHostname(host) {
	const s = host.split(':');
	return s.length == 2 ? s[0] : host;
}

/**
 * Format ip for Forwarded header
 * @param ip
 * @returns ip
 */
function formatIpForForwarded(ip) {
	if (!ip) {
		return 'unknown';
	}

	// Remove IPv4-mapped IPv6 prefix if present
	const cleanIp = ip.startsWith('::ffff:') ? ip.substring(7) : ip;

	// Check if it's an IPv6 address (contains colons)
	if (cleanIp.includes(':')) {
		return `"[${cleanIp}]"`;
	}

	// IPv4 address
	return cleanIp;
}

/**
 * Build url from host, port and path
 * @param host
 * @param port
 * @param path
 */
function getUrl(host, port = 80, path = '/') {
	return `http://${host}:${port}${path}`;
}

