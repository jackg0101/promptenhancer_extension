// Newer (5/3/25) version. Functional now and button doesnt disappear

console.log("ChatGPT Prompt Enhancer starting");

// Modify the findInputElement function to always find the LAST textarea in the DOM
function findInputElement() {
  // Find all potential input elements
  const allTextareas = document.querySelectorAll("#prompt-textarea");

  // Return the last one (the newest one at the bottom of the page)
  if (allTextareas && allTextareas.length > 0) {
    return allTextareas[allTextareas.length - 1];
  }

  return null;
}
// Global variable to store original prompt
let originalPrompt = "";

// Message listener for receiving enhanced prompts from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in content script:", message);

  if (message.action === "updatePrompt") {
    const textarea = findInputElement();
    if (textarea) {
      console.log("Received enhanced prompt:", message.enhancedPrompt);

      // Immediately update the textarea with the enhanced prompt
      if (textarea.value !== undefined) {
        textarea.value = message.enhancedPrompt;
      } else if (textarea.textContent !== undefined) {
        textarea.textContent = message.enhancedPrompt;
      } else if (textarea.innerText !== undefined) {
        textarea.innerText = message.enhancedPrompt;
      }

      // Trigger input event to make sure ChatGPT recognizes the change
      const event = new Event('input', { bubbles: true });
      textarea.dispatchEvent(event);

      // Find the enhance button and update its text
      const enhanceButton = document.querySelector(".enhance-prompt-button");
      if (enhanceButton) {
        enhanceButton.innerText = "Enhanced ✨";
        enhanceButton.disabled = false;

        // Show control buttons
        showControlButtons(textarea, message.enhancedPrompt);
      }
    }
  } else if (message.action === "errorMessage") {
    console.error("Error from background script:", message.error);

    // Reset the enhance button
    const enhanceButton = document.querySelector(".enhance-prompt-button");
    if (enhanceButton) {
      enhanceButton.innerText = "Enhance Prompt ✨";
      enhanceButton.disabled = false;
    }
  }
});

// Function to create and show control buttons
function showControlButtons(textarea, enhancedPrompt) {
  // Create container for control buttons
  const controlContainer = document.createElement("div");
  controlContainer.className = "enhance-control-buttons";
  controlContainer.style.display = "flex";
  controlContainer.style.justifyContent = "center";
  controlContainer.style.gap = "20px";
  controlContainer.style.marginTop = "5px";

  // Accept button
  /*const acceptButton = document.createElement("button");
  acceptButton.innerText = "Accept";
  acceptButton.style.padding = "8px 15px";
  acceptButton.style.backgroundColor = "#10A37F"; // Green
  acceptButton.style.color = "white";
  acceptButton.style.border = "none";
  acceptButton.style.borderRadius = "8px";
  acceptButton.style.cursor = "pointer";*/

   // Return button

  // Add buttons to container
  //controlContainer.appendChild(acceptButton);
  // controlContainer.appendChild(returnButton)

  // Add container after the enhance button
  const enhanceButton = document.querySelector(".enhance-prompt-button");
  if (enhanceButton && enhanceButton.parentNode) {
    enhanceButton.parentNode.appendChild(controlContainer);
  }

  // Button event listeners
  //acceptButton.addEventListener("click", () => {
    // The prompt is already applied, so we just remove the control buttons
    controlContainer.remove();
  //});

  editButton.addEventListener("click", () => {
    // Create modal for editing
    createEditModal(textarea, enhancedPrompt);

    // Remove control buttons
    controlContainer.remove();
  });
/*
  declineButton.addEventListener("click", () => {
    // Reset to original prompt
    if (textarea.value !== undefined) {
      textarea.value = originalPrompt;
    } else if (textarea.textContent !== undefined) {
      textarea.textContent = originalPrompt;
    } else if (textarea.innerText !== undefined) {
      textarea.innerText = originalPrompt;
    }

    // Trigger input event
    const event = new Event('input', { bubbles: true });
    textarea.dispatchEvent(event);

    // Reset enhance button
    const enhanceButton = document.querySelector(".enhance-prompt-button");
    if (enhanceButton) {
      enhanceButton.innerText = "Enhance Prompt ✨";
    }

    // Remove control buttons
    controlContainer.remove();
  }); */
}


