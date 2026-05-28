import "dotenv/config";

import http from "node:http";

import { relayAaPanel } from "./core/relay.js";

const PORT = Number(process.env.PORT || 3000);

const server = http.createServer(
  async (req, res) => {
    if (
      req.method !== "POST" ||
      req.url !== "/aapanel"
    ) {
      res.writeHead(404, {
        "Content-Type": "application/json",
      });

      return res.end(
        JSON.stringify({
          code: 404,
          msg: "Not Found",
        })
      );
    }

    let rawBody = "";

    req.on("data", chunk => {
      rawBody += chunk;
    });

    req.on("end", async () => {
      try {
        const body = JSON.parse(rawBody);

        const result =
          await relayAaPanel(body);

        res.writeHead(result.status, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify(result.payload)
        );
      } catch (error: any) {
        res.writeHead(500, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            code: 500,
            msg:
              error.message ||
              "Internal Server Error",
          })
        );
      }
    });
  }
);

server.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});