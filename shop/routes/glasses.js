var express = require('express');
var router = express.Router();

/* GET glasses page. */
router.get('/', function(req, res, next) {
  res.render('glasses/glasses', {glasses: true});
});

module.exports = router;