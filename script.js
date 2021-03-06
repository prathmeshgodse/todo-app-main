"use strict";

//Declarations

const btnThemeSwitch = document.querySelector(".btn-dark-light-mode-switch");
const themedElements = [...document.querySelectorAll(".dark")];
const btnCheckBoxes = [...document.querySelectorAll(".check-box-border")];
const inputNewToDoTask = document.querySelector(".new-task-text");
const taskListContainer = document.querySelector(".task-list");
const btnTaskStates = document.querySelectorAll(".task-state");
const btnRemoveCompleted = document.querySelector(".clear-tasks");
const labelRemainingTaskCount = document.querySelector(".task-summary");

//
const toDoItems = [];
let theme = "dark";
const taskItems = [...taskListContainer.querySelectorAll(".task-item")];
//
//
//Functions
function switchTheme() {
  console.log("switched Theme");
  if (btnThemeSwitch.classList.contains("dark")) {
    //switch to light theme
    btnThemeSwitch.classList.add("light");
    btnThemeSwitch.classList.remove("dark");
    btnThemeSwitch.firstElementChild.setAttribute(
      "src",
      "images/icon-moon.svg"
    );
    themedElements.forEach((element) => {
      element.classList.add("light");
      element.classList.remove("dark");
    });
    theme = "light";
  } else {
    btnThemeSwitch.classList.add("dark");
    btnThemeSwitch.classList.remove("light");
    btnThemeSwitch.firstElementChild.setAttribute("src", "images/icon-sun.svg");
    themedElements.forEach((element) => {
      element.classList.add("dark");
      element.classList.remove("light");
    });
    theme = "dark";
  }
}

function toggleCompletion() {
  if (this.classList.contains("completed")) {
    this.classList.remove("completed");
  } else {
    this.classList.add("completed");
  }
  updateTaskSummary();
}

function addNewToDoTask(e) {
  if (e.keyCode === 13) {
    if (inputNewToDoTask.value !== "") {
      toDoItems.push(inputNewToDoTask.value);
      updateTaskList(inputNewToDoTask.value);
      inputNewToDoTask.value = "";
    }
    // console.log(toDoItems);
  }
}

function updateTaskList(taskText) {
  const itemNumber = toDoItems.length;
  const html = `
  <li class="task-item ${theme} draggable" id="task-number-${itemNumber}" draggable="true">
              <div class="check-box-border">
                <div class="check-box ${theme}">
                  <img class="check-mark" src="images/icon-check.svg" alt="" />
                </div>
              </div>
              <div class="task-container">
                <p class="task">
                  ${taskText}
                </p>
              </div>
              <div class="remove-item-container">
              <input class="btn-remove-item" type="image" src="images/icon-cross.svg" alt="Remove Task">
              </div>
            </li>
  `;
  taskListContainer.insertAdjacentHTML("afterbegin", html);
  const newTask = document.querySelector("#task-number-" + itemNumber);
  taskItems.push(newTask);
  themedElements.push(newTask);
  themedElements.push(newTask.querySelector("." + theme));
  btnCheckBoxes.push(newTask.querySelector(".check-box-border"));
  updateTaskSummary();
}

function changeTaskState() {
  btnTaskStates.forEach((btnTaskState) => {
    btnTaskState.classList.remove("current-state");
  });
  this.classList.add("current-state");
  if (this.classList.contains("state-all")) {
    taskItems.forEach((taskItem) => {
      taskItem.classList.remove("hide");
    });
  } else if (this.classList.contains("state-active")) {
    taskItems.forEach((taskItem) => {
      if (taskItem.firstElementChild.classList.contains("completed")) {
        taskItem.classList.add("hide");
      } else {
        taskItem.classList.remove("hide");
      }
    });
  } else {
    taskItems.forEach((taskItem) => {
      if (!taskItem.firstElementChild.classList.contains("completed")) {
        taskItem.classList.add("hide");
      } else {
        taskItem.classList.remove("hide");
      }
    });
  }
}

function removeCompletedTasks() {
  taskItems.forEach((taskItem) => {
    if (taskItem.firstElementChild.classList.contains("completed")) {
      taskItem.remove();
    }
  });
}

function updateTaskSummary() {
  let count = 0;
  taskItems.forEach((taskItem) => {
    if (!taskItem.firstElementChild.classList.contains("completed")) count++;
  });
  labelRemainingTaskCount.firstElementChild.innerHTML = `${count} items left`;
}

function removeTask() {
  const index = parseInt(this.id.slice(-1));
  this.remove();
  taskItems.splice(index - 1, 1);
  updateTaskSummary();
}

function setDragging(task) {
  if (task.classList.contains("dragging")) task.classList.remove("dragging");
  else task.classList.add("dragging");
}

function getClosestElement(yPostion) {
  const draggables = [
    ...taskListContainer.querySelectorAll(".draggable:not(.dragging)"),
  ];
  return draggables.reduce(
    (closest, draggable) => {
      const draggableBox = draggable.getBoundingClientRect();
      const offset = yPostion - draggableBox.top - draggableBox.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: draggable };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

function setDrop(e) {
  e.preventDefault();
  const closestElement = getClosestElement(e.clientY);
  const task = document.querySelector(".dragging");
  if (closestElement === null) {
    taskListContainer.appendChild(task);
  } else {
    taskListContainer.insertBefore(task, closestElement);
  }
}

//
//
//Event Listners
btnThemeSwitch.addEventListener("click", switchTheme);
// btnCheckBoxes.forEach((btnCheckBox) => {
//   btnCheckBox.addEventListener("click", toggleCompletion);
// });
taskListContainer.addEventListener("click", (e) => {
  if (e.target) {
    if (e.target.matches(".check-box")) {
      toggleCompletion.call(e.target.parentNode);
      console.log(e.target.parentNode);
    } else if (e.target.matches(".check-mark")) {
      toggleCompletion.call(e.target.parentNode.parentNode);
    } else if (e.target && e.target.matches(".btn-remove-item")) {
      removeTask.call(e.target.parentNode.parentNode);
    }
  }
});
inputNewToDoTask.addEventListener("keyup", addNewToDoTask);
btnTaskStates.forEach((btnTaskState) => {
  btnTaskState.addEventListener("click", changeTaskState);
});
btnRemoveCompleted.addEventListener("click", removeCompletedTasks);
updateTaskSummary();

taskListContainer.addEventListener("dragstart", (e) => setDragging(e.target));

taskListContainer.addEventListener("dragend", (e) => setDragging(e.target));

taskListContainer.addEventListener("dragover", (e) => setDrop(e));
