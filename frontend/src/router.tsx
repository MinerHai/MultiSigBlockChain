import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Homepage from "./pages/Homepage";
import CreateMultisigPage from "./pages/CreateMultisigPage";
import MultisigWalletPage from "./pages/MultisigWalletPage"; // list
import MultisigWalletDetailPage from "./pages/MultisigWalletDetailPage"; // detail
import GuidePage from "./pages/GuidePage";

export const ROUTES = {
  HOME: "/",
  WALLETS: "/wallets",
  WALLET_DETAIL: (addr: string) => `/wallets/${addr}`,
  CREATE: "/create",
  GUIDES: "/guides",
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Homepage /> },

      // Trang danh sách ví
      {
        path: ROUTES.WALLETS,
        element: <MultisigWalletPage />,
      },

      // Trang detail 1 ví
      {
        path: "/wallets/:address",
        element: <MultisigWalletDetailPage />,
      },

      {
        path: ROUTES.CREATE,
        element: <CreateMultisigPage />,
      },
      {
        path: ROUTES.GUIDES,
        element: <GuidePage />,
      },
    ],
  },
]);

export default router;
