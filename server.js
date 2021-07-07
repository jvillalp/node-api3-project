//imports
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
//imports from other files in project folder
const PostRouter = require('./posts/postRouter');
const userRouter = require('./users/userRouter');

const server = express();

//use
server.use(helmet());
server.use(express());
server.use(bodyParser.json());
server.use('/api/users', logger, userRouter, PostRouter)

server.get('/', logger, (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  const method = req.method;
  const endpoint = req.originalUrl;
  const time = new Date();
  console.log(`${method} to ${endpoint} at ${time}`);

  next(); //moves the request to the next middleware
}

module.exports = server;
