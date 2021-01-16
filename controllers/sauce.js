const Sauce = require('../models/sauce');
const fs = require('fs');
const sauce = require('../models/sauce');

// Ajout d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes : 0,
        dislikes : 0,
        usersLiked : [],
        usersDisliked :[]
    });
    sauce.save()
    .then(() => res.status(201).json({message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

// Affichage de la sauce sélectionnée par l'utilisateur
exports.findOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }))
};

// Affichage de toutes les sauces de la BDD
exports.findSauces = (req, res, next) => {
    Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
};

// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
         } : { ...req.body };
    Sauce.updateOne({_id: req.params.id}, { ...sauceObject, _id: req.params.id})
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

// Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));
};

// Gestion des likes et des dislikes
exports.sauceLiked = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(() => {
        // Si l'utilisateur like la sauce
        if (req.body.like == 1) {
            Sauce.updateOne({ _id: req.params.id }, {$push: { usersLiked: req.body.userId }, $inc: { likes: 1 }})
            .then(() => res.status(200).json({ message: "Objet modifié !" }))
            .catch((error) => res.status(400).json({ error }));
        }
        
        // Si l'utilisateur dislike la sauce
        if (req.body.like == -1) {
            Sauce.updateOne({ _id: req.params.id }, {$push: { usersDisliked: req.body.userId }, $inc: { dislikes: 1 }})
            .then(() => res.status(200).json({ message: "Objet modifié !" }))
            .catch((error) => res.status(400).json({ error }));
        }
        
        // Si l'utilisateur annule un like ou un dislike
        if (req.body.like == 0) {
            Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                let usersLikedFound = sauce.usersLiked.indexOf(req.body.userId) >= 0;

                // Si l'utilisateur avait disliké la sauce
                if (usersLikedFound == false) {
                    Sauce.updateOne({ _id: req.params.id }, {$pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 }})
                    .then(() => res.status(200).json({ message: "Objet modifié !" }))
                    .catch((error) => res.status(400).json({ error }));
                
                // Si l'utilisateur avait liké la sauce
                } else {
                    Sauce.updateOne({ _id: req.params.id }, {$pull: { usersLiked: req.body.userId }, $inc: { likes: -1 }})
                    .then(() => res.status(200).json({ message: "Objet modifié !" }))
                    .catch((error) => res.status(400).json({ error }));
                }
            })
            .catch((error) => res.status(400).json({ error }))
        }    
    })
};