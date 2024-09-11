import fs from 'fs';

const file1 = 'outputs-29.08.24.json';
const file2 = 'outputs-05.09.24.json';
const outputFile = 'merged.json';

const mergeJSONFiles = (file1, file2, outputFile) => {
  try {
    const data1 = JSON.parse(fs.readFileSync(file1, 'utf8'));

    const data2 = JSON.parse(fs.readFileSync(file2, 'utf8'));

    const mergedData = [...data1, ...data2];

    fs.writeFileSync(outputFile, JSON.stringify(mergedData, null, 2), 'utf8');

    console.log(`Successfully merged the files into ${outputFile}`);
  } catch (err) {
    console.error('Error reading or merging files:', err);
  }
};

mergeJSONFiles(file1, file2, outputFile);
