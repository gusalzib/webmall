const express = require("express");
const router = express.Router();
const {getAllSellers, getOneSeller, createSeller, updateSeller, deleteSeller} = require("../controllers/sellersController.js");

router.get('/sellers', getAllSellers);
router.get('/sellers/:seller_id', getOneSeller);
router.post('/sellers', createSeller);
router.put('/sellers/:seller_id', updateSeller);
router.delete('/sellers/:seller_id', deleteSeller);

module.exports = router;

