import { ethers } from "ethers";
import WalletABI from "../abis/MultisigWallet.json";

export const getMultisigWalletContract = (
  provider: ethers.providers.Web3Provider,
  walletAddress: string
) => {
  const signer = provider.getSigner();
  return new ethers.Contract(walletAddress, WalletABI.abi, signer);
};