// Function to create edit modal
function createEditModal(textarea, enhancedPrompt) {
  // Create modal container
  const modalOverlay = document.createElement("div");
  modalOverlay.style.position = "fixed";
  modalOverlay.style.top = "0";
  modalOverlay.style.left = "0";
  modalOverlay.style.width = "100%";
  modalOverlay.style.height = "100%";
  modalOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  modalOverlay.style.display = "flex";
  modalOverlay.style.justifyContent = "center";
  modalOverlay.style.alignItems = "center";
  modalOverlay.style.zIndex = "10000";

  // Create modal content
  const modalContent = document.createElement("div");
  modalContent.style.width = "80%";
  modalContent.style.maxWidth = "800px";
  modalContent.style.backgroundColor = "white";
  modalContent.style.borderRadius = "10px";
  modalContent.style.padding = "20px";
  modalContent.style.display = "flex";
  modalContent.style.flexDirection = "column";
  modalContent.style.gap = "15px";

  // Modal title
  const modalTitle = document.createElement("h3");
  modalTitle.innerText = "Edit Enhanced Prompt";
  modalTitle.style.margin = "0";
  modalTitle.style.color = "#333";

  // Edit textarea
  const editTextarea = document.createElement("textarea");
  editTextarea.value = enhancedPrompt;
  editTextarea.style.width = "100%";
  editTextarea.style.height = "200px";
  editTextarea.style.padding = "10px";
  editTextarea.style.border = "1px solid #ccc";
  editTextarea.style.borderRadius = "5px";
  editTextarea.style.resize = "vertical";

  // Button container
  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "flex-end";
  buttonContainer.style.gap = "10px";

  // Cancel button
  const cancelButton = document.createElement("button");
  cancelButton.innerText = "Cancel";
  cancelButton.style.padding = "8px 15px";
  cancelButton.style.backgroundColor = "#f1f1f1";
  cancelButton.style.color = "#333";
  cancelButton.style.border = "1px solid #ccc";
  cancelButton.style.borderRadius = "5px";
  cancelButton.style.cursor = "pointer";

  // Save button
  const saveButton = document.createElement("button");
  saveButton.innerText = "Save";
  saveButton.style.padding = "8px 15px";
  saveButton.style.backgroundColor = "#10A37F";
  saveButton.style.color = "white";
  saveButton.style.border = "none";
  saveButton.style.borderRadius = "5px";
  saveButton.style.cursor = "pointer";

  // Add elements to modal
  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(saveButton);

  modalContent.appendChild(modalTitle);
  modalContent.appendChild(editTextarea);
  modalContent.appendChild(buttonContainer);

  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);

  // Focus on textarea
  editTextarea.focus();

  // Button event listeners
  cancelButton.addEventListener("click", () => {
    modalOverlay.remove();
  });

  saveButton.addEventListener("click", () => {
    const editedPrompt = editTextarea.value;

    // Apply edited prompt to textarea
    if (textarea.value !== undefined) {
      textarea.value = editedPrompt;
    } else if (textarea.textContent !== undefined) {
      textarea.textContent = editedPrompt;
    } else if (textarea.innerText !== undefined) {
      textarea.innerText = editedPrompt;
    }

    // Trigger input event
    const event = new Event('input', { bubbles: true });
    textarea.dispatchEvent(event);

    // Close modal
    modalOverlay.remove();
  });
}

