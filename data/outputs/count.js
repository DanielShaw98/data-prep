import fs from 'fs';

// const filePath = './chunk_testing/outputs-2500(4).json';
// const filePath = './reduced_outputs/reduced_output-2500(4).json';
const filePath = './reduced_outputs/reduced_mergedx2.json';
// const filePath = './datasets/merged-11.09.24.json';

const countResults = (filePath) => {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    let nothingFoundCount = 0;
    let clauseFoundCount = 0;

    data.forEach(item => {
      const output = item.assistant_output;

      if (output === "Nothing found.") {
        nothingFoundCount++;
      } else if (Array.isArray(output) && output.length > 0) {
        clauseFoundCount++;
      }
    });

    const totalResponses = nothingFoundCount + clauseFoundCount;
    const nothingFoundPercentage = (nothingFoundCount / totalResponses) * 100;
    const clauseFoundPercentage = (clauseFoundCount / totalResponses) * 100;

    console.log(`"Nothing found" responses: ${nothingFoundCount}`);
    console.log(`Clauses found: ${clauseFoundCount}`);
    console.log(`Percentage of "Nothing found": ${nothingFoundPercentage.toFixed(2)}%`);
    console.log(`Percentage of clauses found: ${clauseFoundPercentage.toFixed(2)}%`);
  } catch (err) {
    console.error('Error reading or processing the file:', err);
  }
};

countResults(filePath);
