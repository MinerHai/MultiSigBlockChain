import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  HStack,
  Image,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useWalletStore } from "../stores/walletStore";

export default function WalletConnectButton() {
  const { address, isConnecting, error, connectWallet } = useWalletStore();

  const formatAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <Box>
      {/* ĐÃ KẾT NỐI */}
      {address ? (
        <HStack
          bg="blue.50"
          color="blue.600"
          p={3}
          borderRadius="lg"
          border="1px solid"
          borderColor="blue.200"
          spacing={2}
          fontSize="sm"
        >
          <Box w={3} h={3} bg="green.400" borderRadius="full" />
          <Text>
            Đã kết nối: <strong>{formatAddress(address)}</strong>
          </Text>
        </HStack>
      ) : (
        /* CHƯA KẾT NỐI */
        <VStack spacing={3} align="stretch">
          <Button
            onClick={connectWallet}
            isLoading={isConnecting}
            loadingText="Đang kết nối..."
            colorScheme="orange"
            size="md"
            leftIcon={
              isConnecting ? (
                <Spinner size="sm" />
              ) : (
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                  alt="MetaMask"
                  boxSize="18px"
                />
              )
            }
          >
            Kết nối MetaMask
          </Button>

          {/* Lỗi */}
          {error && (
            <Alert status="error" borderRadius="md" fontSize="sm">
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </VStack>
      )}
    </Box>
  );
}
