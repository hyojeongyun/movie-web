const express = require('express');
const router = express.Router();
const { Favorite } = require('../models/Favorite');

router.post('/favoriteNumber', (req, res)=> {
    req.body.movieId

    //mongoDB에서 favorite 숫자를 가져오기

    Favorite.find({"movieId": req.body.movieId })
    .exec((err, info)=>{
        if(err) return res.status(400).send(err)

        //프론트에 숫자 정보 보내주기
        res.status(200).json({success: true, favoriteNumber: info.length})
    })

    
})

router.post('/favorited', (req, res)=> {
    req.body.movieId

    //내가 이 영화를 favorite 리스트에 넣었는지 정보를 DB에서 가져오기

    Favorite.find({"movieId": req.body.movieId , "userFrom" : req.body.userFrom})
    .exec((err, info)=>{
        if(err) return res.status(400).send(err)

        let result = false;

        if(info.length !== 0){  //내가 이 영화를 favorite 리스트에 넣었다면
            result = true
        }

        res.status(200).json({success: true, favorited: result})
    })

    
})

router.post('/removeFromFavorite', (req, res)=> {
    
    Favorite.findOneAndDelete({movieId: req.body.movieId, userFrom: req.body.userFrom})
        .exec((err, doc)=> {
            if(err) return res.status(400).send(err)
            else res.status(200).json({success: true, doc})
        })
})

//movie id 정보를 DB에 있는 favoriteSchema에 넣어줌
router.post('/addToFavorite', (req, res)=> {

    const favorite = new Favorite(req.body) //instance 만듦
    
    favorite.save((err, doc) => {
        if(err) {
            return res.status(400).send(err)
        }
        return res.status(200).json({success: true})
    })
})


router.post('/getFavoritedMovie', (req, res)=> {

    Favorite.find({"userFrom": req.body.userFrom})
        .exec((err, favorites) => {
            if(err) return res.status(400).send(err)

            return res.status(200).json({success: true, favorites})
        })
})


router.post('/removeFromFavorite', (req, res)=> {

    Favorite.findOneAndDelete({movieId: req.body.movieId, userFrom: req.body.userFrom})
        .exec((err, result) => {
            if(err) return res.status(400).send(err)

            return res.status(200).json({success: true})
        })
})

module.exports = router;
