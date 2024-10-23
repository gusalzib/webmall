var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sellerSchema = new Schema({
    fname: {type: String}, 
    minit: { type: String }, 
    lname: { type: String }, 
    phone_number: { type: String },
    email: { type: String },
    store_name: { type: String },
    password: { type: String }, 
    
})
const Seller = mongoose.model("sellers", sellerSchema);
module.exports = Seller;