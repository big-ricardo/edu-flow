import { app, HttpRequest, HttpResponseInit } from "@azure/functions";

export async function Pong(request: HttpRequest): Promise<HttpResponseInit> {
  const name = request.query.get("name") || (await request.text()) || "world";

  return { body: `Pong!! Hello ${name}!` };
}

app.http("Ping", {
  route: "ping",
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: Pong,
});
