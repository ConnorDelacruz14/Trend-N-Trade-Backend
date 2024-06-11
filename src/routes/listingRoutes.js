const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');

// Define routes
router.get('/', listingController.getListings);
router.post('/create', listingController.createListing);
router.put('/editStatus', listingController.updateListingStatus);
router.post('/getListing', listingController.getListing);
router.post('/search', listingController.search)

module.exports = router;