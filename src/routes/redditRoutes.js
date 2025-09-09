const express = require('express');
const router = express.Router();
const redditController = require('../controllers/redditController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/sync', authMiddleware, redditController.syncReddits);
router.get('/', authMiddleware, redditController.listReddits);
router.get('/:name', authMiddleware, redditController.getReddit);

module.exports = router;