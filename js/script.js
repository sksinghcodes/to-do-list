(function(){
	const root = document.getElementById('root');
	const inputDiv = root.children[0];
	const todoList = root.children[1];
	const dataArray = JSON.parse(localStorage.getItem('dataString')) || [];
	let taskBeingEditIndex = null;
	let taskBeingEditText = null;

	for (let i = 0; i < dataArray.length; i++) {
		addItem(dataArray[i].task, dataArray[i].isCompleted);
	}

	document.addEventListener('click', e => {
		if(e.target.dataset.action !== 'edit' && e.target.dataset.action !== 'toggleCompletion') {
			saveEdit();
		}
	});

	inputDiv.addEventListener('click', e => {
		if(e.target.classList.contains('addBtn')){
			let task = inputDiv.children[0].value.trim();

			if(task) {
				dataArray.push({task, isCompleted: false});
				updateLocalStorage();
				addItem(task);
				inputDiv.children[0].value = '';
			} else {
				return false;
			}
		}
	});

	inputDiv.children[0].addEventListener('keypress', e => {
		if(e.key === 'Enter') {
			e.target.nextElementSibling.click();
		}
	});

	todoList.addEventListener('click', e => {
		if(e.target.dataset.action === 'delete') {
			removeItem(e.target.closest('li'));
		}

		if(e.target.dataset.action === 'edit') {
			startEdit(e.target.closest('li'));
		}

		if(e.target.dataset.action === 'toggleCompletion') {
			if(e.target.readOnly || e.target.tagName === 'BUTTON') {
				toggleTaskCompletion(e.target.closest('li'));
			}
		}
	});

	todoList.addEventListener('input', e => {
		if(e.target.tagName === 'TEXTAREA') {
			resize(e.target.parentElement)
		}
	});

	setSceenHeight();

	onresize = setSceenHeight;

	function setSceenHeight() {
		document.documentElement.style.setProperty('--screen-height', document.documentElement.clientHeight + 'px');
	}

	function resize(listItem) {
		const taskTextarea = listItem.children[1];
		taskTextarea.style.height = 'auto';
	    taskTextarea.style.height = `${taskTextarea.scrollHeight}px`;
	}

	function addItem(task, isCompleted = false){
		const li = document.createElement('li');
		li.className = "list-item";
		isCompleted ? li.classList.add('completed') : '';
		li.onmouseleave = li.onmouseenter = e => resize(e.target);
		li.innerHTML = `<button class="task-completion" data-action="toggleCompletion"></button>
			<textarea rows=1 class="task" data-action="toggleCompletion" readonly>${task}</textarea>
			<div class="controls">
				<button class="fas fa-pen" data-action="edit"></button>
				<button class="fas fa-save hidden" data-action="save"></button>
				<button class="fas fa-trash" data-action="delete"></button>
			</div>`;

		todoList.append(li);
		resize(li);
	}

	function startEdit(listItem) {
		saveEdit();

		taskBeingEditIndex = isNthChild(listItem);
		const taskTextarea = listItem.children[1]
		taskBeingEditText = taskTextarea.value;

		listItem.children[2].children[0].classList.toggle('hidden');
		listItem.children[2].children[1].classList.toggle('hidden');

		taskTextarea.readOnly = false;
		taskTextarea.focus();
		taskTextarea.selectionStart = taskTextarea.selectionEnd = taskTextarea.value.length;
	}

	function saveEdit(){
		if(typeof taskBeingEditIndex === 'number') {
			const listItem = todoList.children[taskBeingEditIndex];
			const taskTextarea = listItem.children[1];
			const task = taskTextarea.value.trim();

			listItem.children[2].children[0].classList.toggle('hidden');
			listItem.children[2].children[1].classList.toggle('hidden');

			if(task) {
				taskTextarea.value = task;
				dataArray[taskBeingEditIndex].task = task;
				updateLocalStorage();
			} else {
				taskTextarea.value = taskBeingEditText;
			}

			taskTextarea.readOnly = true;
			taskBeingEditIndex = null;
			taskBeingEditText = null
		}
	}

	function removeItem(listItem){
		saveEdit();

		const index = isNthChild(listItem);
		dataArray.splice(index, 1);
		updateLocalStorage();
		listItem.remove();
	}

	function toggleTaskCompletion(listItem){
		saveEdit();
		
		const index = isNthChild(listItem);
		dataArray[index].isCompleted = !dataArray[index].isCompleted;
		updateLocalStorage();
		listItem.classList.toggle('completed');
	}

	function updateLocalStorage(){
		localStorage.setItem('dataString', JSON.stringify(dataArray));
	}

	function isNthChild(element) {
		for(let i = 0; i < element.parentElement.children.length; i++) {
			if(element === element.parentElement.children[i]){
				return i;
			}
		}
	}
})();
