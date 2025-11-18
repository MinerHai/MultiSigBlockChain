import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  ModalBody,
  Button,
  Input,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useWalletStore } from "../stores/walletStore";
import { submitTxOnChain } from "../services/multisigService";

export default function SubmitTxModal({ isOpen, onClose, walletAddress }: any) {
  const toast = useToast();
  const { provider } = useWalletStore();

  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("0");

  const handleSubmit = async () => {
    try {
      if (!provider)
        return toast({ status: "error", title: "Chưa kết nối ví" });

      await submitTxOnChain(provider, walletAddress, to, amount);

      toast({
        status: "success",
        title: "Tạo transaction thành công!",
      });

      onClose();
    } catch (err: any) {
      toast({
        status: "error",
        title: "Gửi transaction thất bại",
        description: err.message,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tạo Transaction</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack align="stretch" spacing={3}>
            <Text>Gửi đến (address):</Text>
            <Input value={to} onChange={(e) => setTo(e.target.value)} />

            <Text>Số ETH gửi:</Text>
            <Input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Gửi
          </Button>
          <Button onClick={onClose}>Hủy</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
