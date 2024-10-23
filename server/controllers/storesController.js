/* ===============================STORES ENDPOINT========================================== */
const Store = require("../models/Store.js");
const Fuse = require("fuse.js");
const path = require('path')

const createStore = async (req, res) => {
    try {
        const newStore = new Store();

        const storeName = req.body.store_name;
        const storeLocation = req.body.location;
        const storeOrgNum = Number(req.body.org_number);
        const storeDescription = req.body.description;
        // const storeBannerImg = req.file ? path.basename(req.file.path) : null;
        const storeLogoImg = req.file ? path.basename(req.file.path) : null;
        const storeProducts = req.body.products;
        const storeSellers = req.body.sellers;


        var storeValidation = validateStore(storeName,
         storeLocation, storeOrgNum, storeDescription,
            storeLogoImg, storeProducts, storeSellers);

        if (!storeValidation.success) {
            res.status(400).json({message: storeValidation.message});
            return;
        }


        newStore.store_name = storeName;
        newStore.location = storeLocation;
        newStore.org_number = storeOrgNum;
        newStore.description = storeDescription;
        // newStore.banner_img = storeBannerImg;
        newStore.logo_img = storeLogoImg;
        newStore.products = storeProducts;
        newStore.sellers = storeSellers;

        await newStore.save();


        res.status(200).json(newStore);
    } catch (error) {
        res.status(400).json({message: "Failed to create a new Store"});
        return;
    }
};

function validateStore(store_name, location, org_number, description, logo_img, products, sellers) {

  if (org_number > 9999999999 || org_number < 1000000000) {
    return {
      success: false,
      message: "Organisation number should be 10 digits",
    };
  } else if (typeof store_name !== "string" || store_name.length > 100) {
    return {
      success: false,
      message: "Store name is too long.",
    };
  } else if (typeof description !== "string" || description.length > 1000) {
    return {
      success: false,
      message: "Product description is too long.",
    };
  } else {
    return {
      success: true,
      message: "Store created!",
    };
  }
}

const getAllStores = async (req, res) => {
    try {
        const stores = await Store.find();
        //console.log(stores); //for debugging
        res.status(200).json(stores);
    } catch (error) {
        //console.error("error creating stores", error);
        res.status(400).json({message: "An error occurred: we could not fetch stores"});
    }
};

const getOneStore = async (req, res) => {
    try {
        const store_Id = req.params.store_id; //getting id from url
        const store = await Store.findById(store_Id);
        res.status(200).json(store);
    } catch (error) {
        res.status(400).json({ message: "An error occurred" });
    }
}

const updateStore = async (req, res) => {
    try {
        const store_Id = req.params.store_id;
        // const store = await Store.findByIdAndUpdate(store_Id, req.body);
        // if(!store){
            if (!store_Id) {
                return res.status(404).json({message: "Store not found"});
            } else {
            const modifiedStore = await Store.findByIdAndUpdate(store_Id, {
                store_name: req.body.store_name,
                location: req.body.location,
                org_number: req.body.org_number,
                description: req.body.description,
                // banner_img: req.body.banner_img,
                logo_img: req.body.logo_img,
                products: req.body.products,
                sellers: req.body.sellers
                }
            );
            res.status(200).json(modifiedStore);
        }
    } catch (error) {
        res.status(400).json({ message: "An error occurred" });
    }
};

const deleteStore = async (req, res) => {
    try {
        const store_Id = req.params.store_id;
        const store = await Store.findByIdAndDelete(store_Id);

        if (!store) {
            return res.status(404).json({message: "Store not found"});
        }
        res.status(200).json({message: "Store successfully deleted!"})
    } catch (error) {
        res.status(400).json({ message: "An error occurred" });
    }
}

const updateAFieldInStore = async (req, res) => {
  try {
    const store_Id = req.params.store_id;

    const unUpdatedStore = await Store.findById(store_Id);

    var storeName = req.body.store_name ? req.body.store_name : unUpdatedStore.store_name;
    var storeOrgNum = req.body.org_number ? req.body.org_number : unUpdatedStore.org_number;
    var storeDescription = req.body.description ? req.body.description : unUpdatedStore.description;
    var storeProducts = req.body.products ? req.body.products : unUpdatedStore.products;
    var storeLocation = req.body.location ? req.body.location : unUpdatedStore.location;
    var storeProducts = req.body.products ? req.body.products : unUpdatedStore.products;
    var storeSellers = req.body.sellers ? req.body.sellers : unUpdatedStore.sellers;
    var storeLogo = req.body.logo_img ? req.body.logo_img : unUpdatedStore.logo_img;

    //console.log(unUpdatedStore);
    const validateUpdate = validatePatchedStore(storeName, storeOrgNum, storeDescription,
      storeLocation, storeProducts, storeSellers);
    if (!validateUpdate.success) {
      res.status(400).json({message: validateUpdate.message});
      return;
    }

    if (!store_Id) {
      return res.status(404).json({message: "Store not found"});
    } else {
      var patchedStore = await Store.findByIdAndUpdate(store_Id, {
          store_name: req.body.store_name,
          location: req.body.location,
          org_number: req.body.org_number,
          description: req.body.description,
          products: req.body.products,
          sellers: req.body.sellers,
        }
      );
      res.status(200).json(patchedStore);
    }
  } catch (error) {
    //console.log(error.message);
    res.status(400).json({message: "An error occurred"});
  }
};

function validatePatchedStore(storeName, storeOrgNum, storeDescription,
                              storeLocation, storeProducts, storeSellers) {
  if(storeOrgNum < 1000000000 || storeOrgNum > 9999999999) {
    return {
      success: false,
      message: "Organisation number should be 10 digits"
    };
  } else if (typeof storeName !=='string' || storeName.length > 100) {
    return {
      success: false, message: "Store name is too long."
    };
  } else if (typeof storeLocation !=='string' || storeLocation.length > 40) {
      return {
        success: false, message: "Store Location is too long." };
  } else if (typeof storeSellers !=='string' || storeSellers.length > 40) {
      return {
    success: false, message: "Store seller description is too long." };
  } else if (typeof storeProducts !=='string' || storeProducts.length > 40) {
    return {
      success: false, message: "Store product names are too long." };
  } else if (typeof storeDescription !=='string' || storeDescription.length > 1000) {
    return {
      success: false, message: "Product description is too long." };
  } else {
    return {
      success: true, message: "Store created!"};
  }
}


module.exports = {
    createStore,
    getAllStores,
    getOneStore,
    updateStore,
    deleteStore,
    updateAFieldInStore
};