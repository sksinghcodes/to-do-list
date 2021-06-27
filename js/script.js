const addBtn = document.querySelector(".addBtn");
const input = document.querySelector(".input");
const todoList = document.querySelector(".todoList");
let dataArray = [];
let taskBeingEditIndex;
let saveBtnClicked = false;

if(localStorage.length){
	dataArray = JSON.parse(localStorage.getItem("dataString"));
    renderTasks(dataArray)
}

addBtn.onclick = function(){addNewTask(input.value);}

input.onkeypress = function(e){
    if(e.key === "Enter") {
        addBtn.click();
        triggerClass(addBtn, 'active');
    }
}

todoList.onclick = function(e){controlSystem(e);}

function unfocused(){
    saveTask();
}

function renderTasks(dataArray) {
    for(var i = 0; i < dataArray.length; i++ ){
		renderSingleTask(dataArray[i].task, i + 1);
	}
}

function renderSingleTask(task, index){
	todoList.innerHTML +=
	`<div class="listItem">
		<div class="checkBoxDiv">
			<input type="checkbox" class="checkbox" onchange="toggleTaskCompletion(event)" id="item${index}" >
		</div>
		<label for="item${index}" class="label">${task}</label>			
		<input type="text" class="labelInput hidden" onfocusout="unfocused(event)" value="${task}">
		<div class="controls">
			<button class="editBtn"><span class="fa fa-pen"></span></button>
			<button class="saveBtn hidden"><span class="fa fa-save"></span></button>
			<button class="deleteBtn"><span class="fa fa-trash"></span></button>
		</div>
	</div>`;

    setTimeout(() => {
        renderTaskCompletion(index - 1)
    }, 10);
}

function addNewTask(task){
    var filteredTask = filterText(task);

    if(filteredTask){
        dataArray.push({
            task: filteredTask,
            isCompleted: false,
        })

        renderSingleTask(filteredTask, dataArray.length);

        saveChangesToLocal();
        input.value = "";
        input.focus();
    }
}

function deleteTask(index){
    todoList.children[index].remove();
    dataArray.splice(index, 1);
    saveChangesToLocal();
    updateAttributes(index);
}

function editTask(index){
    let editField = todoList.children[index].children[2];
    toggleClassHidden(index);
    taskBeingEditIndex = index;
    editField.focus();
    editField.selectionStart = editField.value.length;
}

function saveTask(){
    triggerClass(todoList.children[taskBeingEditIndex].children[3].children[1], 'active');
    setTimeout(() => {
        let editField = todoList.children[taskBeingEditIndex].children[2];
        let filteredTask;
        toggleClassHidden(taskBeingEditIndex);
        filteredTask = filterText(editField.value);
        if(filteredTask){
            todoList.children[taskBeingEditIndex].children[1].innerText = filteredTask;
            dataArray[taskBeingEditIndex].task = filteredTask;
            saveChangesToLocal();
        }
        taskBeingEditIndex = null;
    }, 100);
}

function toggleClassHidden(index){
    let elementArray = [
        todoList.children[index].children[1],
        todoList.children[index].children[2],
        todoList.children[index].children[3].children[0],
        todoList.children[index].children[3].children[1]
    ];

    for (let i = 0; i < elementArray.length; i++) {
        if(elementArray[i].classList.contains('hidden')) {
            elementArray[i].classList.remove('hidden');
        } else {
            elementArray[i].classList.add('hidden');
        }
    }
}

function toggleTaskCompletion(e){
    let index = isOnIndex(e.path[2]);
    dataArray[index].isCompleted = !dataArray[index].isCompleted;
    renderTaskCompletion(index);
    saveChangesToLocal();
}

function renderTaskCompletion(index){
    if(dataArray[index].isCompleted) {
        todoList.children[index].children[1].classList.add('done');
        todoList.children[index].children[0].children[0].checked = true;
    } else {
        todoList.children[index].children[1].classList.remove('done');
        todoList.children[index].children[0].children[0].checked = false;
    }
}

function filterText(text) {
    return text.replace(/\s+/g, " ").replace(/^\s|\s$/g, "");
}

function saveChangesToLocal(){
	if (dataArray.length){
		localStorage.setItem("dataString", JSON.stringify(dataArray));
	} else {
        localStorage.clear();
    }
}

function triggerClass(element, className, duration = 100) {
    element.classList.add(className);
    setTimeout(() => {
        element.classList.remove(className);
    }, duration);
}

function controlSystem(e){
    let target;
    let index;

    if(e.path[1].className === 'controls'){
        target = e.path[0];
    } else if (e.path[2].className === 'controls'){
        target = e.path[1];
    } else {
        return false;
    }
    
    index = isOnIndex(target.parentElement.parentElement);

    if(target.className === 'deleteBtn') {
        deleteTask(index);
    } else if(target.className === 'editBtn') {
        editTask(index);
    } else if(target.className === 'saveBtn') {
        saveTask(taskBeingEditIndex);
    }
}

function isOnIndex(element){
    for(let i = 0; i < element.parentElement.childElementCount; i++){
        if (element === element.parentElement.children[i]) {
            return i;
        }
    }
}

function updateAttributes(fromIndex){
    for(let i = fromIndex; i < dataArray.length; i++){
        renderTaskCompletion(i);
        todoList.children[i].children[0].children[0].id = `item${i+1}`;
        todoList.children[i].children[1].attributes.for.value =`item${i+1}`;
    }
}

document.documentElement.style.setProperty('--vh', `${visualViewport.height}px`);
document.documentElement.style.setProperty('--mh', `${visualViewport.height}px`);

visualViewport.onresize = () => {
    document.documentElement.style.setProperty('--vh', `${visualViewport.height}px`);
}