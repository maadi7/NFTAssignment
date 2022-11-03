import abi from "./abi/abi.json" assert { type: "json" };
import data from "./data.js";

//Could have been store in .env file
const secrect = "~&zcOvX~G]B1GpZ";

let bytes = CryptoJS.AES.decrypt(data, secrect);
let res = bytes.toString(CryptoJS.enc.Utf8);
console.log(res);
let WalletAddress = "";
//const contract = "0xe4c96035fb07cC0F3809c4b3CEDcf1d35c47E8E1";

const handleContractCall = async (address, key) => {
  try {
    let web3 = new Web3(window.ethereum);
    let contract = new web3.eth.Contract(
      abi,
      "0xe4c96035fb07cC0F3809c4b3CEDcf1d35c47E8E1"
    );
    console.log(contract.methods);
    const getOwner = await contract.methods
      .getOwner(address)
      .call({ from: address });
    console.log(getOwner);
    if (getOwner != 0) {
      alert("you Already Claimed your 1 NFT");
      return;
    } else {
      try {
        await contract.methods.claim(key).send({ from: address });
        alert("hurrey!!, you have claimed your NFT");
      } catch (error) {
        //alert(error)
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

window.addEventListener("load", function () {
  if (window.ethereum) {
    window.ethereum.enable();
    // detect Metamask account change
    window.ethereum.on("accountsChanged", function (accounts) {
      WalletAddress = accounts[0];
      console.log("accountsChanges", accounts);
      console.log(WalletAddress);
    });
    // detect Network account change
    window.ethereum.on("chainChanged", function (networkId) {
      if (networkId !== "0x5") {
        alert("Pls Change Network to Goerli");
      }
      console.log("networkChanged", networkId);
    });
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live"
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    // App.web3 = new Web3(
    //   new Web3.providers.HttpProvider("http://127.0.0.1:7545")
    // );
  }
});

document.getElementById("connect").addEventListener("click", (event) => {
  ethereum.request({ method: "eth_requestAccounts" }).then((accounts) => {
    WalletAddress = accounts[0];
    console.log(WalletAddress);
    let address =
      WalletAddress.slice(0, 5) +
      "..." +
      WalletAddress.slice(WalletAddress.length - 4);
    document.getElementById("connect").innerText = address;
    if (ethereum.networkVersion !== "5") {
      alert("Please Switch to Goerli network");
    }
  });
});

document.getElementById("mint").addEventListener("click", () => {
  if (WalletAddress === "") {
    alert("Please Connect your Wallet");
    return;
  } else {
    console.log("mint");
    console.log(WalletAddress);
    let val = document.querySelector("#input").value;
    console.log(val.toString());
    if (!res.includes(val)) {
      alert("pls enter valid code");
    } else {
      handleContractCall(WalletAddress, val);
    }
  }
});
