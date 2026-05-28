import { IncomingMessage, ServerResponse } from "node:http";

import { json } from "../utils/json.js";
import { getRequestBody } from "../utils/request-body.js";
import { handleAaPanel } from "../controllers/aapanel.controller.js";

export async function router(
  req: IncomingMessage,
  res: ServerResponse
) {
  if (
    req.method === "POST" &&
    req.url === "/aapanel"
  ) {
    try {
      const body = await getRequestBody(req);

      const result = await handleAaPanel(body);

      return json(
        res,
        result.status,
        result.payload
      );
    } catch (error: any) {
      return json(res, 500, {
        code: 500,
        msg:
          error.message ||
          "Internal Server Error",
      });
    }
  }

  return json(res, 404, {
    code: 404,
    msg: "Not Found",
  });
}
