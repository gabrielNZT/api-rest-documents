const { Router } = require('express');
const recordController = require('../controllers/record.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Records
 *   description: Record management
 */

/**
 * @swagger
 * /records/search:
 *   get:
 *     summary: Searches for records by a keyword
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Unauthorized
 */
router.get('/search', authMiddleware, recordController.searchRecords);

module.exports = router;
