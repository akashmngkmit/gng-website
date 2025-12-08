const menuGrid = document.getElementById('menu-grid');
const menuForm = document.getElementById('menu-form');
const submitBtn = menuForm.querySelector('button');

// State variables to track editing mode
let isEditing = false;
let editId = null;

let menuItems = JSON.parse(localStorage.getItem('menuData'));

// if (menuItems === null) {
//     menuItems = [
//         {
//             id: 1,
//             name: "Classic Smash",
//             price: 12.99,
//             category: "burger",
//             description: "Two beef patties, cheddar, pickles.",
//             image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60"
//         }
//     ];
// }

// 3. Function to show the menu
function renderMenu() {
    // Clear
    menuGrid.innerHTML = "";

    for (let i = 0; i < menuItems.length; i++) {
        const item = menuItems[i];
        
        // Main Card Div
        const card = document.createElement('div');
        card.classList.add('menu-card');
        card.id = 'card-' + item.id;

        // Image
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name;

        // Content Wrapper
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('card-content');

        // Header (Title + Price)
        const headerDiv = document.createElement('div');
        headerDiv.classList.add('card-header');

        const title = document.createElement('h3');
        title.innerText = item.name;

        const price = document.createElement('span');
        price.classList.add('card-price');
        price.innerText = '$' + item.price;

        // Category Tag
        const tag = document.createElement('p');
        tag.classList.add('card-tag');
        tag.innerText = item.category;

        // Description
        const desc = document.createElement('p');
        desc.classList.add('card-desc');
        desc.innerText = item.description;

        // Action Buttons
        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('action-buttons');

        // Edit Button
        const editBtn = document.createElement('button');
        editBtn.innerText = 'Edit';
        editBtn.classList.add('btn-edit');
        editBtn.onclick = function() {
            startEdit(item.id);
        };

        // Delete Button
        const delBtn = document.createElement('button');
        delBtn.innerText = 'Delete';
        delBtn.classList.add('btn-delete');
        delBtn.onclick = function() {
            deleteItem(item.id);
        };

        // Append Elements
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

menuForm.addEventListener('submit', function(event) {
    event.preventDefault(); 

    // Get input values
    const nameVal = document.getElementById('foodName').value;
    const priceVal = document.getElementById('foodPrice').value;
    const categoryVal = document.getElementById('foodCategory').value;
    const descVal = document.getElementById('foodDesc').value;
    const imageVal = document.getElementById('foodImage').value || "https://placehold.co/600x400";

    if (isEditing === true) {
        for (let i = 0; i < menuItems.length; i++) {
            if (menuItems[i].id === editId) {
                menuItems[i].name = nameVal;
                menuItems[i].price = priceVal;
                menuItems[i].category = categoryVal;
                menuItems[i].description = descVal;
                menuItems[i].image = imageVal;
            }
        }
    
        isEditing = false;
        editId = null;
        submitBtn.innerText = "Add to Menu";
        submitBtn.style.background = "";

    } else {
        const newId = Date.now(); // Unique ID based on time

        const newItem = {
            id: newId,
            name: nameVal,
            price: priceVal,
            category: categoryVal,
            description: descVal,
            image: imageVal
        };

        menuItems.push(newItem);
    }

    saveData();
    renderMenu();
    menuForm.reset();
});

// Delete Function
function deleteItem(id) {
    const newArray = [];
    for (let i = 0; i < menuItems.length; i++) {
        if (menuItems[i].id !== id) {
            newArray.push(menuItems[i]);
        }
    }
    menuItems = newArray;
    saveData();
    renderMenu();
}

function startEdit(id) {
    let itemFound = null;
    for (let i = 0; i < menuItems.length; i++) {
        if (menuItems[i].id === id) {
            itemFound = menuItems[i];
            break;
        }
    }

    if (itemFound) {
        // Search items
        document.getElementById('foodName').value = itemFound.name;
        document.getElementById('foodPrice').value = itemFound.price;
        document.getElementById('foodCategory').value = itemFound.category;
        document.getElementById('foodDesc').value = itemFound.description;
        document.getElementById('foodImage').value = itemFound.image;

        // Set Edit Mode
        isEditing = true;
        editId = id;
        submitBtn.innerText = "Update Item";
        submitBtn.style.background = "#d19a00";
    }
}

// Save Function
function saveData() {
    localStorage.setItem('menuData', JSON.stringify(menuItems));
}

// Default Call
renderMenu();