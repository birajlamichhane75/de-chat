import { ethers } from 'ethers'

const Navigation = ({ account, setAccount }) => {
  let handleClick = async() => {
    let accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    let account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);
  }

  return (
    <nav>
      <div className="nav__brand">
        <h1>Dappcord</h1>
      </div>

      {
        account ? <button className="nav__connect">{`${account.slice(0,6)}...${account.slice(-4)}`}</button>:
        <button className="nav__connect" onClick={handleClick}>Connect</button>
      }
    </nav>
  );
}

export default Navigation;