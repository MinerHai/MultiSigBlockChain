import { Box, Heading, Text } from "@chakra-ui/react";
import { useWalletStore } from "../stores/walletStore";
import WalletConnectButton from "../components/WalletConnectButton";
import WalletList from "../components/WalletList";

export default function MultisigWalletPage() {
  const { address } = useWalletStore();

  return (
    <Box maxW="700px" mx="auto" mt={10}>
      <Heading size="lg" mb={6} textAlign="center" color="blue.500">
        Ví đa chữ ký
      </Heading>

      {!address && (
        <Box textAlign="center">
          <Text mb={4}>Vui lòng kết nối MetaMask</Text>
          <WalletConnectButton />
        </Box>
      )}

      {address && (
        <>
          <Box
            p={4}
            mb={6}
            bg="blue.50"
            borderRadius="md"
            border="1px solid #bfd6ff"
          >
            <Text fontWeight="bold">Ví đang kết nối:</Text>
            <Text fontFamily="mono">{address}</Text>
          </Box>

          <WalletList />
        </>
      )}
    </Box>
  );
}
