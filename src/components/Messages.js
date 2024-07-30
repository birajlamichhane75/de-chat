import { useEffect, useState, useRef } from 'react'
import { io } from "socket.io-client"

// Assets
import person from '../assets/person.svg'
import send from '../assets/send.svg'

// Socket
const socket = io('ws://localhost:3030')

const Messages = ({ account, messages, currentChannel }) => {
  const [message, setmessage] = useState();


  let sendMessages = async (e) => {
    e.preventDefault();
    console.log(message);

    const messageObj = {
      channel : currentChannel.id.toString(),
      account:account,
      text:message,
    }
    if(message !== ""){
      socket.emit("new message", messageObj);
    }

    setmessage("");

  }
  // console.log(currentChannel);
  // console.log(messages);
  return (
    <div className="text">
      <div className="messages">
        {
          currentChannel && messages.filter((msg => msg.channel === currentChannel.id.toString())).map((msg, index) => {

            return (
              <div className="message" key={index} >
                <img src={person} alt="Person" />
                <div className="message_content">
                  <h3>{msg.account.slice(0, 6)}...{msg.account.slice(-4)}</h3>
                  <p>{msg.text}</p>
                </div>
              </div>

            )
          })
        }
      </div>
      <form onSubmit={sendMessages}>
        {
          account && currentChannel ?
            <input type="text"
            placeholder={`Message #${currentChannel.name}`}
              value={message || ""}
              onChange={(e) => {
                setmessage(e.target.value)
              }} />
            :
            <input type="text" value="" placeholder={`Please Connect Wallet / Join the Channel`} disabled />
        }

        <button type="submit">
          <img src={send} alt="Send Message" />
        </button>
      </form>




    </div>
  );
}

export default Messages;