# Sample Connector for Grindery Nexus


## Development

For testing the connector, please run:

```
npm run server
```

then [connect to the server via WebSocket](https://www.piesocket.com/websocket-tester) and send JSON-RPC request with "setupSignal" or "runAction" as method name. Check [the sampleMessages folder](sampleMessages) for message samples.