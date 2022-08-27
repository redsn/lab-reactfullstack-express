const  mongoose = require('mongoose');
const Schema = mongoose.Schema;

const peopleSchema = new Schema({
    name: String,
    image: {type: String, default:"https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"},
    title: String,
    createdBy: String
}, {timestamps: true, });

module.exports = mongoose.model('People',  peopleSchema)