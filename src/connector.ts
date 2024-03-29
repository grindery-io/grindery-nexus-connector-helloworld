import { v4 as uuidv4 } from "uuid";

import {
  ConnectorInput,
  TriggerBase,
  ConnectorDefinition,
  ActionOutput,
  WebhookParams,
} from "grindery-nexus-common-utils";

let debugOutput = "Hello World!";

function addDebugOutput(output: string) {
  if (debugOutput.length > 10000) {
    debugOutput = "(truncated)";
  }
  debugOutput += `\n[${new Date().toISOString()}] ${output}`;
}

type HelloWorldTriggerFields = {
  recurring: boolean;
  interval: number;
};
class HelloWorldTrigger extends TriggerBase<HelloWorldTriggerFields> {
  async main() {
    const send = () => {
      if (!this.isRunning) {
        addDebugOutput(`[${this.sessionId}] Stopping trigger`);
        return;
      }
      addDebugOutput(`[${this.sessionId}] Sending signal`);
      this.sendNotification({ random: `ABC-${uuidv4()}` });
      if (this.fields.recurring) {
        addDebugOutput(`[${this.sessionId}] Will trigger again in ${this.fields.interval}ms`);
        setTimeout(send, this.fields.interval);
      }
    };
    setTimeout(send, this.fields.interval);
    await this.waitForStop();
  }
}

async function helloWorldAction(params: ConnectorInput<unknown>): Promise<ActionOutput> {
  const fields = params.fields as {
    message: string;
  };
  console.log(`Hello World! ${fields.message}`);
  addDebugOutput(`[${params.sessionId}] Hello World! ${fields.message}`);
  return {
    payload: {
      message: `Hello World! ${fields.message}`,
    },
  };
}

async function onWebhook(params: ConnectorInput<WebhookParams>): Promise<ActionOutput> {
  console.log("Webhook received:", params.fields);
  addDebugOutput(`[${params.sessionId}] Webhook received: ` + JSON.stringify(params.fields));
  return {
    payload: {
      message: "Hello World!",
    },
  };
}

export const CONNECTOR_DEFINITION: ConnectorDefinition = {
  actions: { helloWorldAction },
  triggers: { helloWorldTrigger: HelloWorldTrigger },
  webhooks: {
    helloWorldTrigger: onWebhook,
  },
  options: {
    mutateRoutes: (app) => {
      app.get("/debug", (req, res) => res.type("text").send(debugOutput).end());
    },
  },
};
