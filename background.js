chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.prompt) {
    // Send initial response
    sendResponse({ status: "processing" });
    
    // Use the correct URL
    const apiUrl = 'https://api-m5vvnbzxk-jack-georges-projects.vercel.app/api/openai-proxy';
    
    // Make request to your proxy
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eLw4cx6UBgTiiGLeButu',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a prompt engineering expert..." },
          { role: "user", content: message.prompt }
        ]
      })
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(`API error: ${JSON.stringify(data)}`);
        });
      }
      return response.json();
    })
    .then(data => {
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
    
    return true;
  }
});
