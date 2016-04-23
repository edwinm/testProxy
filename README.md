# testProxy

Test your local websites on other devices

If you're developing websites, chances are you're using virtual hosts like `test.mycompany`.
Just add another host to your hosts file and webserver config and start to develop.

Unfortunately, you can't just access these sites from other (mobile) devices, so how do
you test it?

With testProxy it becomes very easy. To test you local `test.mycompany` website on a mobile device, type:

```bash
node testproxy test.mycompany
```

TestProxy will respond with something like:

```bash
Listening on http://192.168.0.93:9000
```

Type the URL in the browser on your mobile device and the website will appear.
Make sure the mobile device is connected by WiFi.

## Parameters

```bash
node testproxy <domainname> [<port>]
```

**domainname**: the same name as you use for local development

**port** (optional): the port to listen to

## Example

To make your local website `test.mycompany` available on port 9000:

```bash
node testproxy test.mycompany 9000
```

You can connect different domain names to different port numbers at the same time:

```bash
node testproxy test.mycompany 9000
node testproxy test.myothercompany 9001
```

## License

TestProxy is  copyright 2016 Edwin Martin and MIT licensed.
