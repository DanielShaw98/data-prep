import fs from 'fs';

// Define the file path for your JSON data
// const filePath = './datasets/merged-11.09.24.json';
// const filePath = './reduced_outputs/reduced_mergedx2.json'
// const filePath = './reduced_outputs2/reduced_merged_targeted.json';
// const filePath = './reduced_outputs2/reduced_merged_targeted2.json';
// const filePath = './reduced_outputs2/reduced_merged_targeted3.json';

// Define the specific queries you want to check against
const queries = [
  "Review the provided text and identify all clauses related to termination rights and conditions.",
  "Review the provided text and identify all clauses related to representations and warranties.",
  "Review the provided text and identify all clauses related to indemnification.",
  "Review the provided text and identify all clauses related to closing conditions.",
  "Review the provided text and identify all clauses related to Material Adverse Change (MAC) provisions.",
  "Review the provided text and identify all clauses related to purchase price adjustments.",
  "Review the provided text and identify all clauses related to non-compete and non-solicitation agreements.",
  "Review the provided text and identify all clauses related to confidentiality and non-disclosure obligations.",
  "Review the provided text and identify all clauses related to escrow or holdback provisions.",
  "Review the provided text and identify all clauses related to dispute resolution mechanisms.",
  "Review the provided text and identify all clauses related to exclusivity.",
  "Review the provided text and identify all clauses related to employment agreements."
];

const countResults = (filePath) => {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const results = {}; // Store results for each query
    let overallNothingFoundCount = 0; // Overall count for "nothing found"
    let overallClauseFoundCount = 0;   // Overall count for "clauses found"

    queries.forEach(query => {
      let nothingFoundCount = 0;
      let clauseFoundCount = 0;

      data.forEach(item => {
        const output = item.assistant_output;
        const userQueryContent = item.user_query.content;

        // Check for "nothing found" output
        if (output === "Nothing found." && userQueryContent.includes(query)) {
          nothingFoundCount++;
          overallNothingFoundCount++; // Increment overall count
        }

        // Check for clauses found only for the specific query
        if (userQueryContent.includes(query) && Array.isArray(output) && output.length > 0) {
          clauseFoundCount++;
          overallClauseFoundCount++; // Increment overall count
        }
      });

      const totalResponses = nothingFoundCount + clauseFoundCount;

      // Only calculate percentages if there are responses
      const nothingFoundPercentage = totalResponses > 0 ? (nothingFoundCount / totalResponses) * 100 : 0;
      const clauseFoundPercentage = totalResponses > 0 ? (clauseFoundCount / totalResponses) * 100 : 0;

      // Store the results for this query
      results[query] = {
        nothingFoundCount,
        clauseFoundCount,
        nothingFoundPercentage: nothingFoundPercentage.toFixed(2),
        clauseFoundPercentage: clauseFoundPercentage.toFixed(2),
      };
    });

    // Print the results for all queries
    for (const query in results) {
      console.log(`Results for query: "${query}"`);
      console.log(`"Nothing found": ${results[query].nothingFoundCount}`);
      console.log(`"Clauses found": ${results[query].clauseFoundCount}`);
      console.log(`Percentage of "Nothing found": ${results[query].nothingFoundPercentage}%`);
      console.log(`Percentage of "Clauses found": ${results[query].clauseFoundPercentage}%\n`);
    }

    // Print overall counts
    console.log(`Overall "Nothing found" count: ${overallNothingFoundCount}`);
    console.log(`Overall "Clauses found" count: ${overallClauseFoundCount}`);
    console.log(`Overall Percentage of "Nothing found": ${(overallNothingFoundCount / data.length * 100).toFixed(2)}%`);
    console.log(`Overall Percentage of "Clauses found": ${(overallClauseFoundCount / data.length * 100).toFixed(2)}%`);

  } catch (err) {
    console.error('Error reading or processing the file:', err);
  }
};

// Call the function to count results
countResults(filePath);

// Results (without reducing "nothing found" responses):

// Termination rights and conditions:
// "Nothing found" for specific query: 1168
// "Clauses found" for specific query: 79
// Percentage of "Nothing found" for specific query: 93.66%
// Percentage of "Clauses found" for specific query: 6.34%

// Representations and warranties:
// "Nothing found" for specific query: 1134
// "Clauses found" for specific query: 113
// Percentage of "Nothing found" for specific query: 90.94%
// Percentage of "Clauses found" for specific query: 9.06%

// Indemnification:
// "Nothing found" for specific query: 1208
// "Clauses found" for specific query: 39
// Percentage of "Nothing found" for specific query: 96.87%
// Percentage of "Clauses found" for specific query: 3.13%

// Closing conditions:
// "Nothing found" for specific query: 1095
// "Clauses found" for specific query: 152
// Percentage of "Nothing found" for specific query: 87.81%
// Percentage of "Clauses found" for specific query: 12.19%

// Material Adverse Change (MAC) provisions:
// "Nothing found" for specific query: 1201
// "Clauses found" for specific query: 46
// Percentage of "Nothing found" for specific query: 96.31%
// Percentage of "Clauses found" for specific query: 3.69%

// Purchase price adjustments:
// "Nothing found" for specific query: 1236
// "Clauses found" for specific query: 11
// Percentage of "Nothing found" for specific query: 99.12%
// Percentage of "Clauses found" for specific query: 0.88%

// Non-compete and non-solicitation agreements:
// "Nothing found" for specific query: 1241
// "Clauses found" for specific query: 6
// Percentage of "Nothing found" for specific query: 99.52%
// Percentage of "Clauses found" for specific query: 0.48%

// Confidentiality and non-disclosure obligations:
// "Nothing found" for specific query: 1217
// "Clauses found" for specific query: 30
// Percentage of "Nothing found" for specific query: 97.59%
// Percentage of "Clauses found" for specific query: 2.41%

// Escrow or holdback provisions:
// "Nothing found" for specific query: 1238
// "Clauses found" for specific query: 9
// Percentage of "Nothing found" for specific query: 99.28%
// Percentage of "Clauses found" for specific query: 0.72%

// Dispute resolution mechanisms:
// "Nothing found" for specific query: 1215
// "Clauses found" for specific query: 32
// Percentage of "Nothing found" for specific query: 97.43%
// Percentage of "Clauses found" for specific query: 2.57%

// Exclusivity:
// "Nothing found" for specific query: 640
// "Clauses found" for specific query: 15
// Percentage of "Nothing found" for specific query: 97.71%
// Percentage of "Clauses found" for specific query: 2.29%

// Employment agreements:
// "Nothing found" for specific query: 625
// "Clauses found" for specific query: 30
// Percentage of "Nothing found" for specific query: 95.42%
// Percentage of "Clauses found" for specific query: 4.58%
