/* ===============================PRODUCT ENDPOINT========================================== */
var Product = require("../models/Product.js");
var path = require("path");
const Fuse  = require("fuse.js");

exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product();
    //creating two variables to read the article info from the body params.
    const productName = req.body.name;
    const productPrice = Number(req.body.price);
    const productCategory = req.body.category;
    const productDiscount = Number(req.body.discount);
    const productColor = req.body.color;
    const productSize = req.body.size;
    const productDescription = req.body.description;
    const productImage = req.file ? path.basename(req.file.path) : null;

    const productQuantity = Number(req.body.quantity);
    // console.log("Product info: ");
    // console.log(productName);
    // console.log(productPrice);
    // console.log(productCategory);
    // console.log(productDiscount);
    // console.log(productColor);
    // console.log(productSize);
    // console.log(productDescription);
    // console.log(productImage);
    // console.log("xxxxxxxxxxxxxProduct infoxxxxxxxxxxxxxx");

    var productValidation = validateProduct(
      productName,
      productPrice,
      productDiscount,
      productCategory,
      productColor,
      productSize,
      productQuantity,
      productDescription,
      productImage
    );

    if (!productValidation.success) {
      //console.log("validation:" + productValidation.message);
        res.status(400).json({ message: productValidation.message });
        
      return;
    }

    newProduct.name = productName;
    newProduct.category = productCategory;
    newProduct.price = productPrice;
    newProduct.discount = productDiscount;
    newProduct.size = productSize;
    newProduct.color = productColor;
    newProduct.quantity = productQuantity;
    newProduct.description = productDescription;
    newProduct.image = productImage;

    // here we are telling it to wait for the data to actually be stored before returning any responses to the user. the Async keyword is needed if we want to use the await.
    await newProduct.save(); // This is THE function that stores the variables into the collection on the DB

    res.status(200).json(newProduct);
  } catch (error) {
    //console.log(error);
    res
      .status(400)
      .json({
        message:
          "Failed to create product please try again or contact support.",
      });
    return;
  }
};

exports.deleteSpecificProduct = async (req, res) => {
  try {
    const productID = req.params.productID;

    if (!productID) {
      res.status(400).send("Product does not exist.");
      return;
    }

    const deletedProduct = await Product.findByIdAndDelete(productID);

    if (!deletedProduct) {
      res.status(400).send("Product is not deleted. Please try again.");
      return;
    }
    res.status(200).json(deletedProduct);
  } catch (error) {
    res
      .status(400)
      .json({
        Message:
          "Failed to delete product please try again or contact support.",
      });
    return;
  }
};

exports.deleteAllProducts = async (req, res) => {
  try {
    const deletedProduct = await Product.deleteMany({});

    if (!deletedProduct) {
      res.status(400).send("Products could not be deleted. Please try again.");
      return;
    }
    res.status(200).json(deletedProduct); 
  } catch (error) {
    //console.error("Error deleting all buyers: ", error);
    res
      .status(400)
      .json({
        message:
          "Failed to delete products please try again or contact support.",
      });
    return;
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (!products) {
      res.status(404).send("Product was not found");
      return;
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: "Products not found!" + error });
    return;
  }
};

exports.filteredProducts = async (req, res) => {
  const category = req.params.category;
  var price = parseInt(req.params.price);
  var name = parseInt(req.params.name);
    
  try {
    const products = await Product.find({
      category: category,
    }).sort({
      price: price,
      name: name,
    });
      //console.log(products);
      res.status(200).json(products)
  } catch (error) {
    //console.log(error.message);
    res.status(400).json({ message: "Could not filter product. Please try again!" });
  }
};

exports.searchProducts = async (req, res) => {
    var searchString = req.params.searchString;
    var searchedProducts = await Product.find();
    var products = []
    
    try {
        const options = {
            includeScore: true,
            keys: ['name', 'category'],
            minMatchCharLength: 3,
            shouldSort: true,
            isCaseSensitive: false,
            threshold: 0.2
        }
        const newFuse = new Fuse(searchedProducts, options);
        searchedProducts = newFuse.search(searchString);

        /* We get an array back from the Fuse search. I needed to loop through that array
         to extract the products agin */
        for (let i = 0; i < searchedProducts.length; i++) {
            products[i] = searchedProducts[i].item;
        }
        
        res.status(200).json(products)
    } catch (error) {
        //console.log(error.message)
        res.status(400).json({message: "No results!"})
    }
}

exports.getDiscountedProducts = async (req, res) => {
  try {

    const product = await Product.find({"discount": {$gt: 0}});
    if (!product) {
      res.status(404).json({ Message: "No products found!" });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ Message: "No products found!" });
    return;
  }    
}

exports.getSpecificProduct = async (req, res) => {
  try {
    const productID = req.params.productID;
    //console.log(productID);
    if (!productID) {
      res.status(404).json({ message: "product does not exist!" });
      return;
    }
    const product = await Product.findById(productID);
    if (!product) {
      res.status(404).json({ message: "product does not exist!" });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: "Product not found!" });
    return;
  }
};

