import { Configuration, OpenAIApi } from "openai";
import React, { useEffect, useState, useRef } from 'react';

function App() {
  const messagesRef = useRef(null);
  const inputMessageRef = useRef(null)
  const [messages, setMessages] = useState([])
  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);

  const generateText = async () => {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: 'Eres un vendedor, contesta como tal: \n\n###\n\n' + messages[messages.length - 1].content + '\n\n###\n\n',
      max_tokens: 150,
      temperature: 0.4
    });

    setMessages([...messages, { role: 'bot', content: response.data.choices[0].text }])
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setMessages([...messages, {
      role: "user",
      content: inputMessageRef.current.value
    }])
  }

  useEffect(() => {
    if (messages.length && inputMessageRef.current?.value) {
      generateText()
    }
  }, [inputMessageRef.current?.value])

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="App">
      <div className="overflow-hidden w-full h-full">
        <div className="messages-container" ref={messagesRef}>
          <div className="chat-message-list">
            {messages?.map((message, index) => {
              return (
                <div key={index} className={`chat-message ${message.role} mb-2`}>
                  <div className="content">
                    <p>{message.content}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <form onSubmit={onSubmit}>
          <div className="chat-textarea-wrapper">
            <div className="chat-textarea-container">
              <textarea ref={inputMessageRef} id="message" className="chat-textarea" placeholder="Ingrese una consulta..."></textarea>
              <button type="submit" style={{ border: 'none' }} className="absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"><svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" class="h-4 w-4 mr-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;