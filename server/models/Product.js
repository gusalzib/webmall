var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productSchema = new Schema({
    category: {
        type: String,
        required: [true, 'must specifiy a category']
    }, 
    description: { type: String,
        required: [true, 'must write a description']
     }, 
    discount: { type: Number,
        min: [0, 'cannot be negative value']
    }, 
    image: { type: String,
        // required: [true, 'must upload an image']
     },
    size: { type: String,
        required: [true, 'must specifiy size/s']
     },
    quantity: { type: Number,
        required: [true, 'must specifiy a quantity'],
        min: [0, 'cannot be negative value']
     },
    color: { type: String,
        required: [true, 'must specifiy a color/s']
     },
    price: { type: Number,
        required: [true, 'must specifiy a price'],
        min: [0, 'cannot be negative value']
     },
    name: { type: String,
        required: [true, 'must write a name']
     },
})



module.exports = mongoose.model("products", productSchema);