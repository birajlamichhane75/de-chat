

const Channels = ({ provider, account, dappcord, channels, currentChannel, setCurrentChannel }) => {
  let handleClick = async(channel) =>{
    // console.log(account,channel.id.toString());
    let joined = await dappcord.hasJoined(channel.id.toString(),account);

    if(joined){
      setCurrentChannel(channel);
    }
    else{
      // console.log("not joined");
      let signer = await provider.getSigner();
      let trans = await dappcord.connect(signer).mint(channel.id,{value:channel.cost});
      await trans.wait();
    }

  }

  return (
    <div className="channels">
      <div className="channels__text">
        <h2>Text Channels</h2>
        {
          channels && channels.map((channel, i) => {
            return <ul key={i}>
              <li
              className={`${currentChannel && currentChannel.id ===  channel.id ? "active":""}`}
              onClick={()=>{
                handleClick(channel);
              }}
              >{channel.name}</li>
            </ul>
          })
        }

      </div>

      <div className="channels__voice">
        <h2>Voice Channels</h2>

        <ul>
          <li>Channel 1</li>
          <li>Channel 2</li>
          <li>Channel 3</li>
        </ul>
      </div>
    </div>
  );
}

export default Channels;