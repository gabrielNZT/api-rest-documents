const prisma = require('../lib/prisma');
const { generateAnswer } = require('./ia.service');

const mockIAResponse = (question) => {
  const lowerCaseQuestion = question.toLowerCase();

  if (lowerCaseQuestion.includes("contrato")) {
    return "Este documento trata de cláusulas contratuais.";
  }

  return "A IA identificou informações relevantes.";
};

const createQuery = async (userId, question, datasetId) => {
  let answer;

  if (datasetId != null) {
    datasetId = parseInt(datasetId, 10);
  }

  if (process.env.USE_IA === 'true') {
    const record = await prisma.record.findFirst({
      where: { datasetId },
    });

    if (!record || !record.jsonData || !record.jsonData.content) {
      throw new Error('Conteúdo do documento não encontrado para este dataset.');
    }

    const documentContext = typeof record.jsonData.content === 'string'
      ? record.jsonData.content
      : JSON.stringify(record.jsonData.content);

    answer = await generateAnswer(question, documentContext);

  } else {
    answer = mockIAResponse(question);
  }

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