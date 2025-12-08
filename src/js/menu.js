const menuGrid = document.getElementById('menu-grid');

let menuItems = JSON.parse(localStorage.getItem('menuData'));

if (menuItems === null) {
    menuItems = [
        {
            id: 1,
            name: "Classic Smash",
            price: 12.99,
            category: "burger",
            description: "Two beef patties, cheddar, pickles.",
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60"
        },
        {
            id: 2,
            name: "Spicy Fries",
            price: 5.99,
            category: "starter",
            description: "Crispy fries with chili dust.",
            image: "https://images.unsplash.com/photo-1630384060421-a4323ceca033?auto=format&fit=crop&w=500&q=60"
        }
    ];
}

function renderMenu() {
    // Clear 
    menuGrid.innerHTML = "";

    for (let i = 0; i < menuItems.length; i++) {
        const item = menuItems[i];
        
        // Main Card Div
        const card = document.createElement('div');
        card.classList.add('menu-card');
        
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

        // Action Buttons Wrapper
        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('action-buttons');

        // Edit Button (Visual only for now)
        const editBtn = document.createElement('button');
        editBtn.innerText = 'Edit';
        editBtn.classList.add('btn-edit');

        // Delete Button (Visual only for now)
        const delBtn = document.createElement('button');
        delBtn.innerText = 'Delete';
        delBtn.classList.add('btn-delete');
        
        // Header 
        headerDiv.appendChild(title);
        headerDiv.appendChild(price);

        // Actions 
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(delBtn);

        // Content 
        contentDiv.appendChild(headerDiv);
        contentDiv.appendChild(tag);
        contentDiv.appendChild(desc);
        contentDiv.appendChild(actionsDiv);

        // Main Card 
        card.appendChild(img);
        card.appendChild(contentDiv);

        // Append to Grid
        menuGrid.appendChild(card);
    }
}

// function to render menu on page
renderMenu();