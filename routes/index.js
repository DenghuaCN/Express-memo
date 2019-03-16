var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  var data;

  if (req.session.user) {

    // console.log("req.session : ", req.session);
    
    data = {
      isLogin: true,
      user: req.session.user,
      username: req.session.passport.user.username
    }
  } else {
    data = {
      isLogin: false
    }
  }
  // console.log(data);

  res.render('index', data);
});

module.exports = router;
