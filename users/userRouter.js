const express = require('express');

const router = express.Router();

const Users = require('./userDb');
const Posts = require('../posts/postDb');

router.post('/',validateUser, (req, res) => {
  // console.log(req.body);
  Users.insert(req.body)
  .then(users => {
    res.status(201).json(users)
  })
  .catch(err => {
    console.log(err);
    res.status(400).json({
      message: 'please provide what is missing'
    })
  })
});

router.post('/:id/posts',validateUserId,validatePost, (req, res) => {
  Posts.insert(req.body)
  .then(posts => {
    res.status(200).json(posts)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({
      message: 'there was an error saving posts to user'
    })
  })
});

router.get('/', (req, res) => {
  Users.get(req.query)
  .then(users => {
    res.status(200).json(users);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      message: "the users info could not be retreived"
    })
  })
});

router.get('/:id', validateUserId, (req, res) => {
  Users.getById(req.params.id)
  .then(users => {
    if(users){
      res.status(200).json(users);
    } else{
      res.status(404).json({
        message: "the user with that id does not exist"
      })
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      message: "the user info could not be retreived"
    })
  })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  Users.getUserPosts(req.params.id)
  .then(users => {
    if(users){
      res.status(201).json(users);
    }else {
      res.status(404).json({ message: 'the user does not exist'})
    }
  })
  .catch( err => {
    res.status(500).json({
      message: 'the posts could not be retreived'
    })
  })
});

router.delete('/:id',validateUserId, (req, res) => {
  Posts.remove(req.params.id)
  .then(count => {
    if(count > 0){
      res.status(200).json({message: "user was deleted"})
    } else{
      res.status(404)({message: "the user does not exist"})
    }
  })
  .catch( err => {
    console.log(err);
    res.status(500).json({
      message:"the user could not be removed"
    })
  })
});

router.put('/:id', validateUserId, (req, res) => {
  const changes = req.body;
  Users.update(req.parms.id, changes)
  .then(users => {
    if(changes.hasOwnProperty("name")){
      res.status(200).json(changes);
    }else{
      res.status(400).json({
        message: "please provide name for the user"
      })
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      message: 'the user info could not be motified'
    })
  })
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  // console.log(req.params);
  Users.getById(req.params.id)
  .then(user => {
    if (user) {
      req.user = user;
    } else {
      res.status(400).json({ message: "invalid user id" });
    }
    next();
  })
  .catch(err => {
    console.log('err');
    res.status(400).json({ message: "no id found" });
    next();
  });
}

function validateUser(req, res, next) {
  if(!req.body) {
     res.status(400).json({ message: "missing user data"});
   
  } else if (!req.body.name){
    res.status(400).json({ message: "missing required name field"});
  
  }
  next();
}

function validatePost(req, res, next) {
  if(!req.body){
    res.status(400).json({message: "missing post data"});
    next()
  } else if (!req.body.text){
    res.status(400).json({message: "mising required text field"});
    next()
  }
}

module.exports = router;
