import {
  Box,
  Flex,
  useColorMode,
  Button,
  HStack,
  Container,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
  useMediaQuery,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import { Moon, Sun, Menu } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useWalletStore } from "../stores/walletStore";
import { ROUTES } from "../router";

export default function Layout() {
  const { colorMode, toggleColorMode } = useColorMode();
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  // Wallet Store
  const address = useWalletStore((s) => s.address);
  const clearWallet = useWalletStore((s) => s.clearWallet);
  const initAutoDetect = useWalletStore((s) => s.initAutoDetect);

  // Modal Logout
  const {
    isOpen: isLogoutOpen,
    onOpen: onLogoutOpen,
    onClose: onLogoutClose,
  } = useDisclosure();

  // Auto detect once
  useEffect(() => {
    initAutoDetect();
  }, []);

  const formatAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const navItems = [
    { label: "Trang chủ", href: ROUTES.HOME },
    { label: "Ví", href: ROUTES.WALLETS },
    { label: "Tạo mới", href: ROUTES.CREATE },
    { label: "Hướng dẫn", href: ROUTES.GUIDES },
  ];

  return (
    <Flex
      direction="column"
      minH="100vh"
      bg={colorMode === "dark" ? "gray.900" : "gray.50"}
    >
      {/* Header */}
      <Box
        as="header"
        bg={colorMode === "dark" ? "gray.800" : "white"}
        borderBottomWidth={1}
        borderBottomColor={colorMode === "dark" ? "gray.700" : "gray.200"}
        py={4}
        position="sticky"
        top={0}
        zIndex={100}
        boxShadow="sm"
      >
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            {/* Logo */}
            <Box fontWeight="bold" fontSize="xl" color="blue.500">
              MultiSig Wallet
            </Box>

            {/* Desktop Nav */}
            {!isMobile && (
              <HStack spacing={8}>
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    as="a"
                    href={item.href}
                    _hover={{
                      color: "blue.500",
                      bg: colorMode === "dark" ? "gray.700" : "gray.100",
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </HStack>
            )}

            {/* Right Actions */}
            <HStack spacing={4}>
              {/* Hiển thị địa chỉ ví */}
              {address && (
                <HStack
                  spacing={2}
                  bg="blue.50"
                  px={3}
                  py={1}
                  borderRadius="full"
                  border="1px solid #bfd6ff"
                >
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                    alt="MetaMask"
                    boxSize="22px"
                  />
                  <Text fontSize="sm" color="blue.700" fontWeight="medium">
                    {formatAddress(address)}
                  </Text>

                  <Button
                    size="xs"
                    colorScheme="red"
                    variant="ghost"
                    onClick={onLogoutOpen}
                  >
                    Đăng xuất
                  </Button>
                </HStack>
              )}

              {/* Toggle theme */}
              <Button
                onClick={toggleColorMode}
                variant="ghost"
                size="lg"
                aria-label="Toggle theme"
              >
                {colorMode === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </Button>

              {/* Mobile menu */}
              {isMobile && (
                <Button
                  ref={btnRef}
                  onClick={onDrawerOpen}
                  variant="ghost"
                  size="lg"
                  aria-label="Open menu"
                >
                  <Menu size={20} />
                </Button>
              )}
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        placement="right"
        onClose={onDrawerClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent bg={colorMode === "dark" ? "gray.800" : "white"}>
          <DrawerCloseButton />
          <DrawerBody>
            <VStack spacing={4} mt={8}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  as="a"
                  href={item.href}
                  width="full"
                  justifyContent="flex-start"
                  onClick={onDrawerClose}
                  _hover={{
                    color: "blue.500",
                    bg: colorMode === "dark" ? "gray.700" : "gray.100",
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Box flex={1} as="main">
        <Outlet />
      </Box>

      {/* Footer */}
      <Box
        as="footer"
        bg={colorMode === "dark" ? "gray.800" : "white"}
        borderTopWidth={1}
        borderTopColor={colorMode === "dark" ? "gray.700" : "gray.200"}
        py={8}
        mt={12}
      >
        <Container maxW="container.xl">
          <Flex
            justify="space-between"
            align="center"
            direction={isMobile ? "column" : "row"}
            gap={4}
          >
            <Box>
              <Box fontWeight="bold" fontSize="lg" color="blue.500" mb={2}>
                MultiSig Wallet
              </Box>
              <Box fontSize="sm" color="gray.500">
                Quản lý Ví Đa Chữ Ký An Toàn
              </Box>
            </Box>
            <HStack spacing={8} fontSize="sm" color="gray.500">
              <Box as="a" href="#" _hover={{ color: "blue.500" }}>
                Điều khoản
              </Box>
              <Box as="a" href="#" _hover={{ color: "blue.500" }}>
                Bảo mật
              </Box>
              <Box as="a" href="#" _hover={{ color: "blue.500" }}>
                Liên hệ
              </Box>
            </HStack>
          </Flex>
          <Box
            textAlign="center"
            mt={6}
            pt={6}
            borderTopWidth={1}
            borderTopColor={colorMode === "dark" ? "gray.700" : "gray.200"}
            fontSize="sm"
            color="gray.500"
          >
            © 2025 MultiSig Wallet. Bảo lưu mọi quyền.
          </Box>
        </Container>
      </Box>

      {/* Logout Modal */}
      <Modal isOpen={isLogoutOpen} onClose={onLogoutClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Xác nhận đăng xuất</ModalHeader>
          <ModalBody>Bạn có chắc muốn đăng xuất khỏi MetaMask?</ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onLogoutClose}>
              Hủy
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                clearWallet();
                onLogoutClose();
              }}
            >
              Đăng xuất
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
