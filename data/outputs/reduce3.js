import fs from 'fs';

const filePath = './datasets/merged-11.09.24.json'; // Input JSON file path
const outputFilePath = './reduced_outputs2/reduced_merged_targeted3.json'; // Output JSON file path

// Define specific queries
const queries = [
  {
    text: "Review the provided text and identify all clauses related to termination rights and conditions.",
    percentage: 0.25 // 25%
  },
  {
    text: "Review the provided text and identify all clauses related to representations and warranties.",
    percentage: 0.25 // 25%
  },
  {
    text: "Review the provided text and identify all clauses related to indemnification.",
    percentage: 0.125 // 12.5%
  },
  {
    text: "Review the provided text and identify all clauses related to closing conditions.",
    percentage: 0.25 // 25%
  },
  {
    text: "Review the provided text and identify all clauses related to Material Adverse Change (MAC) provisions.",
    percentage: 0.125 // 12.5%
  },
  {
    text: "Review the provided text and identify all clauses related to purchase price adjustments.",
    percentage: 0.025 // 2.5%
  },
  {
    text: "Review the provided text and identify all clauses related to non-compete and non-solicitation agreements.",
    percentage: 0.025 // 2.5%
  },
  {
    text: "Review the provided text and identify all clauses related to confidentiality and non-disclosure obligations.",
    percentage: 0.125 // 12.5%
  },
  {
    text: "Review the provided text and identify all clauses related to escrow or holdback provisions.",
    percentage: 0.025 // 2.5%
  },
  {
    text: "Review the provided text and identify all clauses related to dispute resolution mechanisms.",
    percentage: 0.125 // 12.5%
  },
  {
    text: "Review the provided text and identify all clauses related to exclusivity.",
    percentage: 0.125 // 12.5%
  },
  {
    text: "Review the provided text and identify all clauses related to employment agreements.",
    percentage: 0.25 // 25%
  },
];

// Function to reduce "nothing found" responses based on specific queries
const reduceNothingFoundTargetted = (filePath, outputFilePath) => {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Separate "nothing found" and "clauses found" examples
    const nothingFoundExamples = data.filter(item => item.assistant_output === "Nothing found.");
    const clauseFoundExamples = data.filter(item => item.assistant_output !== "Nothing found.");

    // Create an array to hold reduced "nothing found" examples
    let reducedNothingFound = [];

    // Process each query to filter and reduce nothing found examples
    queries.forEach(query => {
      const { text, percentage } = query;

      // Find nothing found examples for the specific query
      const specificNothingFound = nothingFoundExamples.filter(item => item.user_query.content.includes(text));
      const countToRemove = Math.floor(specificNothingFound.length * percentage);

      // Shuffle and reduce nothing found examples for the specific query
      const shuffledSpecificNothingFound = specificNothingFound.sort(() => 0.5 - Math.random());
      const reducedForQuery = shuffledSpecificNothingFound.slice(0, countToRemove);

      // Add reduced examples to the main array
      reducedNothingFound = reducedNothingFound.concat(reducedForQuery);
    });

    // Combine the reduced "nothing found" examples with the "clauses found" examples
    const uniqueReducedNothingFound = reducedNothingFound.filter((item, index, self) =>
      index === self.findIndex((t) => (
        t.user_query.content === item.user_query.content
      ))
    );

    const reducedDataset = [...uniqueReducedNothingFound, ...clauseFoundExamples];

    // Write the reduced dataset to a new JSON file
    fs.writeFileSync(outputFilePath, JSON.stringify(reducedDataset, null, 2), 'utf8');

    console.log(`Reduced dataset written to ${outputFilePath}`);
  } catch (err) {
    console.error('Error reading or processing the file:', err);
  }
};

// Example usage
reduceNothingFoundTargetted(filePath, outputFilePath);
