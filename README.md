# Current Status: ALPHA-DEVELOPMENT

# js-faiss

Meet js-faiss: Your JavaScript learning package for vector search algorithms! 🚀 Explore and understand the most common vector search algorithms used in the industry with js-faiss, a TypeScript project designed to elevate your knowledge. Get ready for an insightful journey into the world of vector search algorithms! 🎉👩‍💻👨‍💻💡

js-faiss is a TypeScript package that provides an intuitive interface to learn and dive deep into some of the most common vector search algorithms used in the industry, such as HNSW, ANN, kNN, and SPTAG.

This package aims to make it easy for developers to experiment, benchmark, and evaluate various vector search algorithms, allowing them to better understand the fundamental concepts and choose the best algorithm for their specific use-cases.

# Current Features

- [x] Base Vector Store
- [x] HNSW
    - [x] Adding new points to the vector store
    - [x] Search implementation
    - [x] Benchmarking and optimization
- [ ] ANN
    - [ ] Adding new points to the vect
    or store
    - [ ] Search implementation
    - [ ] Benchmarking and optimization
- [ ] kNN
    - [ ] Adding new points to the vector store
    - [ ] Search implementation
    - [ ] Benchmarking and optimization
- [ ] SPTAG
    - [ ] Adding new points to the vector store
    - [ ] Search implementation
    - [ ] Benchmarking and optimization
- [ ] Data Persistency
- [ ] Publish to NPM
# Limitations

Memory management in JS is a pain. Right now we can handle up to 100k points in memory, but we're working on a solution to handle more. Let's get a working version first.

# Benchmarks
```sh
$ js-faiss % node benchmark.js
$ Adding 10647 points to HNSW: 30.073ms
$ Querying HNSW for nearest neighbor: 131.977ms
```

# 🛠 Installation

Follow the instructions below to set up js-faiss on your local machine:

NOTE: NOT PUBLISHED YET :D 
```shell
$ npm install js-faiss
```

This will install the necessary dependencies and set up the project for use.

# 💻 Usage

Import the desired algorithms from the package and start using them as per your requirements:

```javascript
import jsFaiss from 'js-faiss';

// HNSW Example
const hnswStore = jsFaiss.hnsw({
  baseNN: 32,
});

// add points, search, etc.
hnswStore.add([
    [1, 1, 1],
    [0, 1, 2]
])

const nearestNeighbors = hnswStore.search([1.5, 1.2, 1.1]);
```

# 🌟 Contributing

Contributions are welcome! If you have any ideas, suggestions, or improvements, feel free to submit a pull request or open an issue. We'd love to collaborate with you on making js-faiss even better.

# 📚 License

js-faiss is released under the MIT License. For more information, please refer to the [LICENSE](LICENSE) file.
