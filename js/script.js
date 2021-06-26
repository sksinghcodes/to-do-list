var dataArray = [];
var addBtn = document.querySelector(".addBtn");
var input = document.querySelector(".input");
var todoList = document.querySelector(".todoList");

// check local storage and render data on the screen
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

function renderTasks(dataArray) {
    for(var i = 0; i < dataArray.length; i++ ){
		renderSingleTask(dataArray[i].task, i + 1);
	}
}

function renderSingleTask(task, index){
	todoList.innerHTML +=
	`<div class="listItem">
		<div class="checkBoxDiv">
			<input type="checkbox" class="checkbox" onchange="toggleTask(event)" id="item${index}" >
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
        renderToggleTask(index - 1)
    }, 10);
}

function addNewTask(task){
    // remove extra spaces from string
    var filteredTask = filterText(task);

    if(filteredTask){
        // render task to the screen
        renderSingleTask(filteredTask, dataArray.length);

        // update the array
        dataArray.push({
            task: filteredTask,
            isCompleted: false,
        })

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

function triggerEditTask(formInput){
    formInput.focus();
    formInput.selectionStart = formInput.value.length;
}

function saveEditTask(index, label, formInput){
    let filteredTask = filterText(formInput.value);

    if(filteredTask) {
        label.innerText = filteredTask;
        dataArray[index].task = filteredTask;
        saveChangesToLocal();
    }
}

function toggleClass(elementArray, className){
    for (let i = 0; i < elementArray.length; i++) {
        if(elementArray[i].classList.contains(className)) {
            elementArray[i].classList.remove(className);
        } else {
            elementArray[i].classList.add(className);
        }
    }
}

function toggleTask(e){
    let index = isOnIndex(e.path[2]);
    dataArray[index].isCompleted = !dataArray[index].isCompleted;
    renderToggleTask(index);
    saveChangesToLocal();
}

function renderToggleTask(index){
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
    }

    if(target.classList.contains('editBtn') || target.classList.contains('saveBtn')){
        let label = todoList.children[index].children[1];
        let formInput = todoList.children[index].children[2];

        toggleClass([
            target.parentElement.children[0],
            target.parentElement.children[1],
            label,
            formInput,
        ], 'hidden')

        if(target.classList.contains('editBtn')) {
            triggerEditTask(formInput);
        }

        if(target.classList.contains('saveBtn')) {
            saveEditTask(index, label, formInput);
        }
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
        renderToggleTask(i);
        todoList.children[i].children[0].children[0].id = `item${i+1}`;
        todoList.children[i].children[1].attributes.for.value =`item${i+1}`;
    }
}

function unfocused(e) {
    triggerClass(e.target.nextElementSibling.children[1], 'active');
    setTimeout(() => {
        e.target.nextElementSibling.children[1].click();
    }, 100)
}

document.documentElement.style.setProperty('--vh', `${visualViewport.height}px`);
document.documentElement.style.setProperty('--mh', `${visualViewport.height}px`);

visualViewport.onresize = () => {
    document.documentElement.style.setProperty('--vh', `${visualViewport.height}px`);
}