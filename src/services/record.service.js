const { Prisma } = require('@prisma/client');
const prisma = require('../lib/prisma');

const searchRecordsByKeyword = async (userId, query) => {
  const results = await prisma.$queryRaw(
    Prisma.sql`
      SELECT
        r.id,
        r.dataset_id,
        r.criado_em
      FROM
        "records" r
        JOIN "datasets" d ON r.dataset_id = d.id
      WHERE
        d.usuario_id = ${userId}
        AND unaccent(r.dados_json->>'content') ~* unaccent(${query});
    `
  );

  return results;
};

module.exports = {
  searchRecordsByKeyword,
};
