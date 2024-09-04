import data from './outputs-29.07.24.json' assert { type: "json" };
import fs from 'fs';

function reformatJSON(input) {
  const finalObject = [];
  for (let i = 0; i < input.length; i++) {
    const systemMessage = input[i].system_message;
    const userMessage = input[i].user_query;
    const assistantMessage = {
      role: "assistant",
      content: JSON.stringify(input[i].assistant_output),
    };

    finalObject.push({
      conversation: [systemMessage, userMessage, assistantMessage],
      text: reformatConversation([systemMessage, userMessage, assistantMessage]),
    });
  }

  return finalObject;
}

function reformatConversation(input) {
  let userContent = '';

  const transformedArray = input.map(item => {
    if (item.role === 'system' || item.role === 'user') {
      userContent += item.content.trim() + '\n\n';
    } else if (item.role === 'assistant') {
      return `<|assistant|>\n${item.content.trim()}<|end|>`;
    }
  });

  return `<|user|>\n${userContent.trim()}<|end|>\n\n` + transformedArray.filter(Boolean).join('\n\n');
}

const reformattedData = reformatJSON(data);

fs.writeFile('outputs-29.07.24-reformatted+conversation.json', JSON.stringify(reformattedData), (err) => {
  if (err) throw err;
  console.log('Data has been written to the file');
});
