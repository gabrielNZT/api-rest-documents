const prisma = require('../lib/prisma');

const searchRecordsByKeyword = (userId, query) => {
  return prisma.record.findMany({
    where: {
      dataset: {
        userId,
      },
      jsonData: {
        path: '$',
        string_contains: query,
      },
    },
  });
};

module.exports = {
  searchRecordsByKeyword,
};
