const datasetService = require('../services/dataset.service');

const uploadDataset = async (req, res) => {
  try {
    const dataset = await datasetService.createDataset(req.file, req.user.id);
    res.status(201).json(dataset);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const listDatasets = async (req, res) => {
  try {
    const datasets = await datasetService.findDatasetsByUserId(req.user.id);
    res.status(200).json(datasets);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const listRecordsByDataset = async (req, res) => {
  try {
    const records = await datasetService.findRecordsByDatasetId(parseInt(req.params.id), req.user.id);
    res.status(200).json(records);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  uploadDataset,
  listDatasets,
  listRecordsByDataset,
};
