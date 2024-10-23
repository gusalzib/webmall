var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// remove store_name from the ER diagram!
// payment_id so that the order can be linked to the payment

//ref references the schema of the objectId
var orderScehma = new Schema({
    buyer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buyer'
    }, 
    products: [{
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        product_quantity: {
            type: Number, 
            min: [0, 'cannot be negative value']
        },
        product_price: {
            type: Number,
            min: [0, 'cannot be negative value']
        }
    }], 
    street: {
        type: String,
        required: true
    }, 
    city: {
        type: String,
        required: true
    },
    zipcode: {
        type: String,
        required: true
    },
    order_number: {
        type: String,
        required: true
    },
    total_sum: {
        type: Number, required: true,
        min: [0, 'cannot be negative value']
    },
    status: {
        type: String, required: true,
        enum: ['pending', 'delivered', 'cancelled']
    },
    store_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Store'
    },
    order_date: {
        type: Date,
        required: true
    },
    payment_id: {
        type: String,
        required: true
    } 

})
    // the old schema


    /*
        $jsonSchema: {
        bsonType: ObjectId,
        required: ["buyer_id", "products", "shipping_address", "order_number", "total_sum",
                    "status", "store_id", "order_date", "payment_id"],
        properties: {
            buyer_id: {
                bsonType: ObjectId, 
            },
            products: {
                bsonType: "array",
                items: {
                    bsonType: "object",
                    required: [
                        "product_id",
                        "product_quantity",
                        "product_price"
                    ],
                    properties: {
                        product_id: {
                            bsonType: ObjectId, 
                        }, 
                        product_quantity: {
                            bsonType: Number, 
                            minimum: 1
                        },
                        product_price: {
                            bsonType: Number, 
                            minimum: 1
                        }                        
                    }

                }
            },
            shipping_address: {
                bsonType: String,
            },
            order_number: {
                bsonType: String, 
            },
            total_sum: {
                bsonType: Number, 
            },
            status: {
                enum: ["complete", "pending", "cancelled", "delivered"]
            },
            store_id: {
                bsonType: ObjectId, 
            },
            order_date: {
                bsonType: Date,
                default: Date.now
            },
            payment_id: {
                bsonType: String, 
            }

        }

    }

 */
module.exports = mongoose.model("orders", orderScehma);