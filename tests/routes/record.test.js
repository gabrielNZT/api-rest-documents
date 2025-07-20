import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import recordService from '/home/gabriel/work/api-rest-documents/src/services/record.service';

vi.mock('/home/gabriel/work/api-rest-documents/src/services/record.service');


const middlewareFn = (req, res, next) => {
  req.user = { id: 1 };
  next();
};

const app = express();
app.use(express.json());
app.get('/records/search', middlewareFn, async (req, res) => {
  const records = await recordService.searchRecordsByKeyword(req.query.query);
  res.status(200).json(records);
});

describe('Record Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should search for records by a keyword', async () => {
    const records = [{ id: 1, jsonData: { content: 'test' } }];
    recordService.searchRecordsByKeyword.mockResolvedValue(records);

    const res = await request(app).get('/records/search?query=test');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(records);
  });
});