const { Prisma } = require('@prisma/client');
const prisma = require('../lib/prisma');

const searchRecordsByKeyword = async (userId, query) => {
  const results = await prisma.$queryRaw(
    Prisma.sql`
      WITH records_filtered AS (
        SELECT
          id,
          dados_json->>'content' AS content,
          dataset_id,
          criado_em
        FROM
          "records"
      )
      SELECT
        r.id,
        r.dataset_id,
        r.criado_em
      FROM
        records_filtered as r
      WHERE
        content ~* ${query};
          `
  );

  return results;
};

module.exports = {
  searchRecordsByKeyword,
};
