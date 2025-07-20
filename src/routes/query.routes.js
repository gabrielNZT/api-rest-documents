const { Router } = require('express');
const queryController = require('../controllers/query.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Queries
 *   description: Query management
 */

/**
 * @swagger
 * /queries:
 *   post:
 *     summary: Creates a new query
 *     tags: [Queries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pergunta
 *               - datasetId
 *             properties:
 *               pergunta:
 *                 type: string
 *               datasetId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Query created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authMiddleware, queryController.createQuery);

/**
 * @swagger
 * /queries:
 *   get:
 *     summary: Lists all queries for the authenticated user
 *     tags: [Queries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, queryController.listQueries);

module.exports = router;
