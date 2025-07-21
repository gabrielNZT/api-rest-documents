const { Router } = require('express')
const userController = require('../controllers/me.controller')
const authMiddleware = require('../middlewares/auth.middleware')

const router = Router()

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Returns the authenticated user's information
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, userController.getMe)

module.exports = router
