// this uses vercel as a server to host my OpenAI API key

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.prompt) {
    // Immediately send a response to keep the message channel open
    sendResponse({ status: "processing" });

    fetch('https://api-lvrdrchth-jack-georges-projects.vercel.app/api/openai-proxy', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer OPENAI_API_KEY',
        'Content-Type': 'application/json'
        // No API key needed here - it's now securely on your server
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a prompt engineering expert. Your job is to improve the user's prompt to get better results from ChatGPT. The prompt you provide should not be overly complex but it should make it easier for ChatGPT to understand and should not be provided in quotation marks."
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
            10. Please make sure the prompt provided back is easy to read and split by paragraphs for example. It should be easy for the end user to digest. \
            11. There should always be a line break after a colon to make the prompt easier to read. Importantly you should provide me with a better prompt as the end product and that is it."
            */},
          { role: "user", content: message.prompt }
        ]
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("API response:", data);
      if (data.choices && data.choices[0] && data.choices[0].message) {
        // Send the enhanced prompt back to the content script
        chrome.tabs.sendMessage(sender.tab.id, {
          action: "updatePrompt",
          enhancedPrompt: data.choices[0].message.content
        });
      } else {
        console.error("Unexpected API response format:", data);
      }
    })
    .catch(error => {
      console.error("Error calling OpenAI API:", error);
      chrome.tabs.sendMessage(sender.tab.id, {
        action: "errorMessage",
        error: error.message
      });
    });
  }
  // Return true to indicate we'll respond asynchronously
  return true;
});
