# Current Status: PRE-ALPHA-DEVELOPMENT

# js-faiss

Meet js-faiss: Your JavaScript learning package for vector search algorithms! 🚀 Explore and understand the most common vector search algorithms used in the industry with js-faiss, a TypeScript project designed to elevate your knowledge. Get ready for an insightful journey into the world of vector search algorithms! 🎉👩‍💻👨‍💻💡

js-faiss is a TypeScript package that provides an intuitive interface to learn and dive deep into some of the most common vector search algorithms used in the industry, such as HNSW, ANN, kNN, and SPTAG.

This package aims to make it easy for developers to experiment, benchmark, and evaluate various vector search algorithms, allowing them to better understand the fundamental concepts and choose the best algorithm for their specific use-cases.

# Current Features

- [x] Base Vector Store
- [ ] Data Persistency
- [ ] HNSW 🚧
    - [x] Adding new points to the vector store
    - [ ] Search implementation 🚧
    - [ ] Benchmarking and optimization 🚧
- [ ] ANN
    - [ ] Adding new points to the vector store
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
import faiss from 'js-faiss';

const hnsw = faiss.hnsw(/*...*/);
// add points, search, etc.

// similarly for other algorithms...
```

# 🌟 Contributing

Contributions are welcome! If you have any ideas, suggestions, or improvements, feel free to submit a pull request or open an issue. We'd love to collaborate with you on making js-faiss even better.

# 📚 License

js-faiss is released under the MIT License. For more information, please refer to the [LICENSE](LICENSE) file.
