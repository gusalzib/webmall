var express = require("express");
var mongoose = require("mongoose");
var morgan = require("morgan");
var path = require("path");
var cors = require("cors");
var history = require("connect-history-api-fallback");
const session = require("express-session");
const cookie = require("express-cookie");
const cookieParser = require("cookie-parser");
const encrypt = require("bcrypt");
const confetti = require("canvas-confetti");
const cookieSession = require("cookie-session");
const connect_mongo = require("connect-mongo");
const upload = require("./uploads.js");
const fuse = require("fuse.js");
const MemoryStore = require("memorystore")(session);
/*0
npm install cookie-parser
npm install express-cookie
npm install express-session
npm install bcrypt
npm install canvas-confetti
npm install cookie-session
npm install connect-mongo //save the session in the db
npm install multer //image uploads
npm install --save axios
npm install fuse.js //used for the search functionality
npm install stripe --save
npm install dotenv
npm install cross-env --save-dev
npm install memorystore
*/

// require("dotenv").config();
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// Variables
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://gusalzib:mongoose1234554321@cluster0.axnq0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

var mongoURI = process.env.MONGODB_URI || uri;
var port = process.env.PORT || 3000;




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(mongoURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});






// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .catch(function (err) {
    console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
    console.error(err.stack);
    process.exit(1);
  })
  .then(function () {
    console.log(`Connected to MongoDB with URI: ${mongoURI}`); // mistake when forward porting
  });

// Create Express app
var app = express();
// Parse requests of content-type 'application/json'
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// HTTP request logger
app.use(morgan("dev"));

// PRODUCTION MODE SETTINGS ARE TEMPORARILY COMMENTED OUT.
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX PRODUCTION MODE BELOW XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
// Enable cross-origin resource sharing for frontend must be registered before api
// app.options(
//   "*",
//   cors({
//     origin: "http://localhost:4173",
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     credentials: true,
//   })
// );

// app.use(
//   cors({
//     origin: "http://localhost:4173",
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     credentials: true,
//   })
// );

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX DEVELOPMENT MODE BELOW XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
app.options(
  "*",
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Import routes
app.get("/api", function (req, res) {
  res.json({ message: "Welcome to your DIT342 backend ExpressJS project!" });
});

// Configuration for serving frontend in production mode
// Support Vuejs HTML 5 history mode
app.use(history());
// Serve static assets
var root = path.normalize(__dirname + "/..");
var clientPath = path.join(root, "client", "dist");
app.use(express.static(clientPath));

app.use(
  "/public/product_images",
  express.static(path.join(__dirname, "public/product_images"))
);
app.use(
  "/public/store_images",
  express.static(path.join(__dirname, "public/store_images"))
);

// Error handler (i.e., when exception is thrown) must be registered last
var env = app.get("env");
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  console.error(err.stack);
  var err_res = {
    message: err.message,
    error: {},
  };
  if (env === "development") {
    // Return sensitive stack trace only in dev mode
    err_res["error"] = err.stack;
  }
  res.status(err.status || 500);
  res.json(err_res);
});

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX DEVELOPMENT MODE BELOW XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "webmall",
    store: new MemoryStore({
      checkPeriod: 86400000,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 86400000,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    },
  })
);

// PRODUCTION MODE SETTINGS ARE TEMPORARILY COMMENTED OUT.
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX PRODUCTION MODE XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
// app.use(
//   session({
//     cookie: { maxAge: 86400000 },
//     store: new MemoryStore({
//       checkPeriod: 86400000, // prune expired entries every 24h
//     }),
//     resave: false,
//     secret: "dazzling pandas",
//     saveUninitialized: false,
//   })
// );





