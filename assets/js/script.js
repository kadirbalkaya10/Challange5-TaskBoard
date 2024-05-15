// Dependencies
const formModal = $("#formModal");
const inputTitle = $("#formTitle");
const inputDate = $("#formDate");
const inputDescription = $("#formDescription");
const tasksTodo = $("#todo-cards");
const tasksProgress = $("#in-progress-cards");
const tasksDone = $("#done-cards");

// Functions
// Create a function to generate a unique task id
function generateTaskId() {
  const nextId = parseInt(localStorage.getItem("nextId")) || 0;
  localStorage.setItem("nextId", nextId + 1);
  return nextId;
}

// Create a function to create a task card
function createTaskCard(task) {
  const taskContainer = $("<div>", {
    class: "card task-card draggable my-3",
    "data-id": task.id,
    "data-task-id": task.id,
  });

  $("<h2>", {
    class: "card-header",
    text: task.title,
  }).appendTo(taskContainer);

  $("<p>", {
    class: "card-body",
    text: task.description,
  }).appendTo(taskContainer);

  $("<p>", {
    class: "card-text",
    text: task.date,
  }).appendTo(taskContainer);

  $("<button>", {
    class: "btn btn-danger mx-auto my-1",
    text: "Delete",
    click: handleDeleteTask,
  }).appendTo(taskContainer);

  return taskContainer;
}

// Create a function to render the task list and make cards draggable
function renderTaskList() {
  [tasksTodo, tasksProgress, tasksDone].forEach((taskHolder) =>
    taskHolder.empty()
  );

  const taskList = JSON.parse(localStorage.getItem("tasks")) || [];
  taskList.forEach((task) => {
    const taskEl = createTaskCard(task);
    $("#" + task.type + "-cards").append(taskEl);
  });

  // Make sure the draggable functionality is applied to the newly added tasks
  $(".draggable").draggable({
    opacity: 0.7,
    zIndex: 100,
    helper: function (e) {
      const original = $(e.target).hasClass("ui-draggable")
        ? $(e.target)
        : $(e.target).closest(".ui-draggable");
      return original.clone().css({ width: original.outerWidth() });
    },
  });
}

// Create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();
  formModal.modal("hide");

  const taskData = {
    title: inputTitle.val(),
    date: inputDate.val(),
    description: inputDescription.val(),
    type: "todo",
    id: generateTaskId(),
  };
  console.log(taskData);
  const taskList = JSON.parse(localStorage.getItem("tasks")) || [];
  taskList.push(taskData);
  localStorage.setItem("tasks", JSON.stringify(taskList));

  inputTitle.val("");
  inputDate.val("");
  inputDescription.val("");

  // Render the task list (potentially moved here)
  renderTaskList();
}

// Create a function to handle deleting a task
function handleDeleteTask() {
  const taskId = $(this).parent().data("id");
  const taskList = JSON.parse(localStorage.getItem("tasks")) || [];
  const updatedTaskList = taskList.filter((task) => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(updatedTaskList));
  renderTaskList();
}

// Document Ready
$(document).ready(function () {
  renderTaskList();
  $("#formDate").datepicker();
  $("#submitTask").click(handleAddTask);
  $(".lane").droppable({
    accept: ".draggable",
    drop: (event, ui) => {
      const taskId = ui.draggable[0].dataset.taskId;
      const newType = event.target.id;
      console.log("newType", newType);
      const taskList = JSON.parse(localStorage.getItem("tasks")) || [];
      for (let task of taskList) {
        if (task.id === parseInt(taskId)) {
          task.type = newType;
        }
      }

      localStorage.setItem("tasks", JSON.stringify(taskList));
      renderTaskList();
    },
  });
});
