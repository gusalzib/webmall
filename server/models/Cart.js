var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// remove store_name from the ER diagram!
var cartSchema = new Schema({
    buyer_id: {type: String}, 
    products: [{
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        product_quantity: {type: Number},
        product_price: {type: Number}
    }], 
    total_sum: { type: Number }, 

})



module.exports = mongoose.model("cart", cartSchema);