import fs from 'fs';

// Define the file path for your JSON data
// const filePath = './datasets/merged-11.09.24.json';
// const filePath = './reduced_outputs/reduced_mergedx2.json'
// const filePath = './reduced_outputs2/reduced_merged_targeted.json';
// const filePath = './reduced_outputs2/reduced_merged_targeted2.json';
// const filePath = './reduced_outputs2/reduced_merged_targeted3.json';
// const filePath = './final_outputs/outputs_final_structured.json';
// const filePath = './final_outputs/reduced_final_structured.json';
const filePath = './final_outputs/shuffled_reduced_final_structured.json';

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

// Results for outputs_final_structured.json

// Results for query: "Review the provided text and identify all clauses related to termination rights and conditions."
// "Nothing found": 776
// "Clauses found": 117
// Percentage of "Nothing found": 86.90%
// Percentage of "Clauses found": 13.10%

// Results for query: "Review the provided text and identify all clauses related to representations and warranties."
// "Nothing found": 740
// "Clauses found": 153
// Percentage of "Nothing found": 82.87%
// Percentage of "Clauses found": 17.13%

// Results for query: "Review the provided text and identify all clauses related to indemnification."
// "Nothing found": 839
// "Clauses found": 54
// Percentage of "Nothing found": 93.95%
// Percentage of "Clauses found": 6.05%

// Results for query: "Review the provided text and identify all clauses related to closing conditions."
// "Nothing found": 691
// "Clauses found": 202
// Percentage of "Nothing found": 77.38%
// Percentage of "Clauses found": 22.62%

// Results for query: "Review the provided text and identify all clauses related to Material Adverse Change (MAC) provisions."
// "Nothing found": 841
// "Clauses found": 52
// Percentage of "Nothing found": 94.18%
// Percentage of "Clauses found": 5.82%

// Results for query: "Review the provided text and identify all clauses related to purchase price adjustments."
// "Nothing found": 859
// "Clauses found": 34
// Percentage of "Nothing found": 96.19%
// Percentage of "Clauses found": 3.81%

// Results for query: "Review the provided text and identify all clauses related to non-compete and non-solicitation agreements."
// "Nothing found": 882
// "Clauses found": 11
// Percentage of "Nothing found": 98.77%
// Percentage of "Clauses found": 1.23%

// Results for query: "Review the provided text and identify all clauses related to confidentiality and non-disclosure obligations."
// "Nothing found": 846
// "Clauses found": 47
// Percentage of "Nothing found": 94.74%
// Percentage of "Clauses found": 5.26%

// Results for query: "Review the provided text and identify all clauses related to escrow or holdback provisions."
// "Nothing found": 885
// "Clauses found": 8
// Percentage of "Nothing found": 99.10%
// Percentage of "Clauses found": 0.90%

// Results for query: "Review the provided text and identify all clauses related to dispute resolution mechanisms."
// "Nothing found": 850
// "Clauses found": 43
// Percentage of "Nothing found": 95.18%
// Percentage of "Clauses found": 4.82%

// Results for query: "Review the provided text and identify all clauses related to exclusivity."
// "Nothing found": 835
// "Clauses found": 58
// Percentage of "Nothing found": 93.51%
// Percentage of "Clauses found": 6.49%

// Results for query: "Review the provided text and identify all clauses related to employment agreements."
// "Nothing found": 790
// "Clauses found": 103
// Percentage of "Nothing found": 88.47%
// Percentage of "Clauses found": 11.53%

// Overall "Nothing found" count: 9834
// Overall "Clauses found" count: 882
// Overall Percentage of "Nothing found": 91.77%
// Overall Percentage of "Clauses found": 8.23%
