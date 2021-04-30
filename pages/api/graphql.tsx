import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  shouldRenderGraphiQL
} from "graphql-helix";
import { NextApiHandler } from "next/types";
import schema from "../../src/graphql/index";
import { resolveSession } from "../../src/utils/sessions";

export default (async (req, res) => {
  const session = await resolveSession({ req, res });

  const request = {
    body: req.body,
    headers: req.headers,
    method: req.method,
    query: req.query
  };

  if (shouldRenderGraphiQL(request)) {
    res.send(renderGraphiQL({ endpoint: "/api/graphql" }));
  } else {
    const { operationName, query, variables } = getGraphQLParameters(request);

    const result = await processRequest({
      operationName,
      query,
      variables,
      request,
      schema,
      contextFactory: () => {
        return {
          req,
          res,
          user: session?.user,
          session: session
        };
      }
    });

    if (result.type === "RESPONSE") {
      result.headers.forEach(({ name, value }) => res.setHeader(name, value));
      res.status(result.status);
      res.json(result.payload);
    } else if (result.type === "MULTIPART_RESPONSE") {
      res.writeHead(200, {
        Connection: "keep-alive",
        "Content-Type": 'multipart/mixed; boundary="-"',
        "Transfer-Encoding": "chunked"
      });

      req.on("close", () => {
        result.unsubscribe();
      });

      res.write("---");

      await result.subscribe(result => {
        const chunk = Buffer.from(JSON.stringify(result), "utf8");
        const data = [
          "",
          "Content-Type: application/json; charset=utf-8",
          "Content-Length: " + String(chunk.length),
          "",
          chunk
        ];

        if (result.hasNext) {
          data.push("---");
        }

        res.write(data.join("\r\n"));
      });

      res.write("\r\n-----\r\n");
      res.end();
    } else {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
        "Cache-Control": "no-cache"
      });

      req.on("close", () => {
        result.unsubscribe();
      });

      await result.subscribe(result => {
        res.write(`data: ${JSON.stringify(result)}\n\n`);
      });
    }
  }
}) as NextApiHandler;
