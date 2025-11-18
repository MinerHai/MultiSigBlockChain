import { ethers } from "ethers";
import { getFactoryContract } from "../utils/multisigFactoryProvider";
import { getMultisigWalletContract } from "../utils/multisigWalletProvider";

/* -------------------------------------------------------
   1. TẠO MULTISIG WALLET
------------------------------------------------------- */
export const createMultisigOnChain = async (
  provider: ethers.providers.Web3Provider,
  owners: string[],
  required: number
): Promise<{
  txHash: string;
  walletAddress: string;
}> => {
  try {
    const contract = getFactoryContract(provider);

    const tx = await contract.createWallet(owners, required);
    const receipt = await tx.wait();

    const event = receipt.events?.find((e: any) => e.event === "WalletCreated");
    const walletAddress = event?.args?.wallet;

    if (!walletAddress) {
      throw new Error("Cannot detect wallet address from event!");
    }

    return {
      txHash: receipt.transactionHash,
      walletAddress,
    };
  } catch (err: any) {
    console.error("❌ createMultisigOnChain error:", err);
    throw new Error(err.reason || err.message || "Create multisig failed");
  }
};

/* -------------------------------------------------------
   2. LẤY THÔNG TIN MULTISIG WALLET (owners, required)
------------------------------------------------------- */
export const getWalletInfoOnChain = async (
  provider: ethers.providers.Web3Provider,
  walletAddress: string
): Promise<{
  owners: string[];
  required: number;
}> => {
  try {
    const contract = getMultisigWalletContract(provider, walletAddress);

    const owners = await contract.getOwners();
    const required = await contract.required();

    return {
      owners,
      required: required.toNumber(),
    };
  } catch (err: any) {
    console.error("❌ getWalletInfoOnChain error:", err);
    throw new Error("Cannot load multisig info");
  }
};

/* -------------------------------------------------------
   3. LẤY DANH SÁCH TRANSACTIONS
------------------------------------------------------- */
export const getTransactionsOnChain = async (
  provider: ethers.providers.Web3Provider,
  walletAddress: string
) => {
  try {
    const contract = getMultisigWalletContract(provider, walletAddress);

    const lengthBN = await contract.getTransactionCount();
    const length = Number(lengthBN.toString());

    let list: any[] = [];

    for (let i = 0; i < length; i++) {
      const tx = await contract.transactions(i);

      list.push({
        index: i,
        to: tx.to,
        value: tx.value.toString(),
        executed: tx.executed,
        numConfirmations: tx.numConfirmations.toString(),
      });
    }

    return list;
  } catch (err: any) {
    console.error("❌ getTransactionsOnChain error:", err);
    throw new Error("Cannot load transactions");
  }
};

/* -------------------------------------------------------
   4. SUBMIT TRANSACTION
------------------------------------------------------- */
export const submitTxOnChain = async (
  provider: ethers.providers.Web3Provider,
  walletAddress: string,
  to: string,
  amountEth: string,
  data?: string
): Promise<string> => {
  try {
    const contract = getMultisigWalletContract(provider, walletAddress);

    const valueWei = ethers.utils.parseEther(amountEth || "0");

    const finalData = data && data.trim() !== "" ? data : "0x";

    const tx = await contract.submitTransaction(to, valueWei, finalData);
    const receipt = await tx.wait();

    return receipt.transactionHash;
  } catch (err: any) {
    console.error("❌ submitTxOnChain:", err);
    throw new Error(err.reason || err.message || "Submit transaction failed");
  }
};

/* -------------------------------------------------------
   5. CONFIRM TRANSACTION
------------------------------------------------------- */
export const confirmTxOnChain = async (
  provider: ethers.providers.Web3Provider,
  walletAddress: string,
  txIndex: number
): Promise<string> => {
  try {
    const contract = getMultisigWalletContract(provider, walletAddress);

    const tx = await contract.confirmTransaction(txIndex);
    const receipt = await tx.wait();

    return receipt.transactionHash;
  } catch (err: any) {
    console.error("❌ confirmTxOnChain error:", err);
    throw new Error(err.reason || err.message || "Confirm transaction failed");
  }
};

/* -------------------------------------------------------
   6. EXECUTE TRANSACTION
------------------------------------------------------- */
export const executeTxOnChain = async (
  provider: ethers.providers.Web3Provider,
  walletAddress: string,
  txIndex: number
): Promise<string> => {
  try {
    const contract = getMultisigWalletContract(provider, walletAddress);

    const tx = await contract.executeTransaction(txIndex);
    const receipt = await tx.wait();

    return receipt.transactionHash;
  } catch (err: any) {
    console.error("❌ executeTxOnChain error:", err);
    throw new Error(err.reason || err.message || "Execute transaction failed");
  }
};
