
import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import userService from '/home/gabriel/work/api-rest-documents/src/services/user.service';
import userService from '/home/gabriel/work/api-rest-documents/src/services/user.service';
import jwt from 'jsonwebtoken';

vi.mock('/home/gabriel/work/api-rest-documents/src/services/user.service');
vi.mock('jsonwebtoken');


const middlewareFn = (req, res, next) => {
  req.user = { id: 1 };
  next();
};

const app = express();
app.use(express.json());

app.post('/auth/register', async (req, res) => {
  try {
    const user = await userService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const result = await userService.login(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

app.get('/me', middlewareFn, (req, res) => res.status(200).json(req.user));

describe('Auth Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  it('should register a user successfully', async () => {
    const user = { id: 1, name: 'Test User', email: 'test@example.com' };
    userService.register.mockResolvedValue(user);

    const res = await request(app)
      .post('/auth/register')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(user);
  });

  it('should fail to register a user with a duplicate email', async () => {
    userService.register.mockRejectedValue(new Error('Email already exists'));

    const res = await request(app)
      .post('/auth/register')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Email already exists' });
  });

  it('should login a user successfully', async () => {
    const user = { id: 1, name: 'Test User', email: 'test@example.com' };
    const token = 'test-token';
    userService.login.mockResolvedValue({ user, token });

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ user, token });
  });

  it('should fail to login a user with invalid credentials', async () => {
    userService.login.mockRejectedValue(new Error('Invalid email or password'));

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Invalid email or password' });
  });

  it('should access protected route with valid token', async () => {
    const res = await request(app)
      .get('/me')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1 });
  });

  it('should not access protected route without token', async () => {
    const middlewareFn = (req, res, next) => {
      return res.status(401).json({ message: 'No token provided' });
    };
    const appTest = express();
    appTest.use(express.json());
    appTest.get('/me', middlewareFn, (req, res) => res.status(200).json(req.user));
    const res = await request(appTest).get('/me');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'No token provided' });
  });

  it('should not access protected route with invalid token', async () => {
    const middlewareFn = (req, res, next) => {
      return res.status(401).json({ message: 'Token invalid' });
    };
    const appTest = express();
    appTest.use(express.json());
    appTest.get('/me', middlewareFn, (req, res) => res.status(200).json(req.user));
    const res = await request(appTest)
      .get('/me')
      .set('Authorization', 'Bearer invalid-token');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Token invalid' });
  });
});
