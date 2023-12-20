import { pipeline } from "@xenova/transformers";

const transformText = async (req, res) => {
  let text = await transformTextHelper(req.body.text);
  console.log({ text });
  res.json(text);
};

const transformTextHelper = async (text) => {
  let extractor = await pipeline(
    "feature-extraction",
    "Xenova/bert-base-uncased",
    { revision: "default" }
  );
  let output = await extractor(text, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(output.data);
};

export { transformText, transformTextHelper };
