import http from "node:http";

import { env } from "./config/env.js";
import { router } from "./routes/index.js";

const server = http.createServer(router);

server.listen(env.port, () => {
  console.log(
    `Server running on port ${env.port}`
  );
});
