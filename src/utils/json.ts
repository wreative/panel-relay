import { ServerResponse } from "node:http";

export function json(
  res: ServerResponse,
  status: number,
  payload: unknown
) {
  res.writeHead(status, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify(payload));
}
