const express = require('express');
const router = express.Router();
const stuffCtrl = require('../controllers/stuff');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', auth, stuffCtrl.findSauces);

router.get('/:id', auth, stuffCtrl.findOneSauce);

router.post('/', auth, multer, stuffCtrl.createThing);

router.put('/:id', auth, multer, stuffCtrl.modifyThing);

router.delete('/:id', auth, stuffCtrl.deleteThing);

// router.post('/:id/like', auth, stuffCtrl.thingLiked);

module.exports = router;