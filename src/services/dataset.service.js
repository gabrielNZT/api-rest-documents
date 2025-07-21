const prisma = require('../lib/prisma');
const { parseFileContent } = require('../utils/fileProcessor');

const createDataset = async (file, userId) => {
  const jsonData = await parseFileContent(file);

  const newDataset = await prisma.$transaction(async (tx) => {
    
    const dataset = await tx.dataset.create({
      data: {
        name: file.originalname,
        userId,
      },
    });

    await tx.record.create({
      data: {
        datasetId: dataset.id,
        jsonData,
      },
    });

    return dataset;
  });

  return newDataset;
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
