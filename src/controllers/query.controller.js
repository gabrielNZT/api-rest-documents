const queryService = require('../services/query.service');

const createQuery = async (req, res) => {
  try {
    const query = await queryService.createQuery(req.user.id, req.body.pergunta, req.body.datasetId);
    res.status(201).json(query);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const listQueries = async (req, res) => {
  try {
    const queries = await queryService.findQueriesByUserId(req.user.id);
    res.status(200).json(queries);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createQuery,
  listQueries,
};
