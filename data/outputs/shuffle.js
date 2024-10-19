import fs from 'fs';

// File paths
const filePath = './final_outputs/reduced_final_structured.json'; // Path to your manipulated dataset
const outputFilePath = './final_outputs/shuffled_reduced_final_structured.json'; // Path to save the shuffled dataset

// Function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Shuffle the dataset
const shuffleDataset = (filePath, outputFilePath) => {
  try {
    // Read the dataset
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Shuffle the dataset
    const shuffledData = shuffleArray(data);

    // Write the shuffled dataset back to a new file
    fs.writeFileSync(outputFilePath, JSON.stringify(shuffledData, null, 2), 'utf8');

    console.log(`Shuffled dataset written to ${outputFilePath}`);
  } catch (err) {
    console.error('Error reading or processing the file:', err);
  }
};

// Shuffle the dataset
shuffleDataset(filePath, outputFilePath);
