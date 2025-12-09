const menuForm = document.getElementById('menu-form');
const menuGrid = document.getElementById('menu-grid');
const submitBtn = menuForm.querySelector('button');

let isEditing = false;
let editId = null;
let db; 


// name the database
const request = indexedDB.open("GrooveDB", 1);


request.onupgradeneeded = function(event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains('menu')) {
        db.createObjectStore('menu', { keyPath: 'id' });
    }
};

// run on successful open
request.onsuccess = function(event) {
    db = event.target.result;
    loadMenu(); 
};

// handle errors
request.onerror = function(event) {
    console.error("Database error:", event.target.errorCode);
};

// read all items from db
function loadMenu() {
    const transaction = db.transaction(["menu"], "readonly");
    const objectStore = transaction.objectStore("menu");
    const getAllRequest = objectStore.getAll();

    getAllRequest.onsuccess = function(event) {
        const items = event.target.result;
        renderGrid(items);
    };
}

// create or update item in db
function saveItemToDB(item) {
    const transaction = db.transaction(["menu"], "readwrite");
    const objectStore = transaction.objectStore("menu");
    
    const request = objectStore.put(item);

    request.onsuccess = function() {
        loadMenu(); 
    };
}

// delete item from db
function deleteItemFromDB(id) {
    const transaction = db.transaction(["menu"], "readwrite");
    const objectStore = transaction.objectStore("menu");
    const request = objectStore.delete(id);

    request.onsuccess = function() {
        loadMenu(); 
    };
}

function renderGrid(menuItems) {
    menuGrid.innerHTML = "";

    for (let i = 0; i < menuItems.length; i++) {
        const item = menuItems[i];

        const card = document.createElement('div');
        card.classList.add('menu-card');
        card.id = 'card-' + item.id;

        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name;

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('card-content');

        const headerDiv = document.createElement('div');
        headerDiv.classList.add('card-header');

        const title = document.createElement('h3');
        title.innerText = item.name;

        const price = document.createElement('span');
        price.classList.add('card-price');
        price.innerText = '$' + item.price;

        const tag = document.createElement('p');
        tag.classList.add('card-tag');
        tag.innerText = item.category;

        const desc = document.createElement('p');
        desc.classList.add('card-desc');
        desc.innerText = item.description;

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('action-buttons');

        const editBtn = document.createElement('button');
        editBtn.innerText = 'Edit';
        editBtn.classList.add('btn-edit');
        editBtn.onclick = function() {
            startEdit(item.id);
        };

        const delBtn = document.createElement('button');
        delBtn.innerText = 'Delete';
        delBtn.classList.add('btn-delete');
        delBtn.onclick = function() {
            deleteItemFromDB(item.id);
        };

        headerDiv.appendChild(title);
        headerDiv.appendChild(price);
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(delBtn);
        contentDiv.appendChild(headerDiv);
        contentDiv.appendChild(tag);
        contentDiv.appendChild(desc);
        contentDiv.appendChild(actionsDiv);
        card.appendChild(img);
        card.appendChild(contentDiv);
        menuGrid.appendChild(card);
    }
}

// event listener for form submission
menuForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const nameVal = document.getElementById('foodName').value;
    const priceVal = document.getElementById('foodPrice').value;
    const categoryVal = document.getElementById('foodCategory').value;
    const descVal = document.getElementById('foodDesc').value;
    const imageVal = document.getElementById('foodImage').value || "https://placehold.co/600x400";

    const item = {
        id: isEditing ? editId : Date.now(),
        name: nameVal,
        price: priceVal,
        category: categoryVal,
        description: descVal,
        image: imageVal
    };

    saveItemToDB(item); 

    menuForm.reset();
    isEditing = false;
    editId = null;
    submitBtn.innerText = "Add to Menu";
    submitBtn.style.background = "";
});

// function for editing an item
function startEdit(id) {
    const transaction = db.transaction(["menu"], "readonly");
    const objectStore = transaction.objectStore("menu");
    const request = objectStore.get(id);

    request.onsuccess = function(event) {
        const itemFound = event.target.result;
        
        if (itemFound) {
            document.getElementById('foodName').value = itemFound.name;
            document.getElementById('foodPrice').value = itemFound.price;
            document.getElementById('foodCategory').value = itemFound.category;
            document.getElementById('foodDesc').value = itemFound.description;
            document.getElementById('foodImage').value = itemFound.image;

            isEditing = true;
            editId = id;
            submitBtn.innerText = "Update Item";
            submitBtn.style.background = "#d19a00";
            
            menuForm.scrollIntoView({behavior: "smooth"});
        }
    };
}