import path from "path";
import fsp from "fs/promises";
import fs from "fs";
import express from "express";
import { Server } from "socket.io";
import process from "process";
import socketModule from "./socket.js"
import {createServer} from "http";
import { createRequire } from "module";
let __dirname = path.dirname(new URL(import.meta.url).pathname);
__dirname = __dirname.replace("/C:/", "C:/");
let require = createRequire(import.meta.url);
let root = process.cwd();
let isProduction = process.env.NODE_ENV === "production";
function resolve(p) {
  return `./${p}`
  // return path.resolve(__dirname, p);
}

// see if dist/server/entry.server.js exists, if it does then change to mjs
if (fs.existsSync(resolve("dist/server/entry.server.js"))) {
  fs.renameSync(resolve("dist/server/entry.server.js"), resolve("dist/server/entry.server.mjs"))
}


async function createServerExpress() {
  let app = express();
  let server = createServer(app);
  const io = new Server(server);
  socketModule(io)

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;

  if (!isProduction) {
    vite = await require("vite").createServer({
      root,
      server: { middlewareMode: "ssr" },
    });

    app.use(vite.middlewares);
  } else {
    app.use(require("compression")());
    app.use(express.static(resolve("dist/client")));
  }

  app.use("*", async (req, res) => {
    let url = req.originalUrl;

    try {
      let template;
      let render;

      if (!isProduction) {
        template = await fsp.readFile(resolve("index.html"), "utf8");
        template = await vite.transformIndexHtml(url, template);
        render = await vite
          .ssrLoadModule("src/entry.server.jsx")
          .then((m) => m.render);
      } else {
        template = await fsp.readFile(
          resolve("dist/client/index.html"),
          "utf8"
        );
        render = await import(resolve("dist/server/entry.server.mjs"))
        render = render.render
        // render = require(resolve("dist/server/entry.server.mjs")).render;
      }

      let html = template.replace("<!--app-html-->", render(url));
      res.setHeader("Content-Type", "text/html");
      return res.status(200).end(html);
    } catch (error) {
      if (!isProduction) {
        vite.ssrFixStacktrace(error);
      }
      console.log(error.stack);
      res.status(500).end(error.stack);
    }
  });

  return server
}

createServerExpress().then((app) => {
  let port = process.env.PORT || 3000;
  app.listen(port);
  console.log(`Server running at ${process.env.VITE_APIURL}`);
});
