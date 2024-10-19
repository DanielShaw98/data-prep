import fs from 'fs';

const filePath = './final_outputs/outputs_final_structured.json'; // Input JSON file path
const outputFilePath = './final_outputs/reduced_final_structured.json'; // Output JSON file path

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
    percentage: 0.015 // 1.5%
  },
  {
    text: "Review the provided text and identify all clauses related to confidentiality and non-disclosure obligations.",
    percentage: 0.125 // 12.5%
  },
  {
    text: "Review the provided text and identify all clauses related to escrow or holdback provisions.",
    percentage: 0.015 // 1.5%
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

// Results for reduced_final_structured.json

// Results for query: "Review the provided text and identify all clauses related to termination rights and conditions."
// "Nothing found": 194
// "Clauses found": 117
// Percentage of "Nothing found": 62.38%
// Percentage of "Clauses found": 37.62%

// Results for query: "Review the provided text and identify all clauses related to representations and warranties."
// "Nothing found": 185
// "Clauses found": 153
// Percentage of "Nothing found": 54.73%
// Percentage of "Clauses found": 45.27%

// Results for query: "Review the provided text and identify all clauses related to indemnification."
// "Nothing found": 104
// "Clauses found": 54
// Percentage of "Nothing found": 65.82%
// Percentage of "Clauses found": 34.18%

// Results for query: "Review the provided text and identify all clauses related to closing conditions."
// "Nothing found": 172
// "Clauses found": 202
// Percentage of "Nothing found": 45.99%
// Percentage of "Clauses found": 54.01%

// Results for query: "Review the provided text and identify all clauses related to Material Adverse Change (MAC) provisions."
// "Nothing found": 105
// "Clauses found": 52
// Percentage of "Nothing found": 66.88%
// Percentage of "Clauses found": 33.12%

// Results for query: "Review the provided text and identify all clauses related to purchase price adjustments."
// "Nothing found": 21
// "Clauses found": 34
// Percentage of "Nothing found": 38.18%
// Percentage of "Clauses found": 61.82%

// Results for query: "Review the provided text and identify all clauses related to non-compete and non-solicitation agreements."
// "Nothing found": 13
// "Clauses found": 11
// Percentage of "Nothing found": 54.17%
// Percentage of "Clauses found": 45.83%

// Results for query: "Review the provided text and identify all clauses related to confidentiality and non-disclosure obligations."
// "Nothing found": 105
// "Clauses found": 47
// Percentage of "Nothing found": 69.08%
// Percentage of "Clauses found": 30.92%

// Results for query: "Review the provided text and identify all clauses related to escrow or holdback provisions."
// "Nothing found": 13
// "Clauses found": 8
// Percentage of "Nothing found": 61.90%
// Percentage of "Clauses found": 38.10%

// Results for query: "Review the provided text and identify all clauses related to dispute resolution mechanisms."
// "Nothing found": 106
// "Clauses found": 43
// Percentage of "Nothing found": 71.14%
// Percentage of "Clauses found": 28.86%

// Results for query: "Review the provided text and identify all clauses related to exclusivity."
// "Nothing found": 104
// "Clauses found": 58
// Percentage of "Nothing found": 64.20%
// Percentage of "Clauses found": 35.80%

// Results for query: "Review the provided text and identify all clauses related to employment agreements."
// "Nothing found": 197
// "Clauses found": 103
// Percentage of "Nothing found": 65.67%
// Percentage of "Clauses found": 34.33%

// Overall "Nothing found" count: 1319
// Overall "Clauses found" count: 882
// Overall Percentage of "Nothing found": 59.93%
// Overall Percentage of "Clauses found": 40.07%
