import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { io } from "socket.io-client"

// Components
import Navigation from './components/Navigation'
import Servers from './components/Servers'
import Channels from './components/Channels'
import Messages from './components/Messages'

// ABIs
import Dappcord from './abis/Dappcord.json'

// Config
import config from './config.json';

// Socket
const socket = io('ws://localhost:3030');

function App() {
  const [account, setaccount] = useState(null);
  const [provider, setprovider] = useState();
  const [channels, setchannels] = useState([]);
  const [dappcord, setdappcord] = useState();
  const [currentChannel, setcurrentChannel] = useState();
  const [messages, setMessages] = useState([]);

  let loadBlockchain = async () => {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    setprovider(provider);

    let network = await provider.getNetwork();
    let dappcord = new ethers.Contract(config[network.chainId].Dappcord.address, Dappcord, provider);
    setdappcord(dappcord);

    let total = await dappcord.channelId();
    let channels = [];
    for (let i = 0; i < total.toString(); i++) {
      let channel = await dappcord.getChannel(i + 1);
      channels.push(channel);
    }
    setchannels(channels)
    // console.log(channels);

    window.ethereum.on("accountsChanged", async () => {
      window.location.reload();
    })
  }

  useEffect(() => {
    

    loadBlockchain();

    // // --> https://socket.io/how-to/use-with-react-hooks

    socket.on("connect", () => {
      // console.log("connected....");
      socket.emit('get messages')
    })
    
    socket.on('new message', (messages) => {
      // console.log("new messages....");
      setMessages(messages)
    })
    
    socket.on('get messages', (messages) => {
      // console.log("getting messages....");
      setMessages(messages)
    })

    
    return () => {
      socket.off('connect')
      socket.off('new message')
      socket.off('get messages')
    }
    
  }, []);
  
return (
  <div>
    <Navigation account={account} setAccount={setaccount} />

    <main>
      <Servers />
      <Channels channels={channels} account={account} provider={provider} dappcord={dappcord} currentChannel={currentChannel} setCurrentChannel={setcurrentChannel} />

      <Messages account={account} messages={messages} currentChannel={currentChannel} />

    </main>
  </div>
);
}

export default App;