const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect("/");
  }
};
app.get("/api/login-check", (req, res) => {
  try {
    console.log("isAuthenticated " + req.session.isAuthenticated);
    if (req.session.isAuthenticated) {
      if (req.session.isAdmin) {
        res.status(200).json({
          loggedIn: true,
          isAdmin: true,
          session: req.session.isAuthenticated,
        });
      } else {
        if (req.session.isSeller) {
          res.status(200).json({
            loggedIn: true,
            isAdmin: false,
            isSeller: true,
            session: req.session.isAuthenticated,
          });
        } else {
          res.status(200).json({
            loggedIn: true,
            isAdmin: false,
            session: req.session.isAuthenticated,
          });
        }
      }
    } else {
      res.status(401).json({ loggedIn: false });
    }
  } catch (error) {
    res.status(400).json({
      loggedIn: false,
      message: "Something went wrong. Authentication failed.",
    });
  }
});

app.get("/api/logout", (req, res) => {
  if (req.session.isAuthenticated) {
    req.session.isAuthenticated = false;
    req.session.isAdmin = false;
    req.session.isSeller = false;
    req.session.destroy();
    // console.log("Destorying session :}", req.session);
    res.status(200).json({ loggedIn: false });
  } else {
    res.status(400).json({ message: "logout failed, please try again" });
  }
});

const { validateUser } = require("./controllers/loginController.js");
app.post("/api/login", validateUser);

app.use(cookieParser());
app.use(cookie());

// app.get("/sendCookie", function (req, res) {
//   console.log("setting cookie");
//   res.cookie("yummie_cookie", "choco");
//   res.send();
// });
// app.get("/receiveCookie", function (req, res) {
//   res.send("Cookie reseived: " + req.cookies.yummie_cookie);
// });
/*================================PAYMENT ENDPOINT===========================================*/
// app.post("/api/checkout", async (req, res) => {
//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         price_data: {
//           currency: "sek",
//           product_data: {
//             name: "product name",
//           },
//           unit_amount: 50 * 100,
//         },
//         quantity: 1,
//       },
//     ],
//     mode: "payment" /* this means one-time payment. One could also use subscription */,
//     success_url: "http://localhost:3000/paymentSuccess",
//     cancel_url: "http://localhost:3000/paymentFailure",
//   });
//   console.log(session);
// });

/* ===============================PRODUCT ENDPOINT========================================== */
/* The endpoints' logic is defined in controllers/productController.js. Here we import the variables in which endpoints are stored. Then
we pass these variables as prarmeters of the endpoints here. */
const {
  createProduct,
  deleteSpecificProduct,
  deleteAllProducts,
  getAllProducts,
  getSpecificProduct,
  updateSpecificProduct,
  patchSpecificProduct,
  filteredProducts,
  searchProducts,
  getDiscountedProducts,
} = require("./controllers/productController.js");
app.put(
  "/api/products/edit/product/:productID",
  upload.single("image"),
  updateSpecificProduct
);
app.patch(
  "/api/products/patch/single/product/:productID",
  upload.single("image"),
  patchSpecificProduct
);

app.get("/api/products", getAllProducts);
app.get("/api/products/filter/:category/:price/:name", filteredProducts);
app.post("/api/add/product", upload.single("image"), createProduct);
app.get("/api/single/product/:productID", getSpecificProduct);
app.get("/api/products/search/products/:searchString", searchProducts);
app.get("/api/products/sales", getDiscountedProducts);

app.delete("/api/products/delete/products", deleteAllProducts);
app.delete("/api/products/:productID", deleteSpecificProduct);
app.get("/api/products/:productID", getSpecificProduct);
// app.patch("/api/products/:productID", patchSpecificProduct);

/* ===============================Orders ENDPOINTS========================================== */
const {
  createOrder,
  deleteSpecificOrder,
  deleteAllOrders,
  getAllOrders,
  getSpecificOrder,
  updateSpecificOrder,
  patchSpecificOrder,
  getOrdersOfSpecificBuyer,
  getOrdersStores,
  searchOrders,
  createPaymentLog,
  getOrdersOfSpecificBuyerAdmin,
} = require("./controllers/orderController.js");

