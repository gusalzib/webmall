var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var archiveSchema = new Schema({
    products: [{
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }}],

    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    payment_id: { type: String, required: true }, 
    buyer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buyer'
    },
    order_date: { type: String, required: true },

})



module.exports = mongoose.model("archives", archiveSchema);