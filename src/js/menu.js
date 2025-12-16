const menuForm = document.getElementById('menu-form');
const menuGrid = document.getElementById('menu-grid');
const submitBtn = menuForm.querySelector('button');

const API_URL = 'http://localhost:4000/api/menu';

let isEditing = false;
let editId = null;
let currentMenuItems = [];

async function fetchMenuItems() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch menu');
        
        const data = await response.json();
        
        currentMenuItems = data.map(item => ({
            ...item,
            id: item._id || item.id 
        }));

        renderGrid(currentMenuItems);
    } catch (error) {
        console.error('Error loading menu:', error);
        menuGrid.innerHTML = '<p style="color:red; text-align:center;">Failed to load menu items. Is the server running?</p>';
    }
}

async function createItemInDB(item) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });

        if (!response.ok) throw new Error('Failed to create item');
        
        fetchMenuItems();
    } catch (error) {
        console.error('Error creating item:', error);
    }
}

async function updateItemInDB(item) {
    try {
        const response = await fetch(`${API_URL}/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });

        if (!response.ok) throw new Error('Failed to update item');

        fetchMenuItems();
    } catch (error) {
        console.error('Error updating item:', error);
    }
}

async function deleteItemFromDB(id) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete item');

        fetchMenuItems();
    } catch (error) {
        console.error('Error deleting item:', error);
    }
}

function renderGrid(menuItems) {
    menuGrid.innerHTML = "";
    if (menuItems.length === 0) {
        menuGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">No items found. Add one above!</p>';
        return;
    }
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
    img.src = item.image || "https://placehold.co/600x400";
    img.alt = item.name;
    img.onerror = function() { this.src = 'https://placehold.co/600x400?text=No+Image'; };

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
        image: document.getElementById('foodImage').value
    };
}

function handleCreateItem() {
    const data = getFormData();
    createItemInDB(data);
    resetFormState();
}

function handleUpdateItem() {
    const data = getFormData();
    const updatedItem = {
        id: editId,
        ...data
    };
    updateItemInDB(updatedItem);
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
    const item = currentMenuItems.find(i => i.id === id);

    if (item) {
        populateForm(item);
        isEditing = true;
        editId = id;
        submitBtn.innerText = "Update Item";
        submitBtn.style.background = "var(--color-primary-accent)";
        menuForm.scrollIntoView({ behavior: "smooth" });
    }
}

function populateForm(item) {
    document.getElementById('foodName').value = item.name;
    document.getElementById('foodPrice').value = item.price;
    document.getElementById('foodCategory').value = item.category;
    document.getElementById('foodDesc').value = item.description;
    document.getElementById('foodImage').value = item.image;
}

document.addEventListener('DOMContentLoaded', fetchMenuItems);