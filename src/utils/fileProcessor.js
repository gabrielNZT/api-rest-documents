const fs = require('fs');

const parseFileContent = async (file) => {
    const PDF_MIME_TYPE = 'application/pdf';
    const CSV_MIME_TYPE = 'text/csv';

    const { size } = fs.statSync(file.path);
    const type = file.mimetype;

    if (type === PDF_MIME_TYPE) {
        const content = fs.readFileSync(file.path, 'base64')
        return { content, size };
    }

    if (type === CSV_MIME_TYPE) {
        const fileContent = fs.readFileSync(file.path, 'utf-8');
        const rows = fileContent.split('\n').map(line => {
            const cleanedLine = line.replace(/\r/g, ''); 
            return cleanedLine.split(',');
        });
        const headers = rows[0];

        const records = rows.slice(1).map(values => {
            const record = {};
            headers.forEach((header, index) => {
                record[header] = values[index];
            });
            return record;
        });

        return { content: records, size };
    }

    throw new Error('Unsupported file type');
};

module.exports = {
    parseFileContent,
};