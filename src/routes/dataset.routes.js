const { Router } = require('express');
const datasetController = require('../controllers/dataset.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Datasets
 *   description: Dataset management
 */

/**
 * @swagger
 * /datasets/upload:
 *   post:
 *     summary: Uploads a new dataset
 *     tags: [Datasets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Dataset uploaded successfully
 *       400:
 *         description: Bad request
 */
router.post('/upload', authMiddleware, upload.single('file'), datasetController.uploadDataset);

/**
 * @swagger
 * /datasets:
 *   get:
 *     summary: Lists all datasets for the authenticated user
 *     tags: [Datasets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, datasetController.listDatasets);

/**
 * @swagger
 * /datasets/{id}/records:
 *   get:
 *     summary: Lists all records for a specific dataset
 *     tags: [Datasets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Dataset not found
 */
router.get('/:id/records', authMiddleware, datasetController.listRecordsByDataset);

module.exports = router;
