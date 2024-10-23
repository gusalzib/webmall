var mongoose = require('mongoose');
var emailValidator = require('validator');
var Schema = mongoose.Schema;



// remove store_name from the ER diagram!
var buyerSchema = new Schema({
    fname: {
        type: String, 
        required: true
    }, 
    minit: { type: String, 
        required: true }, 
    lname: { type: String, 
        required: true }, 
    phone_number: { type: String, 
        required: true },
    email: { type: String, 
        required: true,
        validate: [emailValidator.isEmail, 'invalid email']
    },
    street: { type: String, 
        required: true },
    zipcode: { type: String, 
        required: true },
    city: { type: String, 
        required: true },
    password: { type: String, 
        required: true }, 
    
})



module.exports = mongoose.model("buyers", buyerSchema);