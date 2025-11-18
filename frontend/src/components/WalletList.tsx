import { Box, Text, Button, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getAllWalletsOnChain } from "../services/factoryService";
import { useWalletStore } from "../stores/walletStore";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../router";

export default function WalletList() {
  const { provider, address } = useWalletStore();
  const [list, setList] = useState<{ walletAddress: string }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (provider && address) {
      load();
    }
  }, [provider, address]);

  const load = async () => {
    const data = await getAllWalletsOnChain(provider!);
    setList(data);
  };

  if (!address) return null;

  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" mb={3}>
        📌 Danh sách ví multisig đã tạo
      </Text>

      {list.length === 0 && (
        <Text color="gray.500">Chưa có ví nào được tạo.</Text>
      )}

      <VStack spacing={3} align="stretch">
        {list.map((w, idx) => (
          <Box
            key={idx}
            p={3}
            bg="white"
            borderRadius="md"
            border="1px solid #ddd"
          >
            <Text fontFamily="mono" mb={2}>
              {w.walletAddress}
            </Text>

            <Button
              size="sm"
              colorScheme="blue"
              onClick={() => navigate(ROUTES.WALLET_DETAIL(w.walletAddress))}
            >
              Xem chi tiết
            </Button>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
