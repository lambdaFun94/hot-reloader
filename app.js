import express from "express";
import WebSocket from "ws";
import fs, { statSync } from "fs";
import path from "path";

const WS_PORT = 8080;
const SERVER_PORT = 8090;
const CLIENT_WEBSOCKET_CODE = fs.readFileSync(
  path.join(process.cwd(), "client-websocket.js"),
  "utf-8"
);

// Client web socket server
const wss = new WebSocket.Server({
  port: WS_PORT,
});

const serveStaticPageIfExists = (route) => {
  if (fs.existsSync(route)) {
    if (fs.statSync(route).isDirectory()) {
      return serveStaticPageIfExists(path.join(route, "index.html"));
    }
    if (statSync(route).isFile()) {
      let file = fs.readFileSync(route);
      if (route.endsWith(".html")) {
        file = `${file.toString()}\n\n<script>${CLIENT_WEBSOCKET_CODE}</script>`;
      }
      return file;
    }
  }
  return false;
};

const app = express();

const pathToIndex = path.join(process.cwd(), "index.html");
app.get("/", (req, res, next) => {
  const pageToServe = serveStaticPageIfExists(pathToIndex);
  res.send(pageToServe);
});

app.listen(SERVER_PORT, () => {
  console.log(`Dev server listening on ${SERVER_PORT}`);
});
