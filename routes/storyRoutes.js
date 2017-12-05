var express = require('express');
var router = express.Router();
var storyController = require('../controllers/storyController.js');

/*
 * GET
 */
router.get('/', storyController.list);

/*
 * GET
 */
router.get('/:id', storyController.show);

router.get('/:filter/:value', storyController.filter);

/*
 * POST
 */
router.post('/', storyController.create);

/*
 * PUT
 */
router.put('/:id', storyController.update);

/*
 * DELETE
 */
router.delete('/:id', storyController.remove);


module.exports = router;
