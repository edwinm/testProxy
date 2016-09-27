# testProxy

Test your local websites on other devices

If you're developing websites, chances are you're using virtual hosts like `test.mycompany`.
Just add another host to your hosts file and webserver config and start to develop.

Often, the local webserver is running in an VM like Vagrant or Docker.

Unfortunately, you can't just access these sites from other mobile devices like phones or tablets,
so how do you test it?

With testProxy it becomes very easy. To test you local `test.mycompany` website on a mobile device, type:

```bash
node testproxy http://test.mycompany/
```

TestProxy will respond with something like:

```bash
Listening on http://192.168.0.93:6239
```

Type the URL in the browser on your mobile device and the website will appear.
Make sure the mobile device is connected by WiFi.

## Parameters

```bash
node testproxy <url> [-l<port>] [-noqr]
```

**url**: the same url as you use for local development

**port** (optional): the port to listen to

**-noqr** turn off showing the QR code

## Example

To make your local website `test.mycompany` available:

```bash
node testproxy http://test.mycompany/
```

You can connect different domain names to different port numbers at the same time:

## License

TestProxy is copyright 2016 Edwin Martin and MIT licensed.