function validateProduct(
  name,
  price,
  discount,
  category,
  color,
  size,
  quantity,
  description,
  image
) {
  if (
    !name ||
    !price ||
    !category ||
    !color ||
    !size ||
    !quantity ||
    !description
  ) {
    return { success: false, message: "Missing product information." };
  } else if (typeof discount != "number" ||typeof price != "number" ||typeof quantity != "number") {
    return {
      success: false,
      message: "Quantity, price and discount must be a number value.",
    };
  } else if (price < 0 || discount < 0 || quantity < 0) {
    return { success: false, message: "Cannot enter a negative value" };
  } else if (quantity === 0) {
      return { success: false, message: "Quantity must be bigger than zero" };
  }else if (name.length > 100) {
    return { success: false, message: "Product name is too long." };
  } else if (description.length > 700) {
    return { success: false, message: "Product description is too long." };
  } else if (discount > 100) {
    return { success: false, message: "Max discount is 100%" };
  } else {
    return { success: true, message: "Success" };
  }
}

function patchProductValidator(
  name,
  price,
  discount,
  quantity,
  description,
) {
 if (
    typeof discount != "number" ||
    typeof price != "number" ||
    typeof quantity != "number"
  ) {
    return {
      success: false,
      message: "Quantity, price and discount must be a number value.",
    };
  } else if (price < 0 || discount < 0 || quantity < 0) {
    return { success: false, message: "Cannot enter a negative value" };
  } else if (quantity === 0) {
    return { success: false, message: "Quantity must be bigger than zero" };
  } else if (name.length > 100) {
    return { success: false, message: "Product name is too long." };
  } else if (description.length > 700) {
    return { success: false, message: "Product description is too long." };
  } else if (discount > 100) {
    return { success: false, message: "Max discount is 100%" };
  } else {
    return { success: true, message: "Success" };
  }
}


exports.updateSpecificProduct = async (req, res) => {
  try {
    const productId = req.params.productID;
    if (!productId) {
      res.status(404).json({ message: "product does not exist!" });
      return;
    }
// console.log(req.body);
    const existingProductInfo =  await Product.findById(productId)
    var name = req.body.name;
    var price = Number(req.body.price);
    var discount = Number(req.body.discount);
    var category = req.body.category;
    var color = req.body.color;
    var size = req.body.size;
    var quantity = Number(req.body.quantity);
    var description = req.body.description;
    var image = req.file ? path.basename(req.file.path) : existingProductInfo.image;//keeping the old image no new one is selected

    var productValidation = validateProduct(
      name,
      price,
      discount,
      category,
      color,
      size,
      quantity,
      description,
      image
    );
    if (!productValidation.success) {
      //console.log("validation:" + productValidation.message);
      res.status(400).json({ message: productValidation.message });

      return;
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name: name,
        price: price,
        discount: discount,
        category: category,
        color: color,
        size: size,
        quantity: quantity,
        description: description,
        image: image,
      },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: "Product not found!" });
    return;
  }
};


exports.patchSpecificProduct = async (req, res) => {
  try {
    const productId = req.params.productID;
    if (!productId) {
      res.status(404).json({ message: "product does not exist!" });
      return;
    }
    // console.log(req.body);
    const existingProductInfo = await Product.findById(productId);
    //console.log(existingProductInfo);
    var name = req.body.name ? req.body.name : existingProductInfo.name;

    var price = Number(req.body.price) ? Number(req.body.price) : existingProductInfo.price;

    var discount = Number(req.body.discount) ? Number(req.body.discount): existingProductInfo.discount;

    var category = req.body.category ? req.body.category: existingProductInfo.category;

    var color = req.body.color ? req.body.color : existingProductInfo.color;

    var size = req.body.size ? req.body.size : existingProductInfo.size;

    var quantity = Number(req.body.quantity) ? Number(req.body.quantity): existingProductInfo.quantity;

    var description = req.body.description ? req.body.description: existingProductInfo.description;

    var image = req.file ? path.basename(req.file.path): existingProductInfo.image; //keeping the old image if no new one is selected

    var productValidation =  patchProductValidator(
    name,
    price,
    discount,
    quantity,
    description,
  );
    if (!productValidation.success) {
      //console.log("validation:" + productValidation.message);
      res.status(400).json({ existingProductInfo});

      return;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name: name,
        price: price,
        discount: discount,
        category: category,
        color: color,
        size: size,
        quantity: quantity,
        description: description,
        image: image,
      },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: "Product not found!" });
    return;
  }
};
// exports.patchSpecificProduct = async (req, res) => {
//   try {
//     const productId = req.params.productID;
//     if (!productId) {
//       res.status(400).send("Product was not found.");
//       return;
//     }

//     var name = req.body.name;
//     var price = req.body.price;
//     var discount = req.body.discount;
//     var category = req.body.category;
//     var color = req.body.color;
//     var size = req.body.size;
//     var quantity = req.body.quantity;
//     var description = req.body.description;
//     var image = req.body.image;

//     validateProduct(
//       name,
//       price,
//       discount,
//       category,
//       color,
//       size,
//       quantity,
//       description,
//       image
//     );

//     const patchedProduct = await Product.findByIdAndUpdate(productId, {
//       name: name,
//       price: price,
//       discount: discount,
//       category: category,
//       color: color,
//       size: size,
//       quantity: quantity,
//       description: description,
//       image: image,
//     });

//     res.status(200).json(patchedProduct);
//   } catch (error) {
//     res.status(400).json({ message: "Product not found!" });
//   }
// };
