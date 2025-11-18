import {
  Box,
  Button,
  Heading,
  Input,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";

import {
  getWalletInfoOnChain,
  getTransactionsOnChain,
  confirmTxOnChain,
  executeTxOnChain,
  submitTxOnChain,
} from "../services/multisigService";

import { useWalletStore } from "../stores/walletStore";
import WalletConnectButton from "../components/WalletConnectButton";

// Import ABI để nghe event real-time
import WalletABI from "../abis/MultisigWallet.json";

export default function MultisigWalletDetailPage() {
  const toast = useToast();
  const { address: userWallet, provider } = useWalletStore();
  const { address } = useParams();

  const [walletAddr, setWalletAddr] = useState(address || "");
  const [info, setInfo] = useState<any>(null);
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<string>("0");

  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [isOwner, setIsOwner] = useState(false);
  const [confirmingIndex, setConfirmingIndex] = useState<number | null>(null);
  const [executingIndex, setExecutingIndex] = useState<number | null>(null);

  // Load thông tin ví
  useEffect(() => {
    if (provider && address) load(address);
  }, [provider, address]);

  const load = async (target: string) => {
    try {
      setLoading(true);

      const i = await getWalletInfoOnChain(provider!, target);
      const t = await getTransactionsOnChain(provider!, target);
      const balWei = await provider!.getBalance(target);

      setInfo(i);
      setTxs(t);
      setBalance(ethers.utils.formatEther(balWei));

      const ownerLower = i.owners.map((o: string) => o.toLowerCase());
      const walletLower = userWallet?.toLowerCase() || "";
      setIsOwner(ownerLower.includes(walletLower));
    } catch (err: any) {
      toast({
        status: "error",
        title: "Không tải được ví",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Realtime Event Listener
  useEffect(() => {
    if (!provider || !walletAddr) return;

    const contract = new ethers.Contract(walletAddr, WalletABI.abi, provider);

    const update = () => {
      console.log("🔄 Event detected → Reloading...");
      load(walletAddr);
    };

    contract.on("SubmitTransaction", update);
    contract.on("ConfirmTransaction", update);
    contract.on("ExecuteTransaction", update);

    return () => {
      contract.removeAllListeners("SubmitTransaction");
      contract.removeAllListeners("ConfirmTransaction");
      contract.removeAllListeners("ExecuteTransaction");
    };
  }, [provider, walletAddr]);

  // Tạo transaction
  const handleCreateTx = async () => {
    try {
      if (!isOwner)
        return toast({ status: "error", title: "Bạn không phải owner" });

      if (!ethers.utils.isAddress(to))
        return toast({ status: "error", title: "Địa chỉ không hợp lệ" });

      if (!amount || Number(amount) <= 0)
        return toast({ status: "error", title: "Số tiền không hợp lệ" });

      setSubmitting(true);

      await submitTxOnChain(provider!, walletAddr, to, amount);

      toast({ status: "success", title: "Tạo transaction thành công!" });

      await load(walletAddr);

      setTo("");
      setAmount("");
    } catch (err: any) {
      toast({
        status: "error",
        title: "Không thể tạo transaction",
        description: err.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Confirm TX
  const handleConfirm = async (idx: number) => {
    if (!isOwner)
      return toast({ status: "error", title: "Bạn không phải owner" });

    try {
      setConfirmingIndex(idx);

      await confirmTxOnChain(provider!, walletAddr, idx);

      toast({ status: "success", title: "Confirm thành công!" });
      await load(walletAddr);
    } catch (err: any) {
      toast({
        status: "error",
        title: "Không confirm được",
        description: err.message,
      });
    } finally {
      setConfirmingIndex(null);
    }
  };

  // Execute TX
  const handleExecute = async (idx: number) => {
    if (!isOwner)
      return toast({ status: "error", title: "Bạn không phải owner" });

    try {
      setExecutingIndex(idx);

      await executeTxOnChain(provider!, walletAddr, idx);

      toast({ status: "success", title: "Execute thành công!" });
      await load(walletAddr);
    } catch (err: any) {
      toast({
        status: "error",
        title: "Không execute được",
        description: err.message,
      });
    } finally {
      setExecutingIndex(null);
    }
  };

  // Chia transactions
  const pendingTxs = txs.filter((tx) => !tx.executed);
  const executedTxs = txs.filter((tx) => tx.executed);

  return (
    <Box maxW="700px" mx="auto" mt={10}>
      <Heading size="lg" mb={6} textAlign="center" color="blue.500">
        Chi tiết ví multisig
      </Heading>

      {!userWallet && (
        <Box textAlign="center">
          <Text mb={4}>Vui lòng kết nối MetaMask</Text>
          <WalletConnectButton />
        </Box>
      )}

      {userWallet && (
        <VStack spacing={4} align="stretch">
          <Input
            placeholder="Nhập địa chỉ ví..."
            value={walletAddr}
            onChange={(e) => setWalletAddr(e.target.value)}
          />

          <Button
            colorScheme="blue"
            onClick={() => load(walletAddr)}
            isLoading={loading}
          >
            Tải thông tin ví
          </Button>

          {info && (
            <Box p={4} bg="gray.50" borderRadius="md">
              <Text>
                <b>Required:</b> {info.required}
              </Text>
              <Text>
                <b>Balance:</b> {balance} VOLTA
              </Text>

              <Text mt={3} fontWeight="bold">
                Owners:
              </Text>
              {info.owners.map((o: string, i: number) => (
                <Text key={i} fontFamily="mono">
                  {o}
                </Text>
              ))}

              <Box mt={3}>
                <b>Bạn là Owner?</b>{" "}
                {isOwner ? (
                  <span style={{ color: "green" }}>✔ YES</span>
                ) : (
                  <span style={{ color: "red" }}>❌ NO</span>
                )}
              </Box>
            </Box>
          )}

          {/* CREATE TX */}
          <Box
            p={4}
            bg="white"
            borderRadius="md"
            shadow="sm"
            border="1px solid #eee"
          >
            <Heading size="md" mb={3} color="blue.600">
              Tạo Transaction mới
            </Heading>

            <VStack spacing={3} align="stretch">
              <Input
                placeholder="Address người nhận"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />

              <Input
                placeholder="Số tiền (ETH/VOLTA)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <Button
                colorScheme="blue"
                isLoading={submitting}
                isDisabled={!isOwner}
                onClick={handleCreateTx}
              >
                Submit Transaction
              </Button>
            </VStack>
          </Box>

          {/* PENDING TRANSACTIONS */}
          {pendingTxs.length > 0 && (
            <Box>
              <Heading size="md" mt={5} mb={3}>
                Transactions
              </Heading>

              {pendingTxs.map((tx, i) => {
                const confirms = Number(tx.numConfirmations);
                const required = info.required;
                const ready = confirms >= required;

                return (
                  <Box
                    key={i}
                    p={3}
                    mb={3}
                    borderRadius="md"
                    border="1px solid #ddd"
                  >
                    <Text>
                      <b>To:</b> {tx.to}
                    </Text>
                    <Text>
                      <b>Value:</b> {ethers.utils.formatEther(tx.value)} VOLTA
                    </Text>

                    {/* STATUS */}
                    <Box mt={2}>
                      {ready ? (
                        <Text fontWeight="bold" color="orange.500">
                          🔥 Ready to Execute
                        </Text>
                      ) : confirms > 0 ? (
                        <Text fontWeight="bold" color="blue.500">
                          ⏳ Waiting ({confirms}/{required})
                        </Text>
                      ) : (
                        <Text fontWeight="bold" color="gray.500">
                          🕓 Pending (0/{required})
                        </Text>
                      )}
                    </Box>

                    {/* PROGRESS BAR */}
                    <Box mt={2} bg="gray.200" h="6px" borderRadius="md">
                      <Box
                        h="6px"
                        borderRadius="md"
                        bg="blue.400"
                        width={`${(confirms / required) * 100}%`}
                      ></Box>
                    </Box>

                    <VStack align="start" mt={3}>
                      {/* Confirm */}
                      {confirms < required && (
                        <Button
                          size="sm"
                          colorScheme="blue"
                          isDisabled={!isOwner || confirmingIndex === tx.index}
                          isLoading={confirmingIndex === tx.index}
                          onClick={() => handleConfirm(tx.index)}
                        >
                          {confirmingIndex === tx.index
                            ? "Confirming..."
                            : "Confirm"}
                        </Button>
                      )}

                      {/* Execute */}
                      {ready && (
                        <Button
                          size="sm"
                          colorScheme="green"
                          isDisabled={!isOwner || executingIndex === tx.index}
                          isLoading={executingIndex === tx.index}
                          onClick={() => handleExecute(tx.index)}
                        >
                          {executingIndex === tx.index
                            ? "Executing..."
                            : "Execute"}
                        </Button>
                      )}
                    </VStack>
                  </Box>
                );
              })}
            </Box>
          )}

          {/* EXECUTED HISTORY */}
          {executedTxs.length > 0 && (
            <Box mt={10}>
              <Heading size="md" mb={3} color="green.600">
                Lịch sử giao dịch (Executed)
              </Heading>

              {executedTxs.map((tx, i) => (
                <Box
                  key={i}
                  p={3}
                  mb={3}
                  borderRadius="md"
                  border="1px solid #ddd"
                  bg="green.50"
                >
                  <Text>
                    <b>To:</b> {tx.to}
                  </Text>
                  <Text>
                    <b>Value:</b> {ethers.utils.formatEther(tx.value)} VOLTA
                  </Text>

                  <Text mt={1} color="green.700" fontWeight="bold">
                    ✔ Đã Execute
                  </Text>
                </Box>
              ))}
            </Box>
          )}
        </VStack>
      )}
    </Box>
  );
}
