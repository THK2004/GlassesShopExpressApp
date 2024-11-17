var express = require('express');
var { getGlasses, getProductDetail } = require("../controllers/glassesController");
var router = express.Router();

/* GET glasses page. */
router.get('/', getGlasses);

/* GET product detail page. */
router.get('/:id', getProductDetail);

module.exports = router;