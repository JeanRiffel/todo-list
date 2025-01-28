const hre = require("hardhat");

async function main() {
  const TodoList = await hre.ethers.getContractFactory("TodoList");
  const todoList = await TodoList.deploy();

  await todoList.waitForDeployment();

  console.log("Contract deployed to:", todoList.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
