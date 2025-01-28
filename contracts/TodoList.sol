// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract TodoList {
  struct Task {
    uint id;
    string description;
    bool isCompleted;
  }

  Task[] private tasks;
  mapping(uint => address) public taskOwner;
  uint private nextId;

  event TaksCreated(uint id, string description, address owner);
  event TaskCompleted(uint id);

  modifier onlyOwner(uint _id){
    require(taskOwner[_id] == msg.sender, "Not the owner of this task");
    _;
  }

  function addTask(string memory _description) public {
    tasks.push(Task(nextId, _description, false));
    taskOwner[nextId] = msg.sender;
    emit TaksCreated(nextId, _description, msg.sender);
    nextId++;
  }

  function completeTask(uint _id) public onlyOwner(_id){
    require(!tasks[_id].isCompleted, "Tasks already completed");
    tasks[_id].isCompleted = true;
    emit TaskCompleted(_id);
  }

  function getTasks() public view returns (Task[] memory){
    return tasks;
  }
}
