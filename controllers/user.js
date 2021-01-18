const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const MaskData = require('maskData');
const hash = require('hash.js');

// Définition du masque de l'adresse mail
const maskEmail2Options = {
    maskWith: "*", 
    unmaskedStartCharactersBeforeAt: 3,
    unmaskedEndCharactersAfterAt: 2,
    maskAtTheRate: false
}

exports.signup = (req, res, next) =>{
    const emailMask = hash.sha256().update(req.body.email).digest('hex');
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: emailMask,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé'}))
                .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};

exports.login = (req, res, next) =>{
    const emailMask = hash.sha256().update(req.body.email).digest('hex');
    User.findOne({ email: emailMask})
    .then( user => {
        if(!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !'});
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid =>{
            if (!valid){
                return res.status(401).json({error: 'Mot de passe incorrect !'});
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    {userId: user._id},
                    'RANDOM_TOKEN_SECRET',
                    {expiresIn: '24h'}
                )
            })
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
