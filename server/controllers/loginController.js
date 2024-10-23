const Buyer = require("../models/Buyer.js");
const Seller = require("../models/Seller.js");
const emailValidator = require('validator');
const session = require('express-session');
const cookie = require('express-cookie');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const confetti = require('canvas-confetti');
const cookieSession = require("cookie-session");


exports.validateUser = async (req, res) => {
    
    try {
        var seller = new Seller();
        const { email, password } = req.body;

        const buyer = await Buyer.findOne({ email });
        if (!buyer) {
            seller = await Seller.findOne({ email });
            if (!seller) {
                return res.status(404).json("User not found!");

            } else {
                if (password !== seller.password) {
                    return res.status(401).json("Incorrect password!");
                } else {
                    req.session.isSeller = true;
                    req.session.isAuthenticated = true;
                    req.session.seller_id = seller._id;
                    // console.log("Seller Session variables");
                    // console.log(req.session.isAuthenticated);
                    // console.log(req.session.seller_id);

                    const tempPostmanIsAuth = req.session.isAuthenticated;
                    const tempPostmanSellerId = req.session.seller_id;

                    res.status(200).json({
                      message: "Seller login successfull!",
                      sessionSellerID: tempPostmanSellerId,
                      session_isAuth: tempPostmanIsAuth,
                    });
                    return;
                }
            }
        }
        if(password !== buyer.password){
            
            return res.status(401).json("Incorrect password!");
           }

        if (buyer.fname === 'admin' && buyer.password === 'admin' && buyer.email === 'admin@gmail.com') {
            req.session.isAdmin = true;
        } else {
            req.session.isAdmin = false;
        }
        req.session.isAuthenticated = true;
        req.session.buyer_id = buyer._id;

        // console.log('Session variables')
        // console.log(req.session.isAuthenticated);
        // console.log(req.session.isAdmin);
        // console.log(req.session.buyer_id);

        req.session.save(err => {
            if(err) {
                // console.error ("Error saving session:", err);
                return res.status(400).json("Failed to save session.");
            }
        })
        const tempPostmanIsAuth = req.session.isAuthenticated;
        const tempPostmanIsAdmin = req.session.isAdmin;
        const tempPostmanBuyerId = req.session.buyer_id;
        
        res.status(200).json({
          message: "Login successfull!",
          sessionBuyerID: tempPostmanBuyerId,
          session_isAuth: tempPostmanIsAuth,
          session_isAdmin: tempPostmanIsAdmin,
        });

    } catch (error) {
        res.status(400).json({ message: "Could not find an accout associated with this user." });
        return;
    }

}