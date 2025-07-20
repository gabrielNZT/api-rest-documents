import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import datasetService from '/home/gabriel/work/api-rest-documents/src/services/dataset.service';
import multer from 'multer';

vi.mock('/home/gabriel/work/api-rest-documents/src/services/dataset.service');


const middlewareFn = (req, res, next) => {
  req.user = { id: 1 };
  next();
};

const app = express();
app.use(express.json());
const upload = multer();

app.post('/datasets/upload', middlewareFn, upload.single('file'), async (req, res) => {
  const dataset = await datasetService.createDataset({
    name: req.file.originalname,
    userId: req.user.id
  });
  res.status(201).json(dataset);
});

app.get('/datasets', middlewareFn, async (req, res) => {
  const datasets = await datasetService.findDatasetsByUserId(req.user.id);
  res.status(200).json(datasets);
});

app.get('/datasets/:id/records', middlewareFn, async (req, res) => {
  const records = await datasetService.findRecordsByDatasetId(req.params.id);
  res.status(200).json(records);
});

describe('Dataset Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should upload a new dataset', async () => {
    const dataset = { id: 1, name: 'test.csv', userId: 1 };
    datasetService.createDataset.mockResolvedValue(dataset);

    const res = await request(app)
      .post('/datasets/upload')
      .attach('file', Buffer.from('a,b,c\n1,2,3'), 'test.csv');

    expect(res.status).toBe(201);
    expect(res.body).toEqual(dataset);
  });

  it('should list all datasets for the authenticated user', async () => {
    const datasets = [{ id: 1, name: 'test-dataset' }];
    datasetService.findDatasetsByUserId.mockResolvedValue(datasets);

    const res = await request(app).get('/datasets');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(datasets);
  });

  it('should list all records for a specific dataset', async () => {
    const records = [{ id: 1, jsonData: { content: 'record1' } }];
    datasetService.findRecordsByDatasetId.mockResolvedValue(records);

    const res = await request(app).get('/datasets/1/records');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(records);
  });
});