// this uses vercel as a server to host my OpenAI API key

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.prompt) {
    // Immediately send a response to keep the message channel open
    sendResponse({ status: "processing" });
    
    fetch('https://api-m5vvnbzxk-jack-georges-projects.vercel.app/api/openai-proxy', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eLw4cx6UBgTiiGLeButu', // Replace with your AUTH_TOKEN value
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a prompt engineering expert. Your job is to improve the user's prompt to get better results. \
          /*Follow these rules: \
          1. Maintain the original intent and subject matter \
          2. Add specific instructions for format, detail level, and reasoning \
          3. Add constraints to prevent unhelpful tangents \
          4. Structure complex prompts with clear sections \
          5. Add examples if that would help clarify the request \
          6. Keep the enhanced prompt concise and focused \
          7. DO NOT change the fundamental request \
          8. DO NOT just add generic prompt engineering phrases \
          9. Return ONLY the improved prompt with no explanations, commentary, or surrounding text \
          10. Please make sure the prompt provided back is easy to read and split by paragraphs for example. It should be easy to read and use by the person using the extension." },
          { role: "user", content: message.prompt }
        ]
      })
    })
    .then(response => response.json())
    .then(data => {
      // Send the response back to the content script
      chrome.tabs.sendMessage(sender.tab.id, {
        type: "promptResponse",
        data: data
      });
    })
    .catch(error => {
      console.error('Error:', error);
      chrome.tabs.sendMessage(sender.tab.id, {
        type: "promptError",
        error: error.toString()
      });
    });
    
    // Return true to indicate we will send a response asynchronously
    return true;
  }
});
