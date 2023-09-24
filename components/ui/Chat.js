import React, {useState} from "react";
import styles from "../styles/Chat.module.css"


const Chat = ({ client, messageHistory, conversation }) => {
    const [inputValue, setInputValue] = useState("");

    const handleSend = async () => {
        if (inputValue) {
            await onSendMessage(inputValue);
            setInputValue("");
        }
    };

    const onSendMessage = async (value) => {
        return conversation.send(value);
    }

    const MessageList = ({ messages }) => {
        messages = messages.filter(
            (v, i, a) => a.findIndex((t) => t.id == v.id) === i,
        );

        return (
            <ul className="messageList">
            {messages.map((message, index) => (
              <li
                key={message.id}
                className="messageItem"
                title="Click to log this message to the console">
                <strong>
                  {message.senderAddress === client.address ? "You" : "Bot"}:
                </strong>
                <span>{message.content}</span>
                <span className="date"> ({message.sent.toLocaleTimeString()})</span>
                <span className="eyes" onClick={() => console.log(message)}>
                  👀
                </span>
              </li>
            ))}
          </ul>
        );
    };

    const handleInputChange = (event) => {
        if (event.key === "Enter" ) {
            handleSend();
        } else {
            setInputValue(event.target.value);
        }
    };
    return (
        <div className={styles.Chat}>
          <div className={styles.messageContainer}>
            <MessageList messages={messageHistory} />
          </div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              className={styles.inputField}
              onKeyUp={handleInputChange}
              onChange={handleInputChange}
              value={inputValue}
              placeholder="Type your text here "
            />
            <button className={styles.sendButton} onClick={handleSend}>
              &#128073;
            </button>
          </div>
        </div>
      );
    }
    
export default Chat;

