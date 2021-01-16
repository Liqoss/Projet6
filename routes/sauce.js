const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Affichage de toutes les sauces dans la BDD
router.get('/', auth, sauceCtrl.findSauces);

// Affichage de la sauce sélectionnée par l'utilisateur
router.get('/:id', auth, sauceCtrl.findOneSauce);

// Ajout d'une sauce
router.post('/', auth, multer, sauceCtrl.createSauce);

// Modification d'une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce);

// Suppression d'une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// Gestion des likes et dislikes des sauces
router.post('/:id/like', auth, sauceCtrl.sauceLiked);

module.exports = router;