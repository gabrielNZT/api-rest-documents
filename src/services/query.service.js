const prisma = require('../lib/prisma');

const mockIAResponse = (question) => {
  const lowerCaseQuestion = question.toLowerCase();

  if (lowerCaseQuestion.includes("contrato")) {
    return "Este documento trata de cláusulas contratuais.";
  }

  if (lowerCaseQuestion.includes("importante")) {
    return "A IA identificou informações relevantes.";
  }

  return "Não foi possível identificar um padrão na pergunta.";
};

const createQuery = async (userId, question, datasetId) => {
  const answer = mockIAResponse(question);

  return prisma.query.create({
    data: {
      userId,
      question,
      answer,
    },
  });
};

const findQueriesByUserId = (userId) => {
  return prisma.query.findMany({ where: { userId } });
};

module.exports = {
  createQuery,
  findQueriesByUserId,
};
