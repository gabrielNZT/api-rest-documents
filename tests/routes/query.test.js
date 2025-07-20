
import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import queryService from '/home/gabriel/work/api-rest-documents/src/services/query.service';

vi.mock('/home/gabriel/work/api-rest-documents/src/services/query.service');


const middlewareFn = (req, res, next) => {
  req.user = { id: 1 };
  next();
};

const app = express();
app.use(express.json());

app.post('/queries', middlewareFn, async (req, res) => {
  const query = await queryService.createQuery({
    pergunta: req.body.pergunta,
    datasetId: req.body.datasetId,
    userId: req.user.id
  });
  res.status(201).json(query);
});

app.get('/queries', middlewareFn, async (req, res) => {
  const queries = await queryService.findQueriesByUserId(req.user.id);
  res.status(200).json(queries);
});

describe('Query Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a new query', async () => {
    const query = { id: 1, userId: 1, question: 'test question', answer: 'test answer' };
    queryService.createQuery.mockResolvedValue(query);

    const res = await request(app)
      .post('/queries')
      .send({ pergunta: 'test question', datasetId: 1 });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(query);
  });

  it('should list all queries for the authenticated user', async () => {
    const queries = [{ id: 1, question: 'test question', answer: 'test answer' }];
    queryService.findQueriesByUserId.mockResolvedValue(queries);

    const res = await request(app).get('/queries');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(queries);
  });
});
