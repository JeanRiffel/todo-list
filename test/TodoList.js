const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TodoList", function () {
  let TodoList;
  let todoList;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get the signers (accounts) to use in tests
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract before each test
    TodoList = await ethers.getContractFactory("TodoList");
    todoList = await TodoList.deploy();
  });

  describe("Task creation", function () {
    it("should allow users to add tasks", async function () {
      await todoList.addTask("Task 1");
      const tasks = await todoList.getTasks();

      // Check the number of tasks
      expect(tasks.length).to.equal(1);

      // Check the task details
      const task = tasks[0];
      expect(task.id).to.equal(0);
      expect(task.description).to.equal("Task 1");
      expect(task.isCompleted).to.equal(false);
    });

    it("should emit TaskCreated event on task addition", async function () {
      await expect(todoList.addTask("New Task"))
        .to.emit(todoList, "TaksCreated")
        .withArgs(0, "New Task", owner.address);
    });
  });

  describe("Task completion", function () {
    beforeEach(async function () {
      await todoList.addTask("Task 1");
    });

    it("should allow the task owner to mark a task as completed", async function () {
      await todoList.completeTask(0);
      const tasks = await todoList.getTasks();
      expect(tasks[0].isCompleted).to.equal(true);
    });

    it("should not allow non-owners to mark a task as completed", async function () {
      await expect(todoList.connect(addr1).completeTask(0))
        .to.be.revertedWith("Not the owner of this task");
    });

    it("should not allow marking a task as completed twice", async function () {
      await todoList.completeTask(0);
      await expect(todoList.completeTask(0))
        .to.be.revertedWith("Tasks already completed");
    });

    it("should emit TaskCompleted event when task is completed", async function () {
      await expect(todoList.completeTask(0))
        .to.emit(todoList, "TaskCompleted")
        .withArgs(0);
    });
  });

  describe("Task ownership", function () {
    it("should associate tasks with the correct owner", async function () {
      await todoList.addTask("Task 1");
      const ownerOfTask = await todoList.taskOwner(0);
      expect(ownerOfTask).to.equal(owner.address);
    });
  });
});
