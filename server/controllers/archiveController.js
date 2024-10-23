/* ===============================ARCHIVE ENDPOINT========================================== */
var Archive = require("../models/Archive.js")
var Order = require("../models/Order.js");


exports.createArchive = async (req, res) => {
    try {
        const orderId = req.body.order_id;
        const order = await Order.findById(orderId);
        try{
            const newArchive = new Archive();
            newArchive.products = { $push: 
                { products:{$each : order.products }
                },}, {new: true};
            newArchive.order_id = order._id;
            newArchive.payment_id = order.payment_id;
            newArchive.buyer_id = order.buyer_id;
            newArchive.order_date = order.order_date;
            await newArchive.save();
            res.status(200).json(newArchive);
        } catch (error){
            res.status(404).json({message: "Archive not created"});
        }
    } catch (error){
        res.status(404).json({ message: "Order not found" });
    }
}

exports.getAllArchives = async (req, res) => {
    try {   
        const archives = await Archive.find();
        if(!archives.length == 0){
            res.status(200).json(archives);
        }else{
            res.status(200).json({message : "There is no archive "});
        }
    }catch (error){
        res.status(404).json({message : "No archives found."})
    }
}
exports.getBuyersArchive = async (req, res) => {
    try{
        const buyerId = req.body.buyer_id;
        const buyersArchive = await Archive.find({buyer_id : buyerId});
        
        if (!buyersArchive){
            res.status(200).json({message : "Buyer nr: "+buyerId+" has no archive"})
        }else{
            res.status(200).json(buyersArchive);
        }
    }catch(error){
        res.status(404).json({message : "No buyer found."})
    }
}

exports.getArchiveSpecificOrder = async (req, res) => {

    try{
        const buyerId = req.params.buyer_id;
        const orderId = req.params.order_id;
        const specificOrder = await Archive.findOne({order_id : orderId,buyer_id : buyerId});

        if (!specificOrder){
            res.status(200).json({message : "Buyer nr: "+buyerId+" has no archive"})
        }else{
            res.status(200).json(specificOrder);
        }
    }catch(error){
        res.status(404).json({message : "No buyer found."})
    }

}