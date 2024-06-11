const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');

// Define routes

outer.get('/', listingController.getListings);
router.post('/create', listingController.createListing);
router.put('/editStatus', listingController.updateListingStatus);
router.post('/getListing', listingController.getListing);
router.post('/search', listingController.search)
<<<<<<< HEAD
router.put('/getListingCheckout', listingController.getListingCheckout);
router.put('/checkoutListing', listingController.checkoutListing);
=======
>>>>>>> dd1e8b10e5e98207414b9148dafa3d705c74a213

module.exports = router;