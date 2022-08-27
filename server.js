///////////////////////////////
// DEPENDENCIES
////////////////////////////////
// get .env variables
require("dotenv").config();
const cors = require('cors');
const morgan = require('morgan');
const admin = require('firebase-admin');
const {getAuth} = require('firebase-admin/auth');
const serviceAccount = require('./firebase-private-key.json');

// pull PORT from .env, give default value of 4000
const { PORT = 4000, DATABASE_URL, PRIVATE_KEY, PRIVATE_KEY_ID} = process.env;

const { urlencoded } = require("express");
// import express, mongoose
const express = require("express");
const mongoose = require('mongoose');
const peopleRouter= require('./Controllers/peoples');

// Mongoose Connection
mongoose.connect(DATABASE_URL);
const db = mongoose.connection;

// DB Check
db.on('connected', () => {console.log('Connected')});
db.on('disconnect', () => {console.log('disconnected')});
db.on('error', (err)=> {console.log('an error occured' + err.message)});


// create application object
const app = express();

/// Body parse middleware
// urlencoded()
// json() 
// Both will 'use' req.body
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

admin.initializeApp({
    credential: admin.credential.cert(
    {
        "type": "service_account",
        "project_id": "people-app-lab",
        "private_key_id": PRIVATE_KEY_ID,
        "private_key": PRIVATE_KEY.replace(`\n`,''),
        "client_email": "firebase-adminsdk-e4axu@people-app-lab.iam.gserviceaccount.com",
        "client_id": "100023411907152501828",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-e4axu%40people-app-lab.iam.gserviceaccount.com"
      }
      
    )
  });


//// AUTHORIZATION MIDDLEWARE ///
app.use(async function(req,res,next) {
    try {
        const token = req.get('Authorization');
        if(token){
            const user = await getAuth().verifyIdToken(token.replace('Bearer ', ''))
            req.user = user;
        } else{
            req.user = null;
        }    
        // const user = await admin.auth.verifyIdToken(token.replace('Bearer '));
        // console.log(user);
        // console.log(user);   
    } catch (error) {
        // console.log(error);
        req.user = null
    }
    next();
});

function isAuthenticted(req,res,next) {
    if(req.user) return next();
    res.status(401).json({message: 'You must be logged in to view this content'})
}

/////////////
/////////////////////////////////////////////////////////////
///Models////
/////////////

// const Schema = mongoose.Schema;

// const peopleSchema = new Schema({
//     name: String,
//     image: {type: String, default:"https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"},
//     title: String
// }, {timestamps: true, });

// const People = mongoose.model('People',  peopleSchema)


/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////

///////////////////////////////
// ROUTES
////////////////////////////////
// create a test route
app.get("/", (req, res) => {
    res.send("hello world");
});

//// CONTROLLERS ////
////INDEX///////////
// app.get('/people', (req,res) => {
//     People.find({}, (err, index) => {

//     })
// });



app.use('/api/people', isAuthenticted, peopleRouter);

// /// INDEX
// app.get('/people', async (req,res)=>{
//     // const people = await People.find({});
//     // res.send(people);
//     ////
//     try{
//     res.status(200).json(await People.find({}));
//     } catch (error) {
//         res.status(400).json({message: 'Bad Request'});
//     }
// });

// ///CREATE/////
// app.post('/people', async (req,res) => {
//     try{
//         res.status(201).json(await People.create(req.body));
//     } catch(error){
//         res.status(400).json({message: 'Bad Request'});
//     }
// })

// //DELETE///
// app.delete('/people/:id', async (req,res) => {
//     try{
//         res.status(200).json(await People.findByIdAndDelete(req.params.id));
//     } catch(error){
//         res.status(400).json({message: 'bad request'});
//     }
// });

// //UPDATE//
// app.put('/people/:id', async (req,res) => {
//     try {
//         res.status(200).json(await People.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             {new: true} // true returns the new object, otherwise returns the old one
//             /// Fourth argument would be a callback
//         ));
//     } catch (error) {
//         res.status(400).json({message: 'Bad Request'});
//     }
// })

app.get('/*', (req,res) => {
    res.status(404).json({message: 'not found'});
})

///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT || 4000, () => console.log(`listening on PORT ${PORT}`));