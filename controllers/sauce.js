const Sauce = require('../models/sauce');
const fs = require('fs')

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

exports.findOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }))
};

exports.findSauces = (req, res, next) => {
    Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
};

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

exports.sauceLiked = (req, res, next) => {
    Sauce.updateOne({ _id: req.params.id }, {$pull: {usersLiked: req.body.userId}, $pull: { usersDisliked: req.body.userId }})
        .then(() => res.status(200))
        .catch(error => res.status(400).json({ error }))

    if (req.body.like == 1){
        Sauce.updateOne({ _id: req.params.id }, {$push: {usersLiked: req.body.userId}})
        .then(() => res.status(200).json({message: 'Sauce ajoutée aux likes'}))
        .catch(error => res.status(400).json({ error }))
        likes = usersLiked.length
    }

    else if (req.body.like == 0){
        Sauce.updateOne({})
        .then(() => res.status(200).json({message: 'Likes et dislikes remis à zéro'}))
        .catch(error => res.status(400).json({ error }))

    }

    else {
        Sauce.updateOne({ _id: req.params.id }, {$push: {usersDisliked: req.body.userId}})
        .then(() => res.status(200).json({message: 'Sauce ajoutée aux dislikes'}))
        .catch(error => res.status(400).json({ error }))
        dislikes = usersDisliked.length
    }

    Sauce.updateOne({ _id: req.params.id }, {$set: {likes: usersLiked.length}})
        .then(() => res.status(200).json({message: 'Nombre de likes mis à jour'}))
        .catch(error => res.status(400).json({ error }))
    Sauce.updateOne({ _id: req.params.id }, {$set: {dislikes: usersDisliked.length}})
        .then(() => res.status(200).json({message: 'Nombre de dislikes mis à jour'}))
        .catch(error => res.status(400).json({ error }))
}

/*exports.sauceLiked = (req, res, next) => {
    if (req.body.like == 0 && Sauce.find({usersLiked: req.body.userId})){
        Sauce.updateOne({ usersLiked: req.body.userId }, {$pull : {usersLiked : req.body.userId}, $inc: {likes: -1}})
        .then(()=> res.status(200).json({ message: 'Sauce retirée des likes' }))
        .catch(error => res.status(400).json({ error }))
    }
    
    else if (req.body.like == 0 && Sauce.find({ usersDisliked: req.body.userId })){
        Sauce.updateOne({ usersDisliked: req.body.userId }, {$pull: {usersDisliked: req.bodyuserId}, $inc: {dislikes: -1}})
        .then(()=> res.status(200).json({ message: 'Sauce retirée des dislikes' }))
        .catch(error => res.status(400).json({ error }))
    }

    else if (req.body.like == 1 && Sauce.find({ usersDisliked: req.body.userId })){
        Sauce.updateOne({ userId: req.params.id}, {$push: {usersLiked: req.body.userId}, $inc: {likes : +1}})
        .then(()=> res.status(200).json({ message: 'Sauce ajoutée aux likes' }))
        .catch(error => res.status(400).json({ error }))
    }

    else if (req.body.like == 1 && Sauce.find({ usersDisliked: req.body.userId })){
        Sauce.updateOne({ userId: req.params.id}, {$push: {usersLiked: req.body.userId}, $pull: {usersDisliked: req.body.userId}, $inc: {dislikes: -1}, $inc: {likes : +1}})
        .then(()=> res.status(200).json({ message: 'Sauce ajoutée aux likes et retirée des dislikes' }))
        .catch(error => res.status(400).json({ error }))
    }
    
    else if (req.body.like == -1 && Sauce.find({ usersLiked: req.body.userId})){
        Sauce.updateOne({ userId: req.params.id}, {$push: {usersDisliked : req.body.user}, $inc: {dislikes: +1}})
        .then(()=> res.status(200).json({ message: 'Sauce ajoutée aux dislikes' }))
        .catch(error => res.status(400).json({ error }))
    }

    else if (req.body.like ==-1 && Sauce.find({ usersLiked: req.body.userId})){
        Sauce.updateOne({ userId: req.params.id}, {$push: {usersDisliked : req.body.user}, $pull: {usersLiked: req.body.userId}, $inc: {likes: -1}, $inc: {dislikes: +1}})
        .then(()=> res.status(200).json({ message: 'Sauce ajoutée aux dislikes et retirée des likes' }))
        .catch(error => res.status(400).json({ error }))
    }
};*/