const menuForm = document.getElementById('menu-form');
const menuGrid = document.getElementById('menu-grid');
const submitBtn = menuForm.querySelector('button');

let isEditing = false;
let editId = null;
let db;

// --- DATABASE SETUP ---

const request = indexedDB.open("GrooveDB", 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains('menu')) {
        db.createObjectStore('menu', { keyPath: 'id' });
    }
};

request.onsuccess = function(event) {
    db = event.target.result;
    readItemsFromDB(); 
};

request.onerror = function(event) {
    console.error("Database error:", event.target.errorCode);
};

function readItemsFromDB() {
    const transaction = db.transaction(["menu"], "readonly");
    const objectStore = transaction.objectStore("menu");
    const getAllRequest = objectStore.getAll();

    getAllRequest.onsuccess = function(event) {
        const items = event.target.result;
        renderGrid(items);
    };
}

function createOrUpdateItemInDB(item) {
    const transaction = db.transaction(["menu"], "readwrite");
    const objectStore = transaction.objectStore("menu");
    const request = objectStore.put(item);

    request.onsuccess = function() {
        readItemsFromDB(); 
    };
}

function deleteItemFromDB(id) {
    const transaction = db.transaction(["menu"], "readwrite");
    const objectStore = transaction.objectStore("menu");
    const request = objectStore.delete(id);

    request.onsuccess = function() {
        readItemsFromDB(); 
    };
}


function renderGrid(menuItems) {
    menuGrid.innerHTML = "";
    menuItems.forEach(item => {
        const card = createMenuCard(item);
        menuGrid.appendChild(card);
    });
}

function createMenuCard(item) {
    const card = document.createElement('div');
    card.classList.add('menu-card');
    card.id = 'card-' + item.id;

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;

    const contentDiv = createCardContent(item);

    card.appendChild(img);
    card.appendChild(contentDiv);
    
    return card;
}

function createCardContent(item) {
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('card-content');

    const headerDiv = document.createElement('div');
    headerDiv.classList.add('card-header');

    const title = document.createElement('h3');
    title.innerText = item.name;

    const price = document.createElement('span');
    price.classList.add('card-price');
    price.innerText = '$' + item.price;

    headerDiv.appendChild(title);
    headerDiv.appendChild(price);

    const tag = document.createElement('p');
    tag.classList.add('card-tag');
    tag.innerText = item.category;

    const desc = document.createElement('p');
    desc.classList.add('card-desc');
    desc.innerText = item.description;

    const actionsDiv = createActionButtons(item.id);

    contentDiv.appendChild(headerDiv);
    contentDiv.appendChild(tag);
    contentDiv.appendChild(desc);
    contentDiv.appendChild(actionsDiv);

    return contentDiv;
}

function createActionButtons(id) {
    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('action-buttons');

    const editBtn = document.createElement('button');
    editBtn.innerText = 'Edit';
    editBtn.classList.add('btn-edit');
    editBtn.onclick = () => startEdit(id);

    const delBtn = document.createElement('button');
    delBtn.innerText = 'Delete';
    delBtn.classList.add('btn-delete');
    delBtn.onclick = () => deleteItemFromDB(id);

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(delBtn);

    return actionsDiv;
}

menuForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    if (isEditing) {
        handleUpdateItem();
    } else {
        handleCreateItem();
    }
});

function getFormData() {
    return {
        name: document.getElementById('foodName').value,
        price: document.getElementById('foodPrice').value,
        category: document.getElementById('foodCategory').value,
        description: document.getElementById('foodDesc').value,
        image: document.getElementById('foodImage').value || "https://placehold.co/600x400"
    };
}

function handleCreateItem() {
    const data = getFormData();
    const newItem = {
        id: Date.now(),
        ...data
    };
    createOrUpdateItemInDB(newItem);
    resetFormState();
}

function handleUpdateItem() {
    const data = getFormData();
    const updatedItem = {
        id: editId,
        ...data
    };
    createOrUpdateItemInDB(updatedItem);
    resetFormState();
}

function resetFormState() {
    menuForm.reset();
    isEditing = false;
    editId = null;
    submitBtn.innerText = "Add to Menu";
    submitBtn.style.background = "";
}

function startEdit(id) {
    const transaction = db.transaction(["menu"], "readonly");
    const objectStore = transaction.objectStore("menu");
    const request = objectStore.get(id);

    request.onsuccess = function(event) {
        const item = event.target.result;
        if (item) {
            populateForm(item);
            isEditing = true;
            editId = id;
            submitBtn.innerText = "Update Item";
            submitBtn.style.background = "var(--color-primary-accent)";
            menuForm.scrollIntoView({ behavior: "smooth" });
        }
    };
}

function populateForm(item) {
    document.getElementById('foodName').value = item.name;
    document.getElementById('foodPrice').value = item.price;
    document.getElementById('foodCategory').value = item.category;
    document.getElementById('foodDesc').value = item.description;
    document.getElementById('foodImage').value = item.image;
}