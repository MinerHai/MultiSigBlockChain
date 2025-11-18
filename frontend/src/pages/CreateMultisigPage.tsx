import {
  Box,
  Button,
  Heading,
  Input,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useWalletStore } from "../stores/walletStore";
import WalletConnectButton from "../components/WalletConnectButton";
import { createMultisigOnChain } from "../services/multisigService";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../router";

export default function CreateMultisigPage() {
  const toast = useToast();
  const navigate = useNavigate();

  const { provider, address } = useWalletStore();

  // ✓ Danh sách owners: mặc định chứa địa chỉ đang đăng nhập
  const [owners, setOwners] = useState<string[]>([]);
  const [required, setRequired] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdWallet, setCreatedWallet] = useState("");

  useEffect(() => {
    if (address) setOwners([address]); // owner đầu tiên = wallet đang connect
  }, [address]);

  const formatAddr = (a: string) => `${a.slice(0, 6)}...${a.slice(-4)}`;

  const addOwner = () => {
    setOwners([...owners, ""]);
  };

  const updateOwner = (index: number, value: string) => {
    const newList = [...owners];
    newList[index] = value;
    setOwners(newList);
  };

  const removeOwner = (index: number) => {
    if (index === 0) return; // Không cho xóa chính mình
    const newList = owners.filter((_, i) => i !== index);
    setOwners(newList);

    if (required > newList.length) setRequired(newList.length);
  };

  const isValidAddress = (addr: string) => /^0x[a-fA-F0-9]{40}$/.test(addr);

  const handleCreate = async () => {
    if (!provider) return;

    try {
      setIsSubmitting(true);

      for (let o of owners) {
        if (!isValidAddress(o)) {
          toast({
            status: "error",
            title: "Địa chỉ owner không hợp lệ",
            description: `${o} không phải địa chỉ ví.`,
          });
          return;
        }
      }

      if (required < 1 || required > owners.length) {
        toast({
          status: "error",
          title: "Giá trị required không hợp lệ",
          description: "Required phải ≥ 1 và ≤ số lượng owner",
        });
        return;
      }

      const result = await createMultisigOnChain(
        provider,
        owners,
        Number(required)
      );

      setCreatedWallet(result.walletAddress);

      toast({
        status: "success",
        title: "Tạo ví multisig thành công!",
      });
    } catch (err: any) {
      toast({
        status: "error",
        title: "Không thể tạo ví",
        description: err?.message || "Lỗi không xác định",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      maxW="600px"
      mx="auto"
      mt={10}
      p={6}
      bg="white"
      borderRadius="lg"
      boxShadow="md"
    >
      <Heading size="lg" mb={6} textAlign="center" color="blue.500">
        Tạo Ví Đa Chữ Ký (MultiSig Wallet)
      </Heading>

      {/* Nếu chưa kết nối ví */}
      {!address && (
        <Box textAlign="center">
          <Text mb={4} color="gray.600">
            Vui lòng kết nối MetaMask để tiếp tục.
          </Text>
          <WalletConnectButton />
        </Box>
      )}

      {/* Nếu đã kết nối ví */}
      {address && (
        <>
          <Box
            mb={6}
            p={4}
            borderRadius="md"
            bg="blue.50"
            border="1px solid #bfd6ff"
          >
            <Text fontWeight="semibold" color="blue.700" mb={1}>
              Ví đang kết nối:
            </Text>
            <Text fontFamily="mono" color="blue.900">
              {formatAddr(address)}
            </Text>
          </Box>

          {/* Form multisig */}
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Danh sách Owner</FormLabel>

              <VStack spacing={3} align="stretch">
                {owners.map((o, idx) => (
                  <HStack key={idx}>
                    <Input
                      value={o}
                      onChange={(e) => updateOwner(idx, e.target.value)}
                      isDisabled={idx === 0}
                      bg={idx === 0 ? "gray.100" : "white"}
                    />
                    {idx !== 0 && (
                      <IconButton
                        icon={<Trash2 size={16} />}
                        aria-label="remove owner"
                        size="sm"
                        onClick={() => removeOwner(idx)}
                      />
                    )}
                  </HStack>
                ))}

                <Button
                  leftIcon={<Plus size={16} />}
                  onClick={addOwner}
                  colorScheme="blue"
                  variant="outline"
                >
                  Thêm Owner
                </Button>
              </VStack>
            </FormControl>

            <FormControl>
              <FormLabel>Số chữ ký cần thiết (Required)</FormLabel>
              <NumberInput
                min={1}
                max={owners.length}
                value={required}
                onChange={(value) => setRequired(Number(value))}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <Button
              colorScheme="blue"
              size="lg"
              onClick={handleCreate}
              isLoading={isSubmitting}
            >
              Tạo Ví Multisig
            </Button>

            {createdWallet && (
              <Box
                mt={4}
                p={3}
                bg="gray.50"
                borderRadius="md"
                border="1px solid #ddd"
              >
                <Text fontWeight="semibold">🎉 Ví đã tạo thành công:</Text>
                <Text fontFamily="mono">{createdWallet}</Text>

                <Button
                  mt={3}
                  variant="outline"
                  colorScheme="blue"
                  onClick={() => navigate(ROUTES.WALLET)}
                >
                  Xem danh sách ví
                </Button>
              </Box>
            )}
          </VStack>
        </>
      )}
    </Box>
  );
}
