const prisma = require('../lib/prisma');
const fs = require('fs');

const createDataset = async (file, userId) => {
  const dataset = await prisma.dataset.create({
    data: {
      name: file.originalname,
      userId,
    },
  });

  const records = [];
  if (file.mimetype === 'application/pdf') {
    records.push({ jsonData: { content: fs.readFileSync(file.path, 'base64') } });
  } else if (file.mimetype === 'text/csv') {
    const csvData = fs.readFileSync(file.path, 'utf-8');
    const rows = csvData.split('\n').map(row => row.split(','));
    const headers = rows[0];
    for (let i = 1; i < rows.length; i++) {
      const values = rows[i];
      const record = {};
      for (let j = 0; j < headers.length; j++) {
        record[headers[j]] = values[j];
      }
      records.push({ jsonData: record });
    }
  }

  for (const record of records) {
    await prisma.record.create({
      data: {
        datasetId: dataset.id,
        jsonData: record.jsonData,
      },
    });
  }

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
