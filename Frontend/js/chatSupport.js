document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-message");
  const chatMessages = document.getElementById("chat-messages");

  // Make sure send button will not submit any enclosing form
  sendBtn.type = "button";

  // Prevent Enter from submitting other forms/pages
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  sendBtn.addEventListener("click", (e) => {
    e.preventDefault();
    sendMessage();
  });

  async function sendMessage() {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Show user's message immediately and clear input
    appendMessage("user", userMessage);
    chatInput.value = "";

    // Add a temporary typing indicator for the bot
    const typingId = appendTypingIndicator();

    try {
      const response = await fetch("http://127.0.0.1:5000/api/chat-support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      // Remove typing indicator whether ok or error
      removeElementById(typingId);

      if (!response.ok) {
        appendMessage("bot", "⚠️ Server error. Check console/network.");
        console.error("Server returned", response.status, response.statusText);
        return;
      }

      const data = await response.json();
      if (data && data.response) {
        appendMessage("bot", data.response);
        console.log("Bot response:", data.response);
      } else {
        appendMessage("bot", "🤖 No response text returned.");
        console.warn("No response field in JSON:", data);
      }
    } catch (err) {
      removeElementById(typingId);
      appendMessage("bot", "⚠️ Connection failed. See console.");
      console.error("Fetch error:", err);
    }
  }

  function appendMessage(sender, message) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender === "user" ? "user-message" : "bot-message");

    const messageContent = document.createElement("div");
    messageContent.classList.add("message-content");
    messageContent.innerHTML = `<p>${escapeHtml(message)}</p>`;

    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageDiv;
  }

  function appendTypingIndicator() {
    const id = "typing-" + Date.now();
    const typingDiv = document.createElement("div");
    typingDiv.id = id;
    typingDiv.classList.add("message", "bot-message", "typing-indicator");
    typingDiv.innerHTML = `
      <div class="message-content">
        <p><em>VASU is typing<span class="dots">...</span></em></p>
      </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return id;
  }

  function removeElementById(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  // basic HTML escape to avoid markup injection
  function escapeHtml(unsafe) {
    return unsafe
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
});
