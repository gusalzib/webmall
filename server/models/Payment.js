var mongoose = require("mongoose");
var Schema = mongoose.Schema;
// remove store_name from the ER diagram!
// payment_id so that the order can be linked to the payment

//ref references the schema of the objectId
var paymentSchema = new Schema({
  buyer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Buyer",
  },
  products: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      product_quantity: {
        type: Number,
        min: [0, "cannot be negative value"],
      },
      product_price: {
        type: Number,
        min: [0, "cannot be negative value"],
      },
    },
  ],
  total_sum: {
    type: Number,
    required: true,
    min: [0, "cannot be negative value"],
  },
  status: {
    type: String,
    required: true,
    enum: ["cancelled", "paid"],
  },
  payment_date: {
    type: Date,
    required: true,
  },
});
module.exports = mongoose.model("payment", paymentSchema);
