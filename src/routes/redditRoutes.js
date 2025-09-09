const express = require('express');
const router = express.Router();
const redditController = require('../controllers/redditController');
const authMiddleware = require('../middlewares/authMiddleware');


/**
 * @swagger
 * /api/reddits/sync:
 *   post:
 *     summary: Sincroniza subreddits desde Reddit
 *     tags: [Reddits]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Sincronizado }
 */
router.post('/sync', authMiddleware, redditController.syncReddits);
/**
 * @swagger
 * /api/reddits:
 *   get:
 *     summary: Lista paginada de subreddits
 *     tags: [Reddits]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Resultado paginado
 */
router.get('/', authMiddleware, redditController.listReddits);
/**
 * @swagger
 * /api/reddits/{name}:
 *   get:
 *     summary: Detalle de un subreddit
 *     tags: [Reddits]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Detalle
 *       404:
 *         description: No encontrado
 */
router.get('/:name', authMiddleware, redditController.getReddit);

module.exports = router;