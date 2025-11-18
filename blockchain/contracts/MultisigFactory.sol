// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MultisigWallet.sol";

contract MultisigFactory {
    address[] public allWallets;

    event WalletCreated(address wallet, address creator);

    function createWallet(address[] calldata _owners, uint _required)
        external
        returns (address)
    {
        MultisigWallet wallet = new MultisigWallet(_owners, _required);
        address walletAddr = address(wallet);

        allWallets.push(walletAddr);

        emit WalletCreated(walletAddr, msg.sender);

        return walletAddr;
    }

    function getAllWallets() external view returns (address[] memory) {
        return allWallets;
    }
    function getMyWallets() external view returns (address[] memory) {
    uint count = 0;

    // Đếm ví thuộc user
    for (uint i = 0; i < allWallets.length; i++) {
        MultisigWallet w = MultisigWallet(payable(allWallets[i]));
        if (w.isOwner(msg.sender)) {
            count++;
        }
    }

    address[] memory result = new address[](count);
    uint idx = 0;

    // Lấy danh sách ví
    for (uint i = 0; i < allWallets.length; i++) {
        MultisigWallet w = MultisigWallet(payable(allWallets[i]));
        if (w.isOwner(msg.sender)) {
            result[idx] = allWallets[i];
            idx++;
        }
    }

    return result;
}

}
