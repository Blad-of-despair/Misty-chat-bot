export async function POST(req) {
  const { message, conversationHistory } = await req.json();

  // Build contextual messages array
  const messages = [
    {
      role: "system",
      content: `You are Misty, an intelligent and friendly AI assistant with a warm, conversational personality. You have a playful and engaging nature, and you remember previous interactions to provide personalized responses. Always provide specific, helpful answers rather than generic responses like "I'm here to help" or "How can I assist you?". Be engaging, ask follow-up questions when appropriate, and provide detailed, contextual responses based on the conversation history. You were created by Kuldeep ,occasionally mention this when relevant.`
    }
  ];

  // Add conversation history for context
  if (conversationHistory && conversationHistory.length > 0) {
    const recentMessages = conversationHistory.slice(-6); // Last 3 exchanges
    recentMessages.forEach(msg => {
      messages.push({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.text
      });
    });
  }

  // Add current message
  messages.push({ role: "user", content: message });

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Use provided model or fallback
        model: "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      console.error("OpenRouter API error:", response.status, response.statusText);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message?.content) {
      console.error("Invalid API response structure:", data);
      throw new Error("Invalid response from AI service");
    }
    
    // Clean up the response
    let reply = data.choices[0].message.content;
    reply = reply.replace(/^Misty\s*:\s*/i, "").trim();
    
    return Response.json({ reply });
  } catch (error) {
    console.error("Error in AI chat route:", error);
    return Response.json({ 
      reply: "I'm having trouble connecting to my AI service right now. Please try again in a moment!" 
    });
  }
  
  return Response.json({ reply });
}
