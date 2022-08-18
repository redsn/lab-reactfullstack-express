const People = require('../Models/people');
const router = require('express').Router();
const mongoose = require('mongoose');

module.exports = router;


router.get('/', async (req,res)=>{
    // const people = await People.find({});
    // res.send(people);
    ////
    try{
    res.status(200).json(await People.find({}));
    } catch (error) {
        res.status(400).json({message: 'Bad Request'});
    }
});

///CREATE/////
router.post('/', async (req,res) => {
    try{
        res.status(201).json(await People.create(req.body));
    } catch(error){
        res.status(400).json({message: 'Bad Request'});
    }
})

//DELETE///
router.delete('/:id', async (req,res) => {
    try{
        res.status(200).json(await People.findByIdAndDelete(req.params.id));
    } catch(error){
        res.status(400).json({message: 'bad request'});
    }
});

//UPDATE//
router.put('/:id', async (req,res) => {
    try {
        res.status(200).json(await People.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true} // true returns the new object, otherwise returns the old one
            /// Fourth argument would be a callback
        ));
    } catch (error) {
        res.status(400).json({message: 'Bad Request'});
    }
})