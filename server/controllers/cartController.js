/* ===============================CART ENDPOINT========================================== */
var Cart = require("../models/Cart.js");
var Product = require("../models/Product.js");


exports.createCart = async (req, res) => {
    //Create a cart (only used for postman)
    
    const newCart = new Cart();

    const buyer_id = req.body.buyer_id;
    const products = req.body.products;
    const total_sum = req.body.total_sum;

    newCart.buyer_id = buyer_id;
    newCart.products = [];
    newCart.total_sum = total_sum;

    await newCart.save();

    res.json(newCart);

}

exports.deleteCartById = async (req, res) => {  //delete a cart (only used for postman)
    const cart = req.params.cart;
    const deletedCart = await Cart.findByIdAndDelete(cart); 
    res.json(deletedCart);
}

exports.deleteAllCarts = async (req, res) => {
    try{
    const deletedCarts =await Cart.deleteMany({});
    res.status(200).json({deletedCarts});
    } catch (error){
        res.status(404).json({message : "No carts found."})
    }
}

exports.getAllCarts = async (req, res) => {
    try{
        const carts = await Cart.find();
        if(carts.length >0){
            res.status(200).json({carts});
        }else{
            res.status(404).json({message : "No carts found"})
        }
    }catch (error){
        res.status(404).json({message : "No carts found"})
    }
}
exports.getCartById = async (req, res) => {
    if (req.session.seller_id) {
        res.status(401).json({ message: "Logged is as seller. Please log in as buyer to see your cart. " })
        return;
    }
    const buyerId = req.session.buyer_id;
    try{
        if(!buyerId){
            return res.status(400).json({message : "User not logged in or email not in session."});
        }
        const cart = await Cart.findOne({buyer_id : buyerId })

        if(!cart){
            return res.status(404).json({message: "Cart not found"});
        }
        res.status(200).json({cart});
        
    } catch (error){
        res.status(404).json({message : "Cart not found."})
    }
}


exports.putProductInCart = async (req, res) => {  
    try{
        const buyerId = req.session.buyer_id;
        const sessionCart = await Cart.findOne({buyer_id : buyerId })
        const cartId = await req.params.cart_id;

        if(sessionCart._id != cartId){
            res.status(404).json({message : "You have been logged out. Please log in again to add product."})
        }else{

            const cart = await Cart.findById( cartId);
            
            const productId = req.params.product_id;
                try {
                    const product = await cart.products.find(products => products.product_id.equals(productId));
                    const productPrice = await Product.findById(productId).then(product => product.price);
                    const cartTotalsum = cart.total_sum;
                    const new_sum = cartTotalsum + productPrice;

                    if(product) {
                        const newQuantity =  product.product_quantity +1 ;   
                        const updatedQuantity = await Cart.findOneAndUpdate(
                            {_id: cartId, "products.product_id" : productId},
                            {$set:{"products.$.product_quantity": newQuantity}},
                            {new:true}
                            )    
                        updatedCart = await Cart.findById(cartId);
                        updatedCart.total_sum = new_sum;
                        await updatedCart.save();
                    
                    } else {
                        const myProduct = {
                            product_id : productId,
                            product_quantity : 1,
                            product_price : productPrice
                            } 
                        updatedCart = await Cart.findByIdAndUpdate(cartId,
                            {
                                $push: { products: myProduct,
                            },
                                total_sum : new_sum,
                            },
                            {new: true}   
                        );
                        await updatedCart.save();
                    }
                    res.status(200).json(updatedCart);
        
                } catch (error){
                    res.status(404).json({message : "Product not found."})
                }
        }
    } catch (error){
        res.status(404).json({message : "Cart is not found."});
    }
}

exports.removeProduct = async (req, res) => {
    try {
        const buyerId = req.session.buyer_id;
        const sessionCart = await Cart.findOne({buyer_id : buyerId })
        const cartId = await req.params.cart_id;

        if(sessionCart._id != cartId){
            res.status(404).json({message : "You have been logged out. Please log in again to remove a product."})
        }else{
            const productId = await req.params.product_id;
            const cart = await Cart.findById(cartId);
            const product = await cart.products.find(products => products.product_id.equals(productId));
            const productPrice = await Product.findById(productId).then(product => product.price);
            const new_sum = cart.total_sum - productPrice;
            var updatedCart = "";
            
            if (product){
                if (product.product_quantity >=2){
                    const newQuantity =  product.product_quantity -1 ;   
                    const updatedQuantity = await Cart.findOneAndUpdate(
                        {_id: cartId, "products.product_id" : productId},
                        {$set:{"products.$.product_quantity": newQuantity}},
                        {new:true}
                        )    
                    updatedCart = await Cart.findById(cartId);
                    updatedCart.total_sum = new_sum;
                    await updatedCart.save();
                    res.status(200).json(updatedCart);

                } else if (product.product_quantity <=1){
                    updatedCart = await Cart.findOneAndUpdate(
                        {_id: cartId, "products.product_id" : productId},  //could this be removed?
                        {$pull: {products : {product_id : productId}}},
                        {new:true}
                        )    
                    res.status(200).json(updatedCart);
                } 
            }else {
                res.status(404).json({message: "Product not found!"})
            }
        }
    } catch (error) {
        res.status(404).json({message: "Cart not found!"})
    }
}

exports.emptyCart = async (req, res) => {
    
    try {
        const buyerId = req.session.buyer_id;
        const sessionCart = await Cart.findOne({buyer_id : buyerId })
        const cartId = await req.params.cart_id;

        if(sessionCart._id != cartId){
            res.status(404).json({message : "You have been logged out. Please log in again to empty cart."})
        }else{
            const cart = await Cart.findById(cartId);
            if(!cart) {
                res.status(404).json({message: "Cart not found"});
            }
            if (cart.products.length > 0){
                const updatedCart = await Cart.findOneAndUpdate(
                    {_id: cartId},
                    {$set: {products : [], total_sum : 0 }},
                    {new:true}
                    )  
                res.status(200).json(updatedCart);  
                
            }else{
                res.status(200).json({message: "Cart is empty"});
            }
        }
    } catch (error) {
        res.status(404).json({message : "Cart not found"})
    }
}