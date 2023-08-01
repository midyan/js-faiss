/* eslint-disable */

const jsFaiss = require("./build/index.cjs");

const hnswStore = jsFaiss.hnsw({
  baseNN: 32,
});

const testPoints = jsFaiss.utils.geometry.create3DGridOfSize(process.arg); // ~10k

console.time(`Adding ${testPoints.length} points to HNSW`);
hnswStore.add(testPoints);
console.timeEnd(`Adding ${testPoints.length} points to HNSW`);

const queryPoint = [
  testPoints.length * Math.random(),
  testPoints.length * Math.random(),
  testPoints.length * Math.random(),
];

console.time(`Querying HNSW for nearest neighbor`);
hnswStore.query(queryPoint);
console.timeEnd(`Querying HNSW for nearest neighbor`);
