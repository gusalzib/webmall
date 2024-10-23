/* ===============================SELLERS ENDPOINT========================================== */
const Seller = require("../models/Seller.js");

const createSeller = async (req, res) => {
    try {
        const newSeller = new Seller();

        const sellerFname = req.body.fname;
        const sellerMinit = req.body.minit;
        const sellerLname = req.body.lname;
        const sellerPhoneNumber = req.body.phone_number;
        const sellerEmail = req.body.email;
        const sellerPassword = req.body.password;

        newSeller.fname = sellerFname;
        newSeller.minit = sellerMinit;
        newSeller.lname = sellerLname;
        newSeller.phone_number = sellerPhoneNumber;
        newSeller.email = sellerEmail;
        newSeller.password = sellerPassword;

        await newSeller.save();

        res.status(200).json(newSeller);
    } catch (error) {
        res.status(400).json({message: "Failed to create a new seller"})
    }
};

// const createSeller = async (req, res) => {
//     try {
//         const seller = await Seller.create(req.body); //whenever we use this "await" we use add "async" in the method param
//         res.status(200).json(seller);
//     } catch (error) {
//         res.status(400).json({message: "An error occurred"});
//     }
// }

const getAllSellers = async (req, res) => {
    try {
        const sellers = await Seller.find();
        //console.log(sellers); //for debugging
        res.status(200).json(sellers);
    } catch (error) {
        res.status(400).json({message: "An error occurred: we could not fetch sellers"});
    }
};

const getOneSeller = async (req, res) => {
    try {
        const seller_Id = req.params.seller_id; //getting id from url
        const seller = await Seller.findById(seller_Id);
        res.status(200).json(seller);
    } catch (error) {
        res.status(400).json({message: "An error occurred"});
    }
}

const updateSeller = async (req, res) => {
    try {
        const seller_Id = req.params.seller_id;
        // const seller = await Seller.findByIdAndUpdate(seller_Id, req.seller_id) //this is a specific method for finding
        // by ID and updating
        //req.body is for updating the body
        // if(!seller){
        if(!seller_Id) {
            return res.status(404).json({message: "Seller not found"}) // this is in case the seller does not exist
        } else {
            const modifiedSeller = await Seller.findByIdAndUpdate(seller_Id, {
                fname : req.body.fname,
                minit: req.body.minit,
                lname: req.body.lname,
                phone_number: req.body.phone_number,
                email: req.body.email,
                password: req.body.password,
            });
            res.status(200).json(modifiedSeller); // this here returns the updated seller in full
        }
    } catch (error) {
        res.status(400).json({message: "An error occurred"});
    }
};

const deleteSeller = async (req, res) => {
    try {
        const seller_Id = req.params.seller_id;
        const seller = await Seller.findByIdAndDelete(seller_Id);

        if (!seller) {
            return res.status(404).json({message: "Seller not found"});
        }
        res.status(200).json({message: "Seller successfully deleted!"})
    } catch (error) {
        res.status(400).json({message: "An error occurred"});
    }
}

module.exports = {
    getAllSellers,
    getOneSeller,
    createSeller,
    updateSeller,
    deleteSeller
};

// /* ===============================SELLERS ENDPOINT========================================== */
//
// const Seller = require("../models/Seller.js");
//
// const getSellers = async (req, res) => {
//     try {
//         const sellers = await Seller.find({});
//         res.status(200).json(sellers);
//     } catch (error) {
//         res.status(400).json({message: "An error occurred"});
//     }
// }
//
// const getOneSeller = async (req, res) => {
//     try {
//         const seller_Id = req.params; //getting id from url
//         const seller = await Seller.findById(seller_Id);
//         res.status(200).json(seller);
//     } catch (error) {
//         res.status(400).json({message: "An error occurred"});
//     }
// }
//
// const createSeller = async (req, res) => {
//     try {
//         const seller = await Seller.create(req.body); //whenever we use this "await" we use add "async" in the method param
//         res.status(200).json(seller);
//     } catch (error) {
//         res.status(400).json({message: "An error occurred"});
//     }
// }
//
// const updateSeller = async (req, res) => {
//     try {
//         const seller_Id = req.params;
//         const seller = await Seller.findByIdAndUpdate(seller_Id, req.body) //this is a specific method for finding
//         // by ID and updating
//         //req.body is for updating the body
//         if(!seller){
//             return res.status(404).json({message: "Seller not found"}) // this is in case the seller does not exist
//         } else {
//             const modifiedSeller = await Seller.findById(seller_Id);
//             res.status(200).json(modifiedSeller); // this here returns the updated seller in full
//         }
//     } catch (error) {
//         res.status(400).json({message: "An error occurred"});
//     }
// }
//
// const deleteSeller = async (req, res) => {
//     try {
//         const seller_Id = req.params;
//         const seller = await Seller.findByIdAndDelete(seller_Id);
//
//         if (!seller) {
//             return res.status(404).json({message: "Seller not found"});
//         }
//         res.status(200).json({message: "Seller successfully deleted!"})
//     } catch (error) {
//         res.status(400).json({message: "An error occurred"});
//     }
// }
//
// module.exports = {
//     getSellers,
//     getOneSeller,
//     createSeller,
//     updateSeller,
//     deleteSeller
// };