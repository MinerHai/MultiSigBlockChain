import { ethers } from "ethers";
import factoryAbi from "../abis/MultisigFactory.json";

export const FACTORY_ADDRESS = "0xa6191fa16921F3d7FfC5FB7a1054E98Ed573c159"; // <<< UPDATE

export async function getAllWalletsOnChain(
  provider: ethers.providers.Web3Provider
) {
  const factory = new ethers.Contract(
    FACTORY_ADDRESS,
    factoryAbi.abi,
    provider
  );
  const wallets: string[] = await factory.getAllWallets();

  return wallets.map((w) => ({
    walletAddress: w,
  }));
}
