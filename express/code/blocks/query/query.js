/**
 * AI Query Component
 * A vanilla JS component that looks like a typical AI query page
 * Makes webhook calls and listens for responses
 */

export default function decorate(block) {
    // Define the HTML structure as a string
    const htmlTemplate = `
      <div class="ai-query-container">
        <div class="ai-query-header">
          <h1>AI Assistant</h1>
          <p>Ask a question or enter a prompt below to get a response from the AI.</p>
        </div>
        
        <div class="ai-query-input">
          <textarea class="ai-query-textarea" placeholder="Type your question or prompt here..."></textarea>
          <button class="ai-query-button">Submit</button>
          <div class="ai-query-status"></div>
        </div>
        
        <div class="ai-query-response">
          <h2>Response</h2>
          <div class="ai-query-response-content">
            <p>Your response will appear here after you submit a query.</p>
          </div>
        </div>
      </div>
    `;
  
    // Set the HTML content
    block.innerHTML = htmlTemplate;
  
    // Get DOM elements
    const queryTextarea = block.querySelector('.ai-query-textarea');
    const submitButton = block.querySelector('.ai-query-button');
    const responseContent = block.querySelector('.ai-query-response-content');
    const statusElement = block.querySelector('.ai-query-status');
  
    // Webhook URL
    const webhookUrl = 'https://all42238.app.n8n.cloud/webhook/test';
    
    // Initialize unique session ID
    const sessionId = generateSessionId();
    
    // Track if we're currently receiving a streaming response
    let isReceivingStream = false;
    
    // Add event listener for the submit button
    submitButton.addEventListener('click', () => {
      handleSubmit();
    });
  
    // Add event listener for Enter key (with Shift for new line)
    queryTextarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    });
  
    /**
     * Handles the form submission
     */
    async function handleSubmit() {
      const query = queryTextarea.value.trim();
      
      if (!query) {
        updateStatus('Please enter a query.', 'error');
        return;
      }
  
      // Disable input during processing
      submitButton.disabled = true;
      queryTextarea.disabled = true;
      updateStatus('Sending request...', 'normal');
      
      // Show loading indicator
      showLoading();
      
      try {
        // Make webhook POST request
        await sendQueryToWebhook(query);
        
        // Set up to receive response stream
        listenForStreamingResponse();
        
      } catch (error) {
        console.error('Error:', error);
        updateStatus('Error sending request. Please try again.', 'error');
        hideLoading();
        
        // Re-enable input
        submitButton.disabled = false;
        queryTextarea.disabled = false;
      }
    }
  
    /**
     * Sends the query to the webhook
     * @param {string} query - The user's query
     */
    async function sendQueryToWebhook(query) {
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chatInput: query,
            sessionId,
            timestamp: new Date().toISOString()
          })
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const res = await response.json();
        if (res.output) {
          updateResponseContent(res.output)
          completeResponse();
        }
      } catch (error) {
        console.error('Webhook error:', error);
        throw error;
      }
    }
  
    /**
     * Sets up a mechanism to listen for streaming responses
     * This could be WebSockets, Server-Sent Events, or polling
     * For this example, we'll use a simulated response
     */
    function listenForStreamingResponse() {
      // Mark that we're receiving a stream
      isReceivingStream = true;
      
      // For demo purposes: simulate a streaming response
      // In a real implementation, you would use WebSockets, SSE, or long polling
      // connected to your webhook endpoint
      
      // Simulated initial response after 1 second
      setTimeout(() => {
        if (isReceivingStream) {
          updateResponseContent("I'm processing your request...");
        }
      }, 1000);
      
      // Simulated additional response after 2 seconds
      setTimeout(() => {
        if (isReceivingStream) {
          updateResponseContent("I'm processing your request...\n\nAnalyzing the information...");
        }
      }, 3000);
      
      // Simulated final response after 4 seconds
      // setTimeout(() => {
      //   if (isReceivingStream) {
      //     // Complete the response
      //     updateResponseContent("I've analyzed your request and here's my response:\n\nThis is a simulated response from the AI assistant. In a real implementation, this would be streaming from your webhook endpoint.");
          
      //     // End the stream
      //     completeResponse();
      //   }
      // }, 5000);
      
      // Add event listener for actual SSE or WebSocket implementation
      // This would be the real implementation
      
      const eventSource = new EventSource(`${webhookUrl}/stream?sessionId=${sessionId}`);
      
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        updateResponseContent(data.content);
        
        if (data.complete) {
          eventSource.close();
          completeResponse();
        }
      };
      
      eventSource.onerror = () => {
        console.error('SSE error');
        eventSource.close();
        completeResponse('Error receiving response');
      };
    
    }
  
    /**
     * Updates the response content area
     * @param {string} content - The content to display
     */
    function updateResponseContent(content) {
      // Replace newlines with HTML breaks for proper display
      responseContent.innerHTML = content.replace(/\n/g, '<br>');
    }
  
    /**
     * Completes the response process
     * @param {string} errorMessage - Optional error message
     */
    function completeResponse(errorMessage = null) {
      isReceivingStream = false;
      hideLoading();
      
      if (errorMessage) {
        updateStatus(errorMessage, 'error');
      } else {
        updateStatus('Response complete', 'success');
      }
      
      // Re-enable input
      submitButton.disabled = false;
      queryTextarea.disabled = false;
    }
  
    /**
     * Shows the loading indicator
     */
    function showLoading() {
      responseContent.classList.add('loading');
      responseContent.innerHTML = `
        <div class="ai-loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      `;
    }
  
    /**
     * Hides the loading indicator
     */
    function hideLoading() {
      responseContent.classList.remove('loading');
    }
  
    /**
     * Updates the status message
     * @param {string} message - The status message
     * @param {string} type - The type of status (normal, error, success)
     */
    function updateStatus(message, type = 'normal') {
      statusElement.textContent = message;
      statusElement.className = 'ai-query-status';
      
      if (type === 'error') {
        statusElement.classList.add('error');
      } else if (type === 'success') {
        statusElement.classList.add('success');
      }
    }
  
    /**
     * Generates a unique session ID
     * @returns {string} A unique session ID
     */
    function generateSessionId() {
      return 'xxxx-xxxx-xxxx-xxxx'.replace(/x/g, () => {
        return Math.floor(Math.random() * 16).toString(16);
      });
    }
  
    // Return the decorated block
    return block;
  }