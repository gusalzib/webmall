/* ===============================Orders ENDPOINTS========================================== */
const mongoose = require('mongoose');
//post/create an order instance in the database
const Order = require("../models/Order.js");
var Buyer = require("../models/Buyer.js");
var Store = require("../models/Store.js");
var Cart = require("../models/Cart.js");
var Payment = require('../models/Payment.js')
const Fuse = require("fuse.js");

var storeId = "670834dc9e86638810b79f10";
var order_counter = 1;
var tempOrderNumber = 'myStore353';

exports.createPaymentLog = async (req, res) => {

  var buyerId = req.session.buyer_id;


  var buyer = await Buyer.findById(buyerId);
    var cart = await Cart.findOne({ buyer_id: buyerId });
    //console.log(cart)
    try {
      const newPayment = new Payment();
      const paymentBuyerID = buyerId;
      const paymentProductsArray = cart.products;
      const paymentTotalSum = cart.total_sum;
      const paymentStatus = "paid";
    const paymentDate = new Date();
        
    //   console.log(paymentBuyerID);
    //   console.log(paymentProductsArray);
    //   console.log(paymentTotalSum);
    //   console.log(paymentStatus);
    //   console.log(paymentDate);

      newPayment.buyer_id = paymentBuyerID;
      newPayment.products = paymentProductsArray;
      newPayment.total_sum = paymentTotalSum;
      newPayment.status = paymentStatus;
      newPayment.payment_date = paymentDate;

try {
    await newPayment.save();
    
} catch (saveError) {
    //console.error("Error saving payment:", saveError);
    res.status(400).json({ message: "Error saving payment", error: saveError });
    return;
    }

      res
        .status(200)
        .json({
          message: "Payment information stored successfully",
          newPayment,
        });
    } catch (error) {
        res.status(400).send({ message: "Failed to store payment please try again or contact support." });

  }
}

exports.createOrder = async (req, res) => {
    var paymentID = req.params.paymentID;
    var buyerId = req.session.buyer_id; 


    var buyer = await Buyer.findById(buyerId);
    var cart = await Cart.findOne({buyer_id: buyerId});
    
    var cartId = cart._id;
   

    try {
        const newOrder = new Order();

        const orderBuyerID = buyerId;
        const orderStreet = buyer.street;
        const orderCity = buyer.city;
        const orderZipcode = buyer.zipcode;
        const orderNumber = tempOrderNumber;
        const total_sum = cart.total_sum;
        // const orderStatus = req.body.status;
        const orderStatus = 'pending';
        const orderStoreId = storeId;
        const orderDate = new Date();
        // const orderPaymentId = req.body.payment_id;
        const orderPaymentId = paymentID ? paymentID : 'ahusahdusuddad'; 

        // console.log("variables");        
        // console.log(orderBuyerID);
        // console.log(orderNumber);
        // console.log(total_sum);
        // console.log(orderStatus);
        // console.log(orderStoreId);
        // console.log(orderDate);
        // console.log(orderPaymentId);


        validateOrder(res, orderBuyerID, cartId, orderStoreId, orderDate, orderNumber, orderPaymentId, orderStatus);

        newOrder.buyer_id = orderBuyerID;
        newOrder.street = orderStreet;
        newOrder.city = orderCity;
        newOrder.zipcode = orderZipcode;
        newOrder.order_number = orderNumber;
        newOrder.total_sum = total_sum;
        newOrder.status = orderStatus;
        newOrder.store_id = orderStoreId;
        newOrder.order_date = orderDate;
        newOrder.payment_id = orderPaymentId;

        await newOrder.save();

         if (!(cart.products.length === 0)) {
            var productsArray = cart.products;
            var order = await Order.findByIdAndUpdate(newOrder._id,
            {
                $push: {
                    products: {
                        $each: productsArray
                    }
                }
                
            },
            {new: true}
        );
         } else {
             res.status(400).json({ message: "Cart is empty. Cannot place an empty order." })
             return;
        }
        res.status(200).json(newOrder);
    } catch (error) {
        // console.log(error)
        res.status(400).send({ message: "Failed to place an order please try again or contact support." });
    }

};

exports.searchOrders = async (req, res) => {
    var searchString = req.params.searchString;
    var searchedOrders = await Order.find();
    var orders = [];

    try {
      const options = {
        includeScore: true,
        keys: [
          "street",
          "city",
          "zipcode",
          "status",
          "payment_id",
        ],
        minMatchCharLength: 3,
        shouldSort: true,
        isCaseSensitive: false,
        threshold: 0.3,
      };
      const newFuse = new Fuse(searchedOrders, options);
      searchedOrders = newFuse.search(searchString);

      /* We get an array back from the Fuse search. I needed to loop through that array
         to extract the products agin */
      for (let i = 0; i < searchedOrders.length; i++) {
        orders[i] = searchedOrders[i].item;
      }

      res.status(200).json(orders);
    } catch (error) {
      //console.log(error.message);
      res.status(400).json({ message: "No results!" });
    }
}

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        //console.log(orders);// print the objects in the console to debug
        if (!orders) {
            res.status(404).json({ message: "Could not fetch orders" });
            return;
        }
        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({ "Error message": "Could not fetch orders", error });
    }
};

