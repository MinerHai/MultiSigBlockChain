async function main() {
  const Factory = await ethers.getContractFactory("MultisigFactory");
  const factory = await Factory.deploy();

  // CHỈ dùng .deployed() với ethers v5
  await factory.deployed();

  console.log("MultisigFactory deployed at:", factory.address);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
