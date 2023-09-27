import path from "path";
import fsp from "fs/promises";
import fs from "fs";
import express from "express";
import { Server } from "socket.io";
import 'dotenv/config'
import process from "process";
import socketModule from "./socket.js"
import { createServer } from "http";
import { createRequire } from "module";

import wifi from "node-wifi"
wifi.init({
  iface: null // network interface, choose a random wifi interface if set to null
});
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
  app.post("/help",(req,res)=>{
    // ./config/helpPage.html
    let fileContent = fs.readFileSync(resolve("config/helpPage.html"),"utf8")
    res.json({
      html: fileContent
      
    })
  })
  app.post("/authorized", (req, res) => {
    if (process.env.AUTHFromWifi == "true" || process.env.AUTHFromWifi == true || process.env.AUTHFromWifi == "1" || process.env.AUTHFromWifi == "True") {
      wifi
        .getCurrentConnections()
        .then((currentConnections) => {
          if (currentConnections.length > 0) {
            const ssid = currentConnections[0].mac;
            res.json({ authorized: ssid === process.env.STAFFSSID })

          } else {
            res.json({ authorized: false })
          }
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error fetching WiFi information');
        });
    } else {
      res.json({ authorized: true })
    }
  })
  app.get("/isStaff", (req, res) => {
    wifi
      .getCurrentConnections()
      .then((currentConnections) => {
        if (currentConnections.length > 0) {
          const ssid = currentConnections[0].mac;
          res.json({ isStaff: ssid === process.env.STAFFSSID })

        } else {
          res.json({ isStaff: false })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error fetching WiFi information');
      });
  })

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

  console.log(`Server running Successfully!`);
});
