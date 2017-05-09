# testProxy

Test your local websites on other devices

If you are running a webserver in a local virtual machine like VirtualBox or VMware and possibly using Vagrant or Docker,
you can't just access this webserver from other computers or mobile devices like phones or tablets.

TestProxy will create a proxy to this webserver and makes them available to other devices on the
same (WiFi) network. All without any configuration.

## Installation

Open you favourite command line shell and type:

```bash

npm install -g testproxy
```

## Running

Assuming http://test.mycompany/ is working in your local browser but nowhere else:

```bash
testproxy http://test.mycompany/
```

TestProxy will respond with something like:

```bash
Listening on http://192.168.0.93:6239
```

And it will show a QR code.

Type the URL in the browser on your mobile device or scan the QR code and the website will appear.
Make sure the computer or mobile device is connected by the same (WiFi) network.

Type CTRL-C to stop testproxy.

## Parameters

```bash
testproxy <url> [-l<port>] [-noqr]
```

**url**: the same url as you use for local development

**port** (optional): the port to listen to

**-noqr** turn off showing the QR code

## Example

To make your local website `test.mycompany` available on port 9000 without showing the QR code:

```bash
testproxy http://test.mycompany/ -l9000 -noqr
```

You can connect different domain names to different port numbers at the same time.
TestProxy does not work with https connections.

## License

TestProxy is copyright 2017 Edwin Martin and MIT licensed.
