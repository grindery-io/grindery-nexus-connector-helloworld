import { v4 as uuidv4 } from "uuid";
import WebSocket from "ws";

type WebSocketPayloadCommon = {
  key: string;
  sessionId: string;
};
export type ConnectorInput = WebSocketPayloadCommon & {
  credentials: unknown;
  fields: unknown;
};
export type ConnectorOutput = WebSocketPayloadCommon & {
  payload: unknown;
};

type HelloWorldTriggerFields = {
  recurring: boolean;
  interval: number;
};

class HelloWorldTrigger {
  private running = false;
  private fields: HelloWorldTriggerFields;
  constructor(private ws: WebSocket, private input: ConnectorInput) {
    this.fields = input.fields as HelloWorldTriggerFields;
    console.log("HelloWorldTrigger", input);
    if (ws.readyState !== WebSocket.OPEN) {
      return;
    }
    ws.on("close", () => {
      this.running = false;
    });
    ws.on("error", () => {
      this.running = false;
    });
  }
  sendNotification(payload: unknown) {
    if (!this.running) {
      return;
    }
    this.ws.send(
      JSON.stringify({
        jsonrpc: "2.0",
        method: "update",
        params: { key: this.input.key, sessionId: this.input.sessionId, payload },
      })
    );
  }
  main() {
    this.running = true;
    const send = () => {
      if (!this.running) {
        return;
      }
      this.sendNotification({ random: `ABC-${uuidv4()}` });
      if (this.fields.recurring) {
        setTimeout(send, this.fields.interval);
      }
    };
    setTimeout(send, this.fields.interval);
  }
}

export async function setupSignal(params: ConnectorInput, { socket }: { socket: WebSocket }) {
  if (params.key === "helloWorldTrigger") {
    new HelloWorldTrigger(socket, params).main();
  } else {
    throw new Error(`Invalid trigger: ${params.key}`);
  }
  return {};
}
export async function runAction(params: ConnectorInput): Promise<ConnectorOutput> {
  if (params.key === "helloWorldAction") {
    const fields = params.fields as {
      message: string;
    };
    console.log(`Hello World! ${fields.message}`);
    return {
      key: params.key,
      sessionId: params.sessionId,
      payload: {
        message: `Hello World! ${fields.message}`,
      },
    };
  } else {
    throw new Error(`Invalid action: ${params.key}`);
  }
}