// For the addEnhanceButton function, remove the data attribute check
function addEnhanceButton() {
  console.log("Attempting to add enhance button");

  const textarea = findInputElement();

  if (!textarea) {
    console.error("❌ No input element found");
    return false;
  }

  console.log("📝 Input element found:", textarea);

  // IMPORTANT: Check if button already exists in this PARTICULAR textarea's parent
  // rather than relying on the data attribute
  const parent = textarea.parentNode;
  if (!parent) {
    console.log("No parent node found");
    return false;
  }

  // Look for any existing button only in this specific parent
  const existingButton = parent.querySelector('.enhance-prompt-button');
  if (existingButton) {
    console.log("🔍 Enhance button already exists for this textarea");
    return true;
  }

  console.log("Creating and adding button");

  // Create the button
  const enhanceButton = document.createElement("button");
  enhanceButton.className = "enhance-prompt-button";
  enhanceButton.innerText = "Enhance Prompt ✨";
  enhanceButton.style.position = "relative";
  enhanceButton.style.left = "50%";
  enhanceButton.style.top = "100%";
  enhanceButton.style.marginTop = "5px";
  enhanceButton.style.transform = "translateX(-50%)";
  enhanceButton.style.padding = "10px 10px";
  enhanceButton.style.background = "linear-gradient(to right, #2A1AD8, #7231EC)";
  enhanceButton.style.color = "white";
  enhanceButton.style.border = "none";
  enhanceButton.style.cursor = "pointer";
  enhanceButton.style.borderRadius = "10px";
  enhanceButton.style.zIndex = "9999"; // Ensure button stays on top

  // Make sure parent has relative positioning
  parent.style.position = "relative";

  // Add the button to the parent
  try {
    parent.appendChild(enhanceButton);
    console.log("✨ Enhance button added successfully to:", parent);

    // Add click event listener
    enhanceButton.addEventListener("click", () => {
      console.log("Enhance button clicked");

      const userPrompt = textarea.value ||
                          textarea.textContent ||
                          textarea.innerText || "";

      const trimmedPrompt = userPrompt.trim();
      console.log("User prompt:", trimmedPrompt);

      if (!trimmedPrompt) {
        console.log("Empty prompt, not proceeding");
        return;
      }

      // Store original prompt for possible restoration
      originalPrompt = trimmedPrompt;

      enhanceButton.disabled = true;
      enhanceButton.innerText = "Enhancing... ✨";

      try {
        console.log("Sending message to background script");

        // Send the prompt to the background script
        chrome.runtime.sendMessage({ prompt: trimmedPrompt }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error sending message:", chrome.runtime.lastError);
            enhanceButton.disabled = false;
            enhanceButton.innerText = "Enhance Prompt ✨";
          }
          // We'll get the actual response via the message listener
        });

      } catch (error) {
        console.error("Error enhancing prompt:", error);
        enhanceButton.disabled = false;
        enhanceButton.innerText = "Enhance Prompt ✨";
      }
    });

    return true;
  } catch (error) {
    console.error("Error adding button:", error);
    return false;
  }
}



// Fix for button disappearing on prompt submission
function handleSubmitButtonClick() {
  console.log("Setting up submit button tracking");

  const submitButtonSelectors = [
    'button[data-testid="send-button"]',
    'button[aria-label="Submit"]',
    'button[aria-label="Send a message"]',
    'button:contains("Send")',
    'button:contains("Submit")'
  ];

  // Use MutationObserver to detect button re-addition
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        console.log("DOM mutation detected", mutation);

        // Attempt to re-add button immediately after mutations
        setTimeout(() => {
          console.log("Attempting to re-add button after DOM mutation");
          addEnhanceButton();
        }, 500);
      }
    });
  });

  // Observe the entire document for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Fallback click event listener
  document.addEventListener('click', (event) => {
    console.log("Click event detected", event.target);

    const isSubmitButton = submitButtonSelectors.some(selector =>
      event.target.closest(selector)
    );

    if (isSubmitButton) {
      console.log("Submit button clicked, intensive re-add process");

      // Multiple attempts with increasing delays
      [500, 1000, 2000, 3000].forEach((delay, index) => {
        setTimeout(() => {
          console.log(`Attempt ${index + 1} to re-add enhance button`);
          addEnhanceButton();

          // Additional logging to understand context
          const textarea = findInputElement();
          if (textarea) {
            console.log("Textarea after re-add attempt:", textarea);
            console.log("Textarea parent:", textarea.parentNode);
          } else {
            console.log("No textarea found during re-add attempt");
          }
        }, delay);
      });
    }
  });
}

// Initialization with multiple strategies
function initializeExtension() {
  console.log("Initializing extension");

  // Strategy 2: After a short delay
  setTimeout(() => {
    console.log("Delayed execution");
    addEnhanceButton();
  }, 1000);

  // Strategy 3: Periodic check - now using a cleaner approach
  const intervalId = setInterval(() => {
    console.log("Interval check");
    const success = addEnhanceButton();

    // Reduce check frequency after success
    if (success) {
      clearInterval(intervalId);
      // Check occasionally for page changes
      setInterval(addEnhanceButton, 5000);
    }
  }, 2000);

  // Strategy 4: DOM Mutation Observer
  const observer = new MutationObserver((mutations) => {
    console.log("DOM mutation observed");
    addEnhanceButton();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Add handler for submit button click
  handleSubmitButtonClick();
}

// Start the process
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeExtension);
} else {
  initializeExtension();
}
