var dataArray = [];
var addBtn = document.querySelector(".addBtn");
var input = document.querySelector(".input");
var item = document.querySelectorAll(".listItem");
var todoList = document.querySelector(".todoList"); 
var capturedItem;
var unfocusItem;

if(localStorage.length){
	dataArray = JSON.parse(localStorage.getItem("dataString"));

	for(var i = 0; i < dataArray.length; i++ ){
		taskUpdate(i + 1, dataArray[i].task);
		updateList();
		retick();
	}
}


addBtn.onclick = function(){

	input.value = input.value.replace(/\s+/g, " ").replace(/^\s|\s$/g, "");

	if( input.value && !(input.value === "  ") ){

		dataArray.push({
			task: input.value,
			isCompleted: false
		});
		taskUpdate(todoList.childElementCount + 1, input.value);
	}

	input.value = "";
	updateList();
	retick();
};

document.onunload = function(){
	if (dataArray.length){
		localStorage.setItem("dataString", JSON.stringify(dataArray));
	}
}

document.onkeydown = function(event){
    if(event.key === "Enter"){
        addBtn.click();
    }
}


function taskUpdate(index, innerData){
	todoList.innerHTML +=
	`<div class="listItem">
		<div class="checkBoxDiv">
			<input type="checkbox" class="checkbox" onchange="toggleDone()" id="item${index}" >
		</div>
		<label for="item${index}" class="label">${innerData}</label>			
		<input type="text" class="labelInput hidden" onfocusout="unfocused(event)" value="${innerData}">
		<div class="controls">
			<button class="editBtn" onClick="editLabel(event)"><span class="fa fa-pen"></span></button>
			<button class="saveBtn hidden" onClick="saveLabel(event)"><span class="fa fa-save"></span></button>
			<button class="deleteBtn" onClick="removeListItem(event)"><span class="fa fa-trash"></span></button>
		</div>
	</div>`;
}


function updateList(){
	item = document.querySelectorAll(".listItem");
	todoList = document.querySelector(".todoList");
}

function toggleDone(){
	for(var i = 0; i < todoList.childElementCount; i++){
	    if(item[i].children[0].children[0].checked){
			dataArray[i].isCompleted = true;
	        item[i].children[1].classList.add("done");
	    }
	    else{
			dataArray[i].isCompleted = false;
	        item[i].children[1].classList.remove("done");
	    }
	}
}

function retick(){
	for(var i = 0; i < item.length; i++){
	    if(item[i].children[1].classList.contains("done") || dataArray[i].isCompleted){
			item[i].children[0].children[0].checked = true;
			item[i].children[1].classList.add("done");
	    }
	}
}

function updateItemIndex(){
	for(var i = 0; i < item.length; i++){
	    item[i].children[0].children[0].id = "item"+String(i+1);
		item[i].children[1].setAttribute("for","item"+String(i+1)); 
	}
}


function removeListItem(event){
	if(!event.target.innerHTML){
		dataArray.splice([event.path[3].children[0].children[0].id.slice(-1)-1], 1);
		event.path[3].remove();
	}
	else{
		dataArray.splice([event.path[2].children[0].children[0].id.slice(-1)-1,], 1);
		event.path[2].remove();
	}

	updateList();
	updateItemIndex();
}


function editLabel(event){
	if(!event.target.innerHTML){
	    capturedItem = event.path[3];
	}
	else{
		capturedItem = event.path[2];
	}

	capturedItem.children[3].children[0].classList.add("hidden");
	capturedItem.children[3].children[1].classList.remove("hidden");

	capturedItem.children[2].value = capturedItem.children[1].innerText;

	capturedItem.children[2].classList.remove("hidden");
	capturedItem.children[1].classList.add("hidden");

	capturedItem.children[2].focus();

	capturedItem.children[2].selectionStart = capturedItem.children[1].innerText.length;

}

function saveLabel(event){
	if(!event.target.innerHTML){
	    capturedItem = event.path[3];
	}
	else{
		capturedItem = event.path[2];
	}

	capturedItem.children[3].children[0].classList.remove("hidden");
	capturedItem.children[3].children[1].classList.add("hidden");

	capturedItem.children[2].classList.add("hidden");
	capturedItem.children[1].classList.remove("hidden");

	capturedItem.children[2].value = capturedItem.children[2].value.replace(/\s+/g, " ").replace(/^\s|\s$/g, "");

	if( capturedItem.children[2].value && !(capturedItem.children[2].value === "  ") ){
		capturedItem.children[1].innerText = capturedItem.children[2].value;
		dataArray[capturedItem.children[0].children[0].id.slice(-1)-1].task = capturedItem.children[2].value;
	}
}

function unfocused(event){
	event.target.parentElement.children[3].children[1].click();
}