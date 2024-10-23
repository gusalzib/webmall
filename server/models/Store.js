var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// How to make products and seller of their respective types?? Like products: {type: Product}
var storeSchema = new Schema({
    store_name: {
        type: String,
        required:[true, "Store must have a name!"]
    },
    location: {
        type: String,
        required:[true, "Store must have a location!"]
    },
    org_number: {
        type: Number,
        required:[true, 'Please specify your organisation number']
    },
    description: {
    type: String },
    products: {
    type: String },
    sellers: {
    type: String},
    // banner_img: {
    //     type: String },
    logo_img: {
        type: String }

});

module.exports = mongoose.model("stores", storeSchema);