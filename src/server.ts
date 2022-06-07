import "dotenv/config";
import bodyParser from "body-parser";
import express from "express";
import { Server } from "ws";
import { main } from "./app";
import { Response } from "./utils";

const app = express();
app.use(bodyParser.json());

app.use((_req, res) => res.send("Hello World!"));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const wss = new Server({ server: app as any });
wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("message", function message(data) {
    let parsed = {};
    try {
      parsed = JSON.parse(data.toString("utf8"));
    } catch (e) {
      console.error("Invalid message", e);
    }
    const result = main(parsed, { socket: ws });
    if (result instanceof Response) {
      return;
    }
    ws.send(JSON.stringify(result));
  });
  ws.on("close", () => console.log("Client disconnected"));
});

const port = parseInt(process.env.PORT || "", 10) || 3000;

console.log(`Listening on port ${port}`);
app.listen(port);
