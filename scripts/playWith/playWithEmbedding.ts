import prisma from "../../prismaClient";
import OpenAI from "openai";
import * as tf from "@tensorflow/tfjs";

// @ts-ignore
prisma.$on("query", (e) => {});

const cosineSimilarity = (a: tf.Tensor, b: tf.Tensor): tf.Tensor => {
  const dotProduct = a.dot(b);
  const magnitudeA = a.norm();
  const magnitudeB = b.norm();
  return dotProduct.div(magnitudeA.mul(magnitudeB));
};

interface ComparisonResult {
  Algorithm: string;
  Word1: string;
  Word2: string;
  Result: string;
}

// This is where all word phrases are defined for easy editing
// const wordsToCompare = ["hello", "hi", "namaste", "bye", "orange"];

// const wordsToCompare = [
//   {name: 'hello', value: 'hello'},
//   {name: 'hi', value: 'hi'},
//   {name: 'namaste', value: 'namaste'},
//   {name: 'bye', value: 'bye'},
//   {name: 'orange', value: 'orange'},
// ];

const wordsToCompare = [
  {name: 'hello', value: 'I said hello while my emotions were happy'},
  {name: 'hi', value: 'I said hi while my emotions were happy'},
  {name: 'namaste', value: 'I said namaste while my emotions were happy'},
  {name: 'bye', value: 'I said bye while my emotions were happy'},
  {name: 'orange', value: 'I said bye while my emotions were happy'},
];


// const wordsToCompare = [
//   {name: 'hello', value: JSON.stringify({ emotion: "happy", speaker: 'me', saying: "hello" })},
//   {name: 'hi', value: JSON.stringify({  emotion: "happy", speaker: 'me', saying: "hi"})},
//   {name: 'namaste', value: JSON.stringify({ emotion: "happy", speaker: 'me', saying: "namaste" })},
//   {name: 'bye', value: JSON.stringify({ emotion: "happy", speaker: 'me', saying: "bye" })},
//   {name: 'orange', value: JSON.stringify({ emotion: "happy", speaker: 'me', saying: "orange", })},
// ];

const collectResults = (
  algorithm: string,
  word1: string,
  word2: string,
  result: tf.Tensor,
): ComparisonResult => {
  return {
    Algorithm: algorithm,
    Word1: word1,
    Word2: word2,
    Result: String(result.arraySync()).substring(0, 6), // Format result to 4 decimal places
  };
};

(async () => {
  console.log("Starting comparison!");

  const openai = new OpenAI({
    organization: "org-3I98ggnlotoupwKfLB3qceRi",
    project: "proj_ww7EwIq22WiUKh0NM5eit6re",
    apiKey: process.env.OPENAI_KEY,
  });

  const result = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: wordsToCompare.map(x => x.value), // Use the words array defined earlier
    dimensions: 1536,
  });

  const vectors = result.data.map((d) => tf.tensor(d.embedding));

  const pairs = [
    {
      word1: wordsToCompare[0].name,
      word2: wordsToCompare[1].name,
      vector1: vectors[0],
      vector2: vectors[1],
    },
    {
      word1: wordsToCompare[0].name,
      word2: wordsToCompare[2].name,
      vector1: vectors[0],
      vector2: vectors[2],
    },
    {
      word1: wordsToCompare[0].name,
      word2: wordsToCompare[3].name,
      vector1: vectors[0],
      vector2: vectors[3],
    },
    {
      word1: wordsToCompare[0].name,
      word2: wordsToCompare[4].name,
      vector1: vectors[0],
      vector2: vectors[4],
    },
  ];

  const results: ComparisonResult[] = [];

  console.log("*** Euclidean Distance ***");
  pairs.forEach((pair) => {
    const distance = tf.norm(pair.vector1.sub(pair.vector2));
    results.push(
      collectResults("Euclidean Distance", pair.word1, pair.word2, distance),
    );
  });

  console.log("*** Cosine Similarity ***");
  pairs.forEach((pair) => {
    const similarity = cosineSimilarity(pair.vector1, pair.vector2);
    results.push(
      collectResults("Cosine Similarity", pair.word1, pair.word2, similarity),
    );
  });

  console.log("*** Dot Product ***");
  pairs.forEach((pair) => {
    const dotProd = pair.vector1.dot(pair.vector2);
    results.push(
      collectResults("Dot Product", pair.word1, pair.word2, dotProd),
    );
  });

  console.log("Comparison complete!");
  console.table(results);
})();

export {};
