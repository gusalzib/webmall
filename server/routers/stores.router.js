const express = require("express");
const upload = require('./uploads.js');
const router = express.Router();
const {createStore, getAllStores, getOneStore, updateStore, deleteStore, updateAFieldInStore} = require("../controllers/storesController.js");

router.post('/stores', upload.single('logo_img'), createStore);
router.get('/stores', getAllStores);
router.get('/stores/:store_id', getOneStore);
router.put('/stores/:store_id', updateStore);
router.delete('/stores/:store_id', deleteStore);
router.patch('/stores/:store_id', upload.single('image'), updateAFieldInStore);


module.exports = router;