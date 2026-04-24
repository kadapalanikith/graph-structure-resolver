const express = require('express');
const { processHierarchies } = require('../controllers/bfhlController');

const router = express.Router();

router.post('/', processHierarchies);

module.exports = router;
