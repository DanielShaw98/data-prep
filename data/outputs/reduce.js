import fs from 'fs';

const filePath = './reduced_outputs/reduced_merged.json'; // Input JSON file path
const outputFilePath = './reduced_outputs/reduced_mergedx2.json'; // Output JSON file path

const reduceNothingFound = (filePath, outputFilePath) => {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Separate "nothing found" and "clauses found" examples
    const nothingFoundExamples = data.filter(item => item.assistant_output === "Nothing found.");
    const clauseFoundExamples = data.filter(item => item.assistant_output !== "Nothing found.");

    // Shuffle and remove half of the "nothing found" examples
    const shuffledNothingFound = nothingFoundExamples.sort(() => 0.5 - Math.random());
    const reducedNothingFound = shuffledNothingFound.slice(0, Math.floor(nothingFoundExamples.length / 2));

    // Combine the reduced "nothing found" examples with the "clauses found" examples
    const reducedDataset = [...reducedNothingFound, ...clauseFoundExamples];

    // Write the reduced dataset to a new JSON file
    fs.writeFileSync(outputFilePath, JSON.stringify(reducedDataset, null, 2), 'utf8');

    console.log(`Reduced dataset written to ${outputFilePath}`);
  } catch (err) {
    console.error('Error reading or processing the file:', err);
  }
};

// Example usage
reduceNothingFound(filePath, outputFilePath);
