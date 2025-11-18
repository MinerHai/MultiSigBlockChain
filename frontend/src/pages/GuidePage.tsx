import {
  Box,
  Heading,
  Text,
  VStack,
  Code,
  Button,
  Link,
  Divider,
} from "@chakra-ui/react";

export default function GuidePage() {
  const voltaChain = {
    chainId: "0x12047", // 73799
    chainName: "EnergyWeb Volta Testnet",
    nativeCurrency: {
      name: "Volta",
      symbol: "VT",
      decimals: 18,
    },
    rpcUrls: ["https://volta-rpc.energyweb.org"],
    blockExplorerUrls: ["https://volta-explorer.energyweb.org"],
  };

  const addVoltaNetwork = async () => {
    try {
      if (!window.ethereum) {
        alert("Vui lòng cài MetaMask trước!");
        return;
      }

      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [voltaChain],
      });

      alert("Đã thêm mạng Volta thành công!");
    } catch (err) {
      console.error(err);
      alert("Không thể thêm mạng, vui lòng thử lại!");
    }
  };

  return (
    <Box maxW="800px" mx="auto" mt={10} p={5}>
      <Heading size="lg" mb={6} textAlign="center" color="blue.500">
        Hướng Dẫn Sử Dụng Ví Multisig
      </Heading>

      <VStack align="stretch" spacing={8}>
        {/* Step 1 */}
        <Box>
          <Heading size="md" mb={3}>
            1️⃣ Cài đặt MetaMask
          </Heading>
          <Text>
            MetaMask là ví Web3 giúp bạn tương tác với blockchain Volta. Tải
            tại:
          </Text>
          <Link
            href="https://metamask.io/download/"
            color="blue.500"
            isExternal
          >
            👉 https://metamask.io/download/
          </Link>
        </Box>

        <Divider />

        {/* Step 2 */}
        <Box>
          <Heading size="md" mb={3}>
            2️⃣ Thêm mạng Volta Testnet vào MetaMask
          </Heading>

          <Text>Nhấn nút sau để tự động thêm mạng:</Text>

          <Button colorScheme="blue" mt={3} onClick={addVoltaNetwork}>
            Thêm Mạng Volta vào MetaMask
          </Button>

          <Text mt={4}>Hoặc tự thêm thủ công:</Text>

          <VStack mt={3} bg="gray.50" p={4} borderRadius="md" align="stretch">
            <Text>
              <b>Network Name:</b> EnergyWeb Volta Testnet
            </Text>
            <Text>
              <b>RPC URL:</b> <Code>https://volta-rpc.energyweb.org</Code>
            </Text>
            <Text>
              <b>Chain ID:</b> 73799
            </Text>
            <Text>
              <b>Symbol:</b> VT
            </Text>
            <Text>
              <b>Explorer:</b> <Code>https://volta-explorer.energyweb.org</Code>
            </Text>
          </VStack>
        </Box>

        <Divider />

        {/* Step 3 */}
        <Box>
          <Heading size="md" mb={3}>
            3️⃣ Nhận token thử nghiệm (Volta Token - VT)
          </Heading>

          <Text>
            Volta Token (VT) là token test để bạn dùng gửi transaction trên mạng
            Volta.
          </Text>

          <Text mt={3}>Truy cập faucet chính thức:</Text>

          <Link
            href="https://voltafaucet.energyweb.org/"
            color="blue.500"
            isExternal
          >
            👉 https://voltafaucet.energyweb.org/
          </Link>

          <Text mt={3}>
            Sau đó dán địa chỉ ví MetaMask của bạn và bấm <b>Request Tokens</b>.
          </Text>
        </Box>

        <Divider />

        {/* Step 4 */}
        <Box>
          <Heading size="md" mb={3}>
            4️⃣ Hoàn tất 🎉
          </Heading>

          <Text>
            Sau khi đã có MetaMask + mạng Volta + token VT, bạn có thể sử dụng
            đầy đủ chức năng của ví Multisig.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}
