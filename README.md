[![Carbonium](https://raw.githubusercontent.com/edwinm/testProxy/master/illustration.jpeg)](#readme)

# testproxy

Connect from (mobile) devices to your locally running, non public websites

If you are running a webserver as localhost, with a local webserver or in a virtual machine or container like
VirtualBox, VMware, Vagrant or Docker,
you can't always access this webserver from other computers or mobile devices, even on the same network.

Testproxy will create a proxy to this local webserver and makes them available to other devices on the
same (Wi-Fi) network. All without any configuration.

## Running

Assuming http://localhost:8080/ is working in your local browser but nowhere else:

```bash
npx testproxy http://localhost:8080/
```

The first time it will ask you to install testproxy. Press enter to proceed.

If the command npm is not found, you have to install the Node.js and npm combination.
Go to https://nodejs.org/ and install Node.js. Then type the command above again.

Testproxy will respond with something like:

```
Listening on http://192.168.0.93:6239
```

And it will show a QR code.

Type the URL in the browser on your mobile device or scan the QR code and the website will appear.
Make sure the computer and other device are connected by the same (WiFi) network.

Type CTRL-C to stop testproxy.

## Parameters

```bash
npx testproxy <url> [-l<port>] [-noqr]
```

**url**: the same url as you use for local development

**port** (optional): the port to listen to

**-noqr** turn off showing the QR code

## Example

To make your local website `test.mycompany` available on port 9000 without showing the QR code:

```bash
npx testproxy http://test.mycompany/ -l9000 -noqr
```

You can connect different domain names to different port numbers at the same time.
Testproxy does not work with https connections.

## Highly secured WiFi

Some WiFi networks are highly secured and prevent you from accessing other computers on the same network.
Here are some solutions to this problem:
- Connect the host computer and the other computer or mobile to the same guest Wi-Fi network.
- Configure one device as a hotspot and connect your other device to this hotspot.
- Use another, unprotected Wi-Fi network for development and test purposes,
  installing a dedicated Wi-Fi access point if needed.

## License

Testproxy is copyright 2023 Edwin Martin and MIT licensed.
