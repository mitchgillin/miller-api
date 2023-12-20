import { v4 as uuidv4 } from "uuid";
import { transformTextHelper } from "./hf.js";

const deleteCollection = async (req, res, client) => {
  const { collectionName } = req.params;
  const del = await client.deleteCollection(collectionName);
  res.json(del);
};

const createCollection = async (req, res, client) => {
  const { collectionName } = req.params;

  const collection = await client.createCollection(collectionName, {
    vectors: {
      size: 768,
      distance: "Euclid",
    },
    optimizers_config: {
      default_segment_number: 2,
    },
    replication_factor: 2,
  });

  //  -------- Create payload indexes -------------

  await client.createPayloadIndex(collectionName, {
    field_name: "content",
    field_schema: "text",
    wait: true,
  });

  console.log(collection);
  res.json(collection);
};

const addPoints = async (req, res, client) => {
  const { collectionName } = req.params;
  const { text } = req.body;
  const transformedText = await transformTextHelper(text);

  console.log({ transformedText });

  const point = {
    id: uuidv4(),
    vector: transformedText,
    payload: {
      text,
    },
  };

  console.log({ point });

  const insertStatus = await client.upsert(collectionName, {
    wait: true,
    points: [point],
  });

  const collectionInfo = await client.getCollection(collectionName);
  console.log("number of points:", collectionInfo.points_count);

  res.json(insertStatus);
};

const search = async (req, res, client) => {
  const { collectionName } = req.params;
  const { query } = req.body;
  const transformedQuery = await transformTextHelper(query);

  const res1 = await client.search(collectionName, {
    vector: transformedQuery,
    limit: 10,
  });

  res.json(res1);
};

export { createCollection, addPoints, search, deleteCollection };