app.get("/api/orders/search/orders/:searchString", searchOrders);
app.post("/api/orders", createOrder);
app.post("/api/orders/:buyer_id/payment/:paymentID", createOrder);
app.get("/api/orders", getAllOrders); //this endpoint was not working. I disabled the Accept header and now it works.
app.get("/api/orders/order/details/:order_id", getSpecificOrder);
app.get("/api/buyers/orders", getOrdersOfSpecificBuyer);
app.delete("/api/orders/:order_id", deleteSpecificOrder);
app.delete("/api/orders", deleteAllOrders);
app.put("/api/orders/:order_id", updateSpecificOrder);
app.patch("/api/orders/:order_id", patchSpecificOrder);
app.get(
  "/api/buyers/:buyer_id/orders/admin/orderhistory",
  getOrdersOfSpecificBuyerAdmin
);
// app.get("/api/orders/:order_id/stores", getOrdersStores);
app.post("/api/orders/gateway/create/payment/confirmation", createPaymentLog);
/* ===============================BUYER ENDPOINTS========================================== */
const {
  createbuyer,
  deleteSpecificBuyer,
  deleteAllBuyers,
  getAllBuyers,
  getSpecificBuyer,
  updateSpecificBuyer,
  patchSpecificBuyer,
  getBuyerProfile,
  updateSpecificBuyerByAdmin,
} = require("./controllers/buyerController.js");

app.post("/api/signup", createbuyer);
// app.post("/api/buyers", createbuyer);
// app.post("/api/carts/:cart_id/buyers", createbuyer);
app.delete("/api/buyers", deleteAllBuyers);
app.get("/api/buyers", getAllBuyers);
app.get("/api/buyers/:buyer_id", getSpecificBuyer);
app.get("/api/profile", getBuyerProfile);

app.put("/api/buyers/edit/profile", updateSpecificBuyer);
app.patch("/api/buyers/patch/profile", patchSpecificBuyer);
app.delete("/api/buyers/:buyer_id", deleteSpecificBuyer);
app.put("/api/buyers/admin/update/buyer/:buyer_id", updateSpecificBuyerByAdmin);
/* ===============================CART ENDPOINT========================================== */
const {
  createCart,
  deleteCartById,
  deleteAllCarts,
  getAllCarts,
  putProductInCart,
  getCartById,
  removeProduct,
  emptyCart,
} = require("./controllers/cartController.js");

app.get("/api/carts/get/cart", getCartById);
app.put("/api/carts/empty/cart/:cart_id", emptyCart);
app.put("/api/carts/:cart_id/:product_id", putProductInCart);

app.put("/api/carts/remove/product/:cart_id/:product_id", removeProduct);

app.post("/api/carts", createCart);
// app.delete("/api/carts/:cart", deleteCartById);
app.delete("/api/carts", deleteAllCarts);
app.get("/api/carts", getAllCarts);

/* ===============================ARCHIVE ENDPOINT========================================== */
const {
  createArchive,
  getAllArchives,
  getBuyersArchive,
  getArchiveSpecificOrder,
} = require("./controllers/archiveController.js");

app.get(
  "/api/archive/specific/order/:buyer_id/:order_id",
  getArchiveSpecificOrder
);
app.get("/api/archive/buyers/archive/:buyer_id", getBuyersArchive);
app.get("/api/archive", getAllArchives);
app.post("/api/archive", createArchive);

app.listen(port, function (err) {
  if (err) throw err;
  console.log(`Express server listening on port ${port}, in ${env} mode`);
  console.log(`Backend: http://localhost:${port}/api/`);
  console.log(`Frontend (production): http://localhost:${port}/`);
});

/* ===============================SELLER ENDPOINT========================================== */

const sellersRouter = require("./routers/sellers.router");

app.use("/api", sellersRouter);

/* ===============================STORE ENDPOINT========================================== */

const storesRouter = require("./routers/stores.router");

app.use("/api", storesRouter);

// Catch all non-error handler for api (i.e., 404 Not Found)
app.use("/api/*", function (req, res) {
  res.status(404).json({ message: "Not Found" });
});
