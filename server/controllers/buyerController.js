/* ===============================BUYER ENDPOINTS========================================== */
const Buyer = require("../models/Buyer.js");
var Cart = require("../models/Cart.js");
const emailValidator = require('validator');
const session = require('express-session');
const cookie = require('express-cookie');
const cookieParser = require('cookie-parser');
const encrypt = require('bcrypt');
const confetti = require('canvas-confetti');


exports.createbuyer = async (req, res) => {
    try {
        /* Before creating buyer we need to check whether the buyer already exists */
        const { email } = req.body;

        const buyer = await Buyer.findOne({ email });
        if (buyer) {
            res.status(400).json({ message: "Email already exists." });
            return;
        } else if(!emailValidator.isEmail(email)){
            res.status(400).json({ message: "invalid email" });
            return;
        }



        const newBuyer = new Buyer();

        const buyerFname = req.body.fname;
        const buyerMinit = req.body.minit;
        const buyerLname = req.body.lname;
        const buyerPhoneNumber = req.body.phone_number;
        const buyerEmail = req.body.email;
        const buyerStreet = req.body.street;
        const buyerZipcode = req.body.zipcode;
        const buyerCity = req.body.city;
        const buyerPassword = req.body.password;
        
        if (!buyerFname || !buyerMinit || !buyerLname || !buyerPhoneNumber || !buyerEmail || !buyerStreet
            || !buyerZipcode || !buyerCity || !buyerPassword) {
                res.status(422).send("Missing buyer information.");//422 Unprocessable content
                return;
        }    

        newBuyer.fname = buyerFname;
        newBuyer.minit = buyerMinit;
        newBuyer.lname = buyerLname;
        newBuyer.phone_number = buyerPhoneNumber;
        newBuyer.email = buyerEmail;
        newBuyer.street = buyerStreet;
        newBuyer.zipcode = buyerZipcode;
        newBuyer.city = buyerCity;
        newBuyer.password = buyerPassword;

        await newBuyer.save();
        //console.log(newBuyer._id)
        var buyerId = newBuyer._id;
        if (!buyerId) {
            res.status(400).json({ message: "failed" });
            return; 
        }
        
        const newCart = new Cart();

        const buyer_id = buyerId;
        const products = [];
        const total_sum = 0;

        if (!buyer_id || (total_sum != 0)) {
            res.status(400).json({ message: "Please fill in empty fields!" });
            return;
        }

        newCart.buyer_id = buyer_id;
        newCart.products = products;
        newCart.total_sum = total_sum;

        await newCart.save();    

        res.status(200).json({
            buyerID: buyerId,
            cartID: newCart._id
        });
        

    } catch (error) {

        if (error.name === 'ValidatorError') {
            //catches the invalid email error
            res.status(400).json({ message: "invalid email" });
            return;
        } 
        res.status(400).json({ message: "Buyer could not be registered" });
    }

};


/* The Cart object should created only when a buyer is registered. This is why, we created this method which is called whenever a 
buyer post request is made to create a buyer and at the same time create cart which contains in it the buyer id that it belongs to. */



// async function createBuyerCart(buyerId) {

//     try {
        
    
//         const newCart = new Cart();

//         const buyer_id = buyerId;
//         const products = [];
//         const total_sum = 0;

//         if (!buyer_id || (total_sum != 0)) {
//             res.status(400).json({ message: "Please fill in empty fields!" });
//         }

//         newCart.buyer_id = buyer_id;
//         newCart.products = products;
//         newCart.total_sum = total_sum;

//         await newCart.save();       
//     } catch (error) {
//         res.status(400).json({ message: "Failed to create cart. Try again!" });
//     }

// }

//find the cart by buyer id. fetch the cart id and then delete the cart by its id. 
async function deleteCartWithBuyer(buyerId) {

    const cart = await Cart.findOne({ "buyer_id": buyerId });
    if (!cart) {
        return { success: false, message: "Cart does not exist" };
    }
    const cart_id = cart._id;
    if (!cart_id) {
        return { success: false, message: "Cart does not exist" };
    }
    await Cart.findByIdAndDelete(cart_id);      
    return { success: true, message: "Cart deleted successfully" };

}


