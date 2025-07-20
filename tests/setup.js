import { vi } from 'vitest';

const mockPrismaClient = {
  user: {
    create: vi.fn(),
    findUnique: vi.fn(),
  },
  dataset: {
    create: vi.fn(),
    findMany: vi.fn(),
  },
  record: {
    create: vi.fn(),
    findMany: vi.fn(),
  },
  query: {
    create: vi.fn(),
    findMany: vi.fn(),
  },
};

vi.mock('/home/gabriel/work/api-rest-documents/src/lib/prisma.js', () => ({
  __esModule: true,
  default: mockPrismaClient,
}));
