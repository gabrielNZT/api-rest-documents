const recordService = require('../services/record.service');

const searchRecords = async (req, res) => {
  try {
    const records = await recordService.searchRecordsByKeyword(req.user.id, req.query.query);
    res.status(200).json(records);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  searchRecords,
};
