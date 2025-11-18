import { ethers } from "ethers";
import FactoryABI from "../abis/MultisigFactory.json";

export const FACTORY_ADDRESS = "0xa6191fa16921F3d7FfC5FB7a1054E98Ed573c159"; // contract đã deploy

export const getFactoryContract = (provider: ethers.providers.Web3Provider) => {
  const signer = provider.getSigner();
  return new ethers.Contract(FACTORY_ADDRESS, FactoryABI.abi, signer);
};
