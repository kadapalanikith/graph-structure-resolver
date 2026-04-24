const express = require('express');
const router = express.Router();
const { processHierarchies } = require('../controllers/bfhlController');

router.post('/', processHierarchies);

module.exports = router;