exports.getOrdersOfSpecificBuyer = async (req, res) => {
    try {
        const buyerId = req.session.buyer_id;
        // console.log('Session buyer id '+buyerId)
        const orders = await Order.find({ "buyer_id": buyerId });
        // console.log('Order list' +orders);
        if (orders.length === 0) {
            res.status(404).send({ message: "Order history is empty. Make you first order to see it here!" });
            return;
        }
        res.status(200).json(orders);
    } catch (error) {
        //console.error(error);
        res.status(400).json({ message: "Could not fetch orders", error });
    }
};

exports.getOrdersOfSpecificBuyerAdmin = async (req, res) => {
  try {
    const buyerId = req.params.buyer_id;
    // console.log('Session buyer id '+buyerId)
    const orders = await Order.find({ buyer_id: buyerId });
    // console.log('Order list' +orders);
    if (orders.length === 0) {
      res
        .status(404)
        .send({
          message:
            "Order history is empty. Make you first order to see it here!",
        });
      return;
    }
    res.status(200).json(orders);
  } catch (error) {
    //console.error(error);
    res.status(400).json({ message: "Could not fetch orders", error });
  }
};

exports.getSpecificOrder = async (req, res) => {
    try {
        const orderId = req.params.order_id;
        if (!orderId) {
            res.status(400).json({ message: "order id does not exist!" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            res.status(404).json({ message: "Order does not exist!" });
            return;
        }

        //console.log(order);// print the objects in the console to debug
        res.status(200).json(order);

    } catch (error) {
        res.status(400).json({ message: "Could not fetch orders" });
    }
};
 
exports.deleteAllOrders = async (req, res) => { 
    try {
        const order = await Order.deleteMany({});

        res.status(200).json(order);
        if (!order) {
            res.status(404).json({ message: "Order does not exist!" });
            return;
        }
    } catch (error) {
        res.status(400).json({ message: "Order not found!" });
    }
};


exports.deleteSpecificOrder = async (req, res) => {
    try {
        const orderId = req.params.order_id;
        if (!orderId) {
            res.status(400).json({ message: "Order was not found." });
            return;
        }
        const order = await Order.findByIdAndDelete(orderId);
        if (!order) {
            res.status(404).json({ message: "Order does not exist!" });
            return;
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ message: "Order not found!" });
    }
};


exports.updateSpecificOrder = async (req, res) => {
    /* The $push operator adds ONE element to the existing array
    The $each operator is used in case the body params contain more than one element that need to be added to the array  */
    try {
        const orderId = req.params.order_id;
        if (!orderId) {
            res.status(400).send("Order was not found.");
            return;
        }
        var cartId = req.body.cart_id;
        var cart = await Cart.findById(cartId);
        var productsArray = cart.products;

        var buyerId = req.body.buyer_id;
        var storeId = req.body.store_id;
        var paymentId = req.body.payment_id;
        var status = req.body.status;
        var date = new Date(req.body.order_date);
        var orderNumber = req.body.order_number;

        validateOrder(res, buyerId, cartId, storeId, date, orderNumber, paymentId, status);
        /* We check the validity of the buyer, cart and store IDs but we do not allow any updates. */
        const order = await Order.findByIdAndUpdate(orderId,
            {
                $push: {
                    products: { $each:  productsArray}
                },

                payment_id: paymentId,
                status: status,
                order_date: date,
                order_number: orderNumber
            },
            { new: true }
        );
        

        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ message: "Order not found! " + error.stack });
    }
};


exports.patchSpecificOrder = async (req, res) => {
    try {
        const orderId = req.params.order_id;
        if (!orderId) {
            res.status(400).send("Order was not found.");
            return;
        }
        var cartId = req.body.cart_id;
        var cart = await Cart.findById(cartId);
        var productsArray = cart.products;

        var buyerId = req.body.buyer_id;
        var storeId = req.body.store_id;
        var paymentId = req.body.payment_id;
        var status = req.body.status;
        var date = new Date(req.body.order_date);
        var orderNumber = req.body.order_number;

        validateOrder(res, buyerId, cartId, storeId, date, orderNumber, paymentId, status);
        /* We check the validity of the buyer, cart and store IDs but we do not allow any updates. */

        const order = await Order.findByIdAndUpdate(orderId,
            {
                $push: {
                    products: { $each:  productsArray}
                },

                payment_id: paymentId,
                status: status,
                order_date: date,
                order_number: orderNumber
            },
            { new: true }
        );
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ message: "Order not found!" });
    }
};

function validateOrder(res, buyer_id, cart_id, store_id, order_date, order_number, payment_id, status) {

    if (!buyer_id || !cart_id || !store_id || !order_date || !order_number || !payment_id || !status) {
            res.status(400).send("Missing order information.");
            return;
    }else if (!mongoose.Types.ObjectId.isValid(buyer_id)) {
            res.status(400).send("Buyer_id is invalid.")
            return;
    }else if (!mongoose.Types.ObjectId.isValid(cart_id)) {
            res.status(400).send("cart_id is invalid.")
            return;
    }else if (!mongoose.Types.ObjectId.isValid(store_id)) {
            res.status(400).send("store_id is invalid.")
            return;
    }else if ( !(order_date instanceof Date)) {
            res.status(400).send("Invalid date format.");
            return;
    }else if (!['pending', 'delivered', 'cancelled'].includes(status)) {
            res.status(400).send("Please enter a valid order status.");
            return;
    } 
}

exports.getOrdersStores = async (req, res) => {
    try {
        var orderId = req.params.order_id;
        var order = await Order.findById(orderId);

        var storeId = order.store_id;
        var store = await Store.findById(storeId);



        res.status(200).json()
    } catch (error) {
        res.status(400).json({message: "No stores found"})
    }
}