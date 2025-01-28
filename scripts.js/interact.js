const { ethers } = require("hardhat");

async function main() {
    const contractAddress = "0xA2aa6b602C2717c28Ff0c891650ae2b3DB1939b3";
    const TodoList = await ethers.getContractFactory("TodoList");
    const todoList = await TodoList.attach(contractAddress);

    // 1. Add a new task
    console.log("Adding a new task...");
    let tx = await todoList.addTask("Finish Hardhat Project");
    await tx.wait();
    console.log("Task added!");

    // 2. Fetch all tasks
    console.log("Fetching all tasks...");
    const tasks = await todoList.getTasks();
    console.log("Current Tasks:", tasks);

    // 3. Complete a task
    if (tasks.length > 0) {
        console.log("Completing the first task...");
        tx = await todoList.completeTask(0); // Mark task ID 0 as completed
        await tx.wait();
        console.log("Task completed!");
    }

    // 4. Fetch all tasks again to see the update
    const updatedTasks = await todoList.getTasks();
    console.log("Updated Tasks:", updatedTasks);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
