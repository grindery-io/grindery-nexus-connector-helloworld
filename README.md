# Sample Connector for Grindery Nexus


## Development

A connector can contain any number of actions and triggers. See [connector.ts](src/connector.ts) for the sample implementation.

To test the connector, we can use `npm run local:action` and `npm run local:trigger` commands. They accept 2 parameters: `key` and `fields`. Example:

```
npm run local:action helloWorldAction '{"message":"Test"}'
```

```
npm run local:trigger helloWorldTrigger '{"interval":1000,"recurring":true}'
```

The connector will be run as a WebSocket server after deployment, to test it in production setting, run `npm run server`.


## Webhook

Grindery Nexus supports HTTP inbound webhook for connectors, the URL is something like:

```
https://orchestrator.grindery.org/webhook/:connector_key/:trigger_key/:path
```

You can handle webhooks with `onWebhook` function in [src/connector.ts](src/connector.ts).

## CDS file

See also [CDS file](cds/helloWorld.json) for this connector, this file is read by Grindery Nexus frontend and engine so that they can interact with the connector. You can also check [schema of the file](https://github.com/grindery-io/grindery-nexus-schema-v2/tree/master/connectors) and [other samples](https://github.com/grindery-io/grindery-nexus-schema-v2/tree/master/cds/web2).
