const fs = require('fs');
const pdf = require('pdf-parse');
const Papa = require('papaparse');

const parseFileContent = async (file) => {
    const PDF_MIME_TYPE = 'application/pdf';
    const CSV_MIME_TYPE = 'text/csv';

    const { size } = fs.statSync(file.path);
    const type = file.mimetype;

    if (type === PDF_MIME_TYPE) {
        const dataBuffer = fs.readFileSync(file.path);
        const data = await pdf(dataBuffer);
        return { content: data.text, size };
    }

    if (type === CSV_MIME_TYPE) {
        const fileContent = fs.readFileSync(file.path, 'utf-8');

        const result = Papa.parse(fileContent, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true
        });

        const records = result.data;

        return { content: records, size };
    }

    throw new Error('Tipo de arquivo não suportado. Apenas PDF e CSV são permitidos.');
};

module.exports = {
    parseFileContent,
};