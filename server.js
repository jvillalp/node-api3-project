const express = require('express');

const PostRouter = require('./posts/postRouter');

const server = express();

server.use(express());

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

// function logger(req, res, next) {}

server.use('/api/posts', PostRouter)

module.exports = server;
