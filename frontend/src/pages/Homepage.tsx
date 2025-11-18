import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  Text,
  useColorMode,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import { ArrowRight, Lock, Shield, Users, Zap } from "lucide-react";

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  const { colorMode } = useColorMode();

  return (
    <Box
      p={8}
      bg={colorMode === "dark" ? "gray.800" : "white"}
      borderRadius="lg"
      borderWidth={1}
      borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
      _hover={{
        borderColor: "blue.500",
        boxShadow: "lg",
        transform: "translateY(-4px)",
      }}
      transition="all 0.3s ease"
    >
      <Box color="blue.500" mb={4} fontSize="2xl">
        {icon}
      </Box>
      <Heading size="md" mb={2}>
        {title}
      </Heading>
      <Text color={colorMode === "dark" ? "gray.400" : "gray.600"}>
        {description}
      </Text>
    </Box>
  );
};

export default function Homepage() {
  const { colorMode } = useColorMode();
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bg={
          colorMode === "dark"
            ? "gray.900"
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        }
        py={20}
        color="white"
      >
        <Container maxW="container.lg">
          <VStack spacing={8} align="center" textAlign="center">
            <Heading
              as="h1"
              size={isMobile ? "2xl" : "3xl"}
              fontWeight="bold"
              lineHeight="1.2"
            >
              Quản lý Ví Đa Chữ Ký An Toàn
            </Heading>
            <Text fontSize={isMobile ? "md" : "lg"} maxW="2xl" opacity={0.9}>
              Quản lý tài sản kỹ thuật số của bạn với bảo mật nâng cao bằng cách
              sử dụng xác thực đa chữ ký. Tạo, quản lý và thực hiện giao dịch
              với tự tin.
            </Text>
            <HStack
              spacing={4}
              pt={4}
              flexDirection={isMobile ? "column" : "row"}
            >
              <Button
                size="lg"
                bg="white"
                color="purple.600"
                _hover={{ bg: "gray.100" }}
                rightIcon={<ArrowRight size={20} />}
                as="a"
                href="/create"
              >
                Tạo Ví
              </Button>
              <Button
                size="lg"
                variant="outline"
                borderColor="white"
                color="white"
                _hover={{ bg: "rgba(255,255,255,0.1)" }}
              >
                Tìm Hiểu Thêm
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="container.lg" py={20}>
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading size="2xl">Các Tính Năng Chính</Heading>
            <Text
              color={colorMode === "dark" ? "gray.400" : "gray.600"}
              maxW="2xl"
            >
              Mọi thứ bạn cần để quản lý an toàn nhiều chữ ký và tài sản
            </Text>
          </VStack>

          <Grid
            templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
            gap={8}
            width="full"
          >
            <FeatureCard
              icon={<Shield size={32} />}
              title="Bảo Mật Nâng Cao"
              description="Xác thực đa chữ ký đảm bảo rằng không có chìa khóa nào có thể phê duyệt giao dịch một mình, cung cấp bảo mật tối đa cho tài sản của bạn."
            />
            <FeatureCard
              icon={<Lock size={32} />}
              title="Giao Dịch An Toàn"
              description="Tất cả giao dịch được mã hóa và xác minh bởi nhiều bên trước khi thực hiện, đảm bảo tính toàn vẹn của giao dịch."
            />
            <FeatureCard
              icon={<Users size={32} />}
              title="Kiểm Soát Đa Bên"
              description="Ủy quyền phê duyệt giao dịch cho nhiều người ký, giúp tổ chức của bạn có kiểm soát tốt hơn và trách nhiệm giải trình."
            />
            <FeatureCard
              icon={<Zap size={32} />}
              title="Thực Hiện Nhanh"
              description="Quy trình phê duyệt hợp lý cho phép thực hiện giao dịch nhanh trong khi duy trì các tiêu chuẩn bảo mật."
            />
          </Grid>
        </VStack>
      </Container>

      {/* CTA Section */}
      <Box bg={colorMode === "dark" ? "gray.800" : "blue.50"} py={16}>
        <Container maxW="container.lg">
          <Flex
            direction={isMobile ? "column" : "row"}
            justify="space-between"
            align="center"
            gap={8}
          >
            <VStack align={isMobile ? "center" : "flex-start"} spacing={4}>
              <Heading size="lg">Sẵn Sàng Bắt Đầu?</Heading>
              <Text
                color={colorMode === "dark" ? "gray.400" : "gray.600"}
                maxW="md"
                textAlign={isMobile ? "center" : "left"}
              >
                Tạo ví đa chữ ký đầu tiên của bạn ngay hôm nay và trải nghiệm
                quản lý tài sản an toàn.
              </Text>
            </VStack>
            <Button
              size="lg"
              bg="blue.500"
              color="white"
              _hover={{ bg: "blue.600" }}
              rightIcon={<ArrowRight size={20} />}
              as="a"
              href="/create"
              flexShrink={0}
            >
              Tạo Ngay
            </Button>
          </Flex>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxW="container.lg" py={20}>
        <Grid
          templateColumns={isMobile ? "1fr" : "repeat(3, 1fr)"}
          gap={8}
          textAlign="center"
        >
          <VStack spacing={2}>
            <Heading size="2xl" color="blue.500">
              1000+
            </Heading>
            <Text color={colorMode === "dark" ? "gray.400" : "gray.600"}>
              Ví Hoạt Động
            </Text>
          </VStack>
          <VStack spacing={2}>
            <Heading size="2xl" color="blue.500">
              $50M+
            </Heading>
            <Text color={colorMode === "dark" ? "gray.400" : "gray.600"}>
              Tài Sản Được Bảo Vệ
            </Text>
          </VStack>
          <VStack spacing={2}>
            <Heading size="2xl" color="blue.500">
              99.9%
            </Heading>
            <Text color={colorMode === "dark" ? "gray.400" : "gray.600"}>
              Thời Gian Hoạt Động
            </Text>
          </VStack>
        </Grid>
      </Container>
    </Box>
  );
}
