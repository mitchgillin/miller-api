import express from "express";
import { QdrantClient } from "@qdrant/js-client-rest";
import {
  createCollection,
  addPoints,
  search,
  deleteCollection,
} from "./qdrant.js";

import { transformTextHelper, transformText } from "./hf.js";
import bodyParser from "body-parser";

// TO connect to Qdrant running locally
const client = new QdrantClient({ url: "http://127.0.0.1:6333" });
const app = express();
const port = 3001;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/transform", transformText);

app.post("/collection/create/:collectionName", (req, res) =>
  createCollection(req, res, client)
);

app.delete("/collection/:collectionName", (req, res) =>
  deleteCollection(req, res, client)
);

app.post("/collection/add/:collectionName", (req, res) =>
  addPoints(req, res, client)
);

app.get("/collection/:collectionName/search", (req, res) =>
  search(req, res, client)
);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
