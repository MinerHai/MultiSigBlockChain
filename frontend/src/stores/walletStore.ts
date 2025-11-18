import { create } from "zustand";
import { ethers } from "ethers";

interface WalletState {
  address: string | null;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  isUnlocked: boolean;
  isConnecting: boolean;
  error: string | null;

  connectWallet: () => Promise<void>;
  clearWallet: () => void;
  resetError: () => void;
  initAutoDetect: () => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  address: null,
  provider: null,
  signer: null,
  isUnlocked: false,
  isConnecting: false,
  error: null,

  //----------------------------------------------------------------------
  // 🔥 1. Kết nối MetaMask — chỉ ký 1 lần duy nhất
  //----------------------------------------------------------------------
  connectWallet: async () => {
    if (!(window as any).ethereum) {
      set({ error: "Vui lòng cài MetaMask!" });
      return;
    }

    const { isConnecting } = get();
    if (isConnecting) return;

    set({ isConnecting: true, error: null });

    try {
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
        "any"
      );

      const accounts = await provider.send("eth_requestAccounts", []);

      if (!accounts || accounts.length === 0) {
        set({
          isConnecting: false,
          error: "Không lấy được tài khoản từ MetaMask.",
        });
        return;
      }

      const signer = provider.getSigner();
      const address = accounts[0];

      //* Kiểm tra signature cũ
      const savedSig = localStorage.getItem("ms_sig");
      const savedAddr = localStorage.getItem("ms_addr");

      if (!savedSig || savedAddr !== address) {
        const message = `Xác nhận đăng nhập vào ứng dụng\nĐịa chỉ: ${address}`;
        const signature = await signer.signMessage(message);

        localStorage.setItem("ms_sig", signature);
        localStorage.setItem("ms_addr", address);
      }

      set({
        address,
        provider,
        signer,
        isUnlocked: true,
        isConnecting: false,
        error: null,
      });

      console.log("Wallet connected:", address);
    } catch (error: any) {
      console.error("connectWallet error:", error);
      set({ isConnecting: false });

      if (error.code === 4001) {
        set({ error: "Bạn đã từ chối yêu cầu MetaMask." });
      } else {
        set({ error: "Lỗi không xác định khi kết nối MetaMask." });
      }
    }
  },

  //----------------------------------------------------------------------
  // 🔥 2. Auto detect — KHÔNG ký lại, tự login khi reload
  //----------------------------------------------------------------------
  initAutoDetect: () => {
    if (!(window as any).ethereum) return;

    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum,
      "any"
    );

    const savedAddr = localStorage.getItem("ms_addr");
    const savedSig = localStorage.getItem("ms_sig");

    provider.listAccounts().then((accounts) => {
      if (
        accounts.length > 0 &&
        savedAddr &&
        savedSig &&
        accounts[0].toLowerCase() === savedAddr.toLowerCase()
      ) {
        const signer = provider.getSigner();

        set({
          address: savedAddr,
          provider,
          signer,
          isUnlocked: true,
          error: null,
        });

        console.log("Auto-login successful:", savedAddr);
      }
    });

    // Nếu đổi account → logout tự động
    (window as any).ethereum.on("accountsChanged", (accounts: string[]) => {
      if (!accounts || accounts.length === 0) {
        get().clearWallet();
        return;
      }

      const current = get().address;
      if (accounts[0].toLowerCase() !== current?.toLowerCase()) {
        get().clearWallet();
      }
    });
  },

  //----------------------------------------------------------------------
  // 🔥 3. Logout
  //----------------------------------------------------------------------
  clearWallet: () => {
    localStorage.removeItem("ms_sig");
    localStorage.removeItem("ms_addr");

    set({
      address: null,
      provider: null,
      signer: null,
      isUnlocked: false,
      isConnecting: false,
      error: null,
    });

    console.log("Wallet disconnected");
  },

  resetError: () => set({ error: null }),
}));