exports.deleteSpecificBuyer = async (req, res) => {
    try {

        const buyerId = req.params.buyer_id;
        if (!buyerId) {
            res.status(400).json({ message: "Buyer does not exist" });
            return;
        }

        const buyer = await Buyer.findByIdAndDelete(buyerId);
        if (!buyer) {
            res.status(400).json({ message: "Could not find buyer by ID. Please make sure buyer exists." });
            return;
        }

        const deleteCartResult = await deleteCartWithBuyer(buyerId);

        if (!deleteCartResult.success) {
            res.status(400).json({ message: deleteCartResult.message });
            return;
        }

        res.status(200).json(buyer);
    } catch (error) {
        res.status(400).json({ message: "Buyer not found!" });
        return;
    } 
};

exports.deleteAllBuyers = async (req, res) => {
    try {
        await Cart.deleteMany({});  
        const result = await Buyer.deleteMany({});
        res.status(200).json(result);
    } catch (error) {
        //console.error("Error deleting all buyers: ", error);  
        res.status(400).json({ message: "Could not delete buyers!" });
    }
};


exports.getAllBuyers = async (req, res) => {
    try {
        const buyers = await Buyer.find();
        //console.log(buyers);// print the objects in the console to debug
        res.status(200).json(buyers);
    } catch (error) {
        res.status(400).json({ message: "Could not fetch buyers", error });
    }
};


exports.getSpecificBuyer = async (req, res) => {
    try {
        const buyerId = req.params.buyer_id;
        if (!buyerId) {
            res.status(404).json({ message: "No buyer was found!" })
        }

        const buyer = await Buyer.findById(buyerId);
        //console.log(buyer);// print the objects in the console to debug
        res.status(200).json(buyer);

    } catch (error) {
        res.status(400).json({ message: "Something went wrong. Could not fetch buyers" });
    }
};


exports.getBuyerProfile = async (req, res) => {
    try {
        // const buyerId = req.params.buyer_id;
        const buyerId = req.session.buyer_id;
        //console.log(buyerId)
        if (!buyerId) {
            return res.status(404).json({ message: "Not Logged in. Please log in to see your profile!" });
        }

        const buyer = await Buyer.findById(buyerId);
        //console.log(buyer);// print the objects in the console to debug
        res.status(200).json(buyer);

    } catch (error) {
        res.status(400).json({ message: "Something went wrong. Could not fetch profile information." });
    }
};


exports.updateSpecificBuyer = async (req, res) => {
    try {
        const buyerId = req.session.buyer_id;
        if (!buyerId) {
            res.status(400).json({ message: "buyer id is required!" })
        }
        const buyer = await Buyer.findByIdAndUpdate(buyerId,
            {
                fname: req.body.fname,
                minit: req.body.minit,
                lname: req.body.lname,
                phone_number: req.body.phone_number,
                email: req.body.email,
                street: req.body.street,
                zipcode: req.body.zipcode,
                city: req.body.city,
                password: req.body.password
            }
        );
        res.status(200).json(buyer);
    } catch (error) {
        res.status(400).json({ message: "Buyer not found!" });
    }
};

exports.updateSpecificBuyerByAdmin = async (req, res) => {
  try {
    const buyerId = req.params.buyer_id;
    if (!buyerId) {
      res.status(400).json({ message: "buyer id is required!" });
    }
    const buyer = await Buyer.findByIdAndUpdate(buyerId, {
      fname: req.body.fname,
      minit: req.body.minit,
      lname: req.body.lname,
      phone_number: req.body.phone_number,
      email: req.body.email,
      street: req.body.street,
      zipcode: req.body.zipcode,
      city: req.body.city,
      password: req.body.password,
    });
    res.status(200).json(buyer);
  } catch (error) {
    res.status(400).json({ message: "Buyer not found!" });
  }
};

exports.patchSpecificBuyer = async (req, res) => {
    try {
        const buyerId = req.session.buyer_id;
      if (!buyerId) {
          res.status(400).json({ message: "buyer id is required!" });
          return;
      }
      const buyer = await Buyer.findByIdAndUpdate(buyerId, {
        fname: req.body.fname,
        minit: req.body.minit,
        lname: req.body.lname,
        phone_number: req.body.phone_number,
        email: req.body.email,
        street: req.body.street,
        zipcode: req.body.zipcode,
        city: req.body.city,
        password: req.body.password,
      });
      res.status(200).json(buyer);
    } catch (error) {
      res.status(400).json({ message: "Buyer not found!" });
    }
};



