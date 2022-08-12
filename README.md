# Sample Connector for Grindery Nexus


## Development

For testing the connector, please run:

```
npm run server
```

then [connect to the server via WebSocket](https://www.piesocket.com/websocket-tester) and send JSON-RPC request with "setupSignal" or "runAction" as method name. Check [the sampleMessages folder](sampleMessages) for message samples.


## CDS file

See also [CDS file](cds/helloWorld.json) for this connector, this file is read by Grindery Nexus frontend and engine so that they can interact with the connector. You can also check [schema of the file](https://github.com/grindery-io/grindery-nexus-schema-v2/tree/master/connectors) and [other samples](https://github.com/grindery-io/grindery-nexus-schema-v2/tree/master/cds/web2).