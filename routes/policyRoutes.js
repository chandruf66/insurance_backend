const express = require('express');
const router = express.Router();
const policyController = require('../controllers/policyController');

router.get('/search/:username', policyController.searchByUsername);
// router.get('/aggregate', policyController.aggregateByUser);
router.get('/aggregate', policyController.aggregatePolicies);


module.exports = router;