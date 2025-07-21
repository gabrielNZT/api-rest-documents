const prisma = require('../lib/prisma');
const fs = require('fs');
const { parseFileContent } = require('../utils/fileProcessor');

const createDataset = async (file, userId) => {
  const dataset = await prisma.dataset.create({
    data: {
      name: file.originalname,
      userId,
    },
  });

  const jsonData = await parseFileContent(file);

  await prisma.record.create({
    data: {
      datasetId: dataset.id,
      jsonData,
    },
  });

  fs.unlinkSync(file.path);

  return dataset;
};

const findDatasetsByUserId = (userId) => {
  return prisma.dataset.findMany({ where: { userId } });
};

const findRecordsByDatasetId = (datasetId, userId) => {
  return prisma.record.findMany({
    where: {
      datasetId,
      dataset: {
        userId,
      },
    },
  });
};

module.exports = {
  createDataset,
  findDatasetsByUserId,
  findRecordsByDatasetId,
};
