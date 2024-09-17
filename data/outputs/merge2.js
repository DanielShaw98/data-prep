import fs from 'fs';

const file1 = './reduced_outputs/reduced_output-2500(1).json';
const file2 = './reduced_outputs/reduced_output-2500(2).json';
const file3 = './reduced_outputs/reduced_output-2500(3).json';
const file4 = './reduced_outputs/reduced_output-2500(4).json';
const outputFile = 'reduced_merged.json';

const mergeJSONFiles = (file1, file2, file3, file4, outputFile) => {
  try {
    // Read all files
    const data1 = JSON.parse(fs.readFileSync(file1, 'utf8'));
    const data2 = JSON.parse(fs.readFileSync(file2, 'utf8'));
    const data3 = JSON.parse(fs.readFileSync(file3, 'utf8'));
    const data4 = JSON.parse(fs.readFileSync(file4, 'utf8'));

    // Merge the datasets
    const mergedData = [...data1, ...data2, ...data3, ...data4];

    // Write merged data to the output file
    fs.writeFileSync(outputFile, JSON.stringify(mergedData, null, 2), 'utf8');

    console.log(`Successfully merged the files into ${outputFile}`);
  } catch (err) {
    console.error('Error reading or merging files:', err);
  }
};

// Example usage
mergeJSONFiles(file1, file2, file3, file4, outputFile);
