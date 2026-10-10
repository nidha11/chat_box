const input = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const chatMessages = document.getElementById("chatMessages");

function addMessage(text, type) {
  const message = document.createElement("div");

  message.classList.add("message", type);
  message.textContent = text;

  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
  const message = input.value.trim();

  if (message === "") {
    return;
  }

  // Show user's message
  addMessage(message, "user");

  // Clear input
  input.value = "";

  // Disable button
  sendButton.disabled = true;
  sendButton.textContent = "Thinking...";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: message
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    // Show AI response
    addMessage(data.reply, "bot");

  } catch (error) {
    console.error("Chat error:", error);

    addMessage(
      "Sorry, something went wrong. Please try again.",
      "bot"
    );
  }

  sendButton.disabled = false;
  sendButton.textContent = "Send";

  input.focus();
}

// Send button
sendButton.addEventListener("click", sendMessage);

// Press Enter
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});