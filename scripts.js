// Global variables
let selectedProduct = {};
const WA_PHONE_NUMBER = '9539680161'; // Boutique WhatsApp number
let isAdminLoggedIn = false;

// --- E-COMMERCE POPUP AND ORDER LOGIC (EXISTING) ---

// Helper: finds the nearest product item and calls the main openPopup
function openPopupFromCard(button){
    const card = button.closest('.item');
    const img = card ? card.querySelector('img') : null;
    if(img) openPopup(img);
}

// Ensure the function is explicitly available on the global window object
window.openPopupFromCard = openPopupFromCard;


// Main function to display the popup with data
function openPopup(imgElement){
    if(!imgElement || imgElement.tagName.toLowerCase() !== 'img') return;

    // Get the parent product card to read artnum div
    const card = imgElement.closest('.item');
    const artnum = card.querySelector('.artnum') 
                  ? card.querySelector('.artnum').textContent.trim()
                  : "-";

    // 1. Capture product data
    selectedProduct = {
        name: imgElement.alt || 'Product',
        img: imgElement.src || '',
        size: imgElement.dataset.size || '-',
        rate: imgElement.dataset.rate || '-',
        material: imgElement.dataset.material || '-',
        style: imgElement.dataset.style || '-',
        artnum: artnum
    };
    
    // 2. Set popup image
    const popupImg = document.getElementById('popup-img');
    if(popupImg) {
        popupImg.src = selectedProduct.img;
        popupImg.alt = selectedProduct.name;
    }

    // 3. Build and inject the full form and product details HTML
    // Note: The Price field is missing in the data attributes, but Rate is used consistently. 
    // I'll show Rate as the primary display value.
    const detailsHtml = `
        <h2>${escapeHtml(selectedProduct.name)} (${escapeHtml(selectedProduct.rate)})</h2>

        <p><strong>ARTNUM:</strong> ${escapeHtml(selectedProduct.artnum)}</p>

        <p><strong>Size:</strong> ${escapeHtml(selectedProduct.size)} 
           | <strong>Material:</strong> ${escapeHtml(selectedProduct.material)}</p>
        <p><strong>Style:</strong> ${escapeHtml(selectedProduct.style)}</p>
        
        <h3 style="margin-top:20px; color: #ff5aa5;">Enter Shipping Details</h3>
        
        <form id="orderForm" style="display:grid; gap:10px;">
            <input type="text" id="customerName" placeholder="Full Name *" required>
            <input type="tel" id="customerPhone" placeholder="Phone Number *" required>
            
            <hr style="border: none; border-top: 1px dotted #ddd;">

            <input type="text" id="houseNumber" placeholder="House Name/Number *" required>
            <input type="text" id="locality" placeholder="Locality / Street *" required>
            <input type="text" id="place" placeholder="Village / City / Place *" required>
            <input type="text" id="postOffice" placeholder="Post Office *" required>
            
            <div style="display:flex; gap:10px;">
                <input type="text" id="pincode" placeholder="Pincode *" required style="flex: 1;">
                <input type="text" id="district" placeholder="District *" required style="flex: 1;">
            </div>
            
            <div style="display:flex; gap:10px;">
                <input type="text" id="state" placeholder="State *" required style="flex: 1;">
                <input type="text" id="country" placeholder="Country *" value="India" required style="flex: 1;">
            </div>

            <p style="font-size: 0.8em; color: #666; margin: 0; text-align: left;">* Required Fields</p>

            <div style="margin-top:20px; display:flex; gap:12px;">
                <button type="submit" id="placeOrderBtn" style="flex: 2;">Place Order on WhatsApp</button>
                <button type="button" class="close-btn" onclick="closePopup()" style="flex: 1;">Cancel</button>
            </div>
        </form>
    `;
    
    const detailsContainer = document.getElementById('popup-details');
    if(detailsContainer){
        detailsContainer.innerHTML = detailsHtml;

        // 4. Attach submission handler to the form
        const orderForm = document.getElementById('orderForm');
        if(orderForm) orderForm.onsubmit = submitOrder;
    }

    // 5. Display the popup
    const popup = document.getElementById('popup');
    if(popup){
        popup.style.display = 'flex';
        popup.setAttribute('aria-hidden','false');
    }

    document.addEventListener('keydown', escHandler);
}

function closePopup(){
    const popup = document.getElementById('popup');
    if(popup){
        popup.style.display = 'none';
        popup.setAttribute('aria-hidden','true');
    }
    document.removeEventListener('keydown', escHandler);
}

function escHandler(e){
    if(e.key === 'Escape') closePopup();
}

// --- FORM SUBMISSION LOGIC ---
function submitOrder(event) {
    event.preventDefault(); // Stop default form submission

    // Read form values
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    const houseNumber = document.getElementById('houseNumber').value.trim();
    const locality = document.getElementById('locality').value.trim();
    const place = document.getElementById('place').value.trim();
    const postOffice = document.getElementById('postOffice').value.trim();
    const pincode = document.getElementById('pincode').value.trim();
    const district = document.getElementById('district').value.trim();
    const state = document.getElementById('state').value.trim();
    const country = document.getElementById('country').value.trim();

    // Construct WhatsApp message including ARTCODE
    const message = `
*New Order – Lj Boutique*
--------------------
*ITEM DETAILS*
Product: ${selectedProduct.name}
ARTNUM: ${selectedProduct.artnum}
Style: ${selectedProduct.style}
Rate: ${selectedProduct.rate}
Size: ${selectedProduct.size}
Material: ${selectedProduct.material}

*CUSTOMER CONTACT*
Name: ${customerName}
Phone: ${customerPhone}

*SHIPPING ADDRESS*
House: ${houseNumber}
Locality: ${locality}
Place: ${place}
Post Office: ${postOffice}
Pincode: ${pincode}
District: ${district}
State: ${state}
Country: ${country}
`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${WA_PHONE_NUMBER}?text=${encoded}`;
    window.open(url, '_blank');

    closePopup();
}

// Utility to sanitize HTML
function escapeHtml(str){
    return String(str || '') // Handle null/undefined input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


// --- NEW ADMIN PANEL LOGIC ---

// Credentials
const ADMIN_USER = 'littaaj';
const ADMIN_PASS = 'litta@admin123';

/**
 * Toggles the visibility of the admin sidebar.
 */
function toggleSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

// Ensure the function is explicitly available on the global window object
window.toggleSidebar = toggleSidebar;
window.logoutAdmin = logoutAdmin; // Also ensure logout is global

/**
 * Handles the admin login form submission.
 */
function handleLogin(event) {
    event.preventDefault();

    const usernameInput = document.getElementById('adminUsername');
    const passwordInput = document.getElementById('adminPassword');
    const loginMessage = document.getElementById('loginMessage');
    
    loginMessage.textContent = ''; // Clear previous messages

    if (usernameInput.value === ADMIN_USER && passwordInput.value === ADMIN_PASS) {
        isAdminLoggedIn = true;
        // Switch view to product addition form
        document.getElementById('loginView').classList.add('hidden');
        document.getElementById('productAddView').classList.remove('hidden');
        // Clear login fields
        usernameInput.value = '';
        passwordInput.value = '';
        // Clear previous product message
        document.getElementById('productAddMessage').textContent = '';
    } else {
        loginMessage.textContent = 'Invalid username or password. Please try again.';
        passwordInput.value = ''; // Clear password on failure
    }
}

/**
 * Handles the product addition form submission.
 */
function handleProductAdd(event) {
    event.preventDefault();

    const productAddMessage = document.getElementById('productAddMessage');
    productAddMessage.textContent = ''; // Clear previous messages

    // 1. Collect and validate product data
    const data = {
        title: document.getElementById('newTitle').value.trim(),
        img: document.getElementById('newImg').value.trim(),
        rate: document.getElementById('newRate').value.trim(),
        price: document.getElementById('newPrice').value.trim(), // Optional field
        size: document.getElementById('newSize').value.trim(),
        artnum: document.getElementById('newArtnum').value.trim(),
        style: document.getElementById('newStyle').value.trim(),
        material: document.getElementById('newMaterial').value.trim() || 'N/A' // Optional
    };

    // Basic validation
    if (!data.title || !data.img || !data.rate || !data.size || !data.artnum || !data.style) {
        productAddMessage.textContent = 'Please fill in all required fields (Title, Image, Rate, Size, ARTNUM, Style).';
        productAddMessage.classList.remove('success-message');
        productAddMessage.classList.add('error-message');
        return;
    }

    // 2. Create the new product card HTML
    // Note: The openPopupFromCard function is now guaranteed to be globally accessible.
    const newProductHTML = `
        <div class="item">
            <img src="${escapeHtml(data.img)}" 
                 alt="${escapeHtml(data.title)}" 
                 data-size="${escapeHtml(data.size)}" 
                 data-rate="${escapeHtml(data.rate)}" 
                 data-material="${escapeHtml(data.material)}" 
                 data-style="${escapeHtml(data.style)}" 
            />
            <div class="title">${escapeHtml(data.title)}</div>
            <div class="price">${escapeHtml(data.rate)}</div>
            ${data.price ? `<div class="discount-price" style="text-decoration: line-through; color: #888; font-size: 0.9em; margin-top: -5px;">${escapeHtml(data.price)}</div>` : ''}
            <div class="artnum">${escapeHtml(data.artnum)}</div>
            <div class="actions">
                <button onclick="openPopupFromCard(this)">View Details</button>
            </div>
        </div>
    `;

    // 3. Insert the new product card into the gallery
    const gallery = document.getElementById('gallery');
    if (gallery) {
        gallery.insertAdjacentHTML('afterbegin', newProductHTML);
    }
    
    // 4. Provide success feedback and reset form
    productAddMessage.textContent = `Successfully added: ${data.title} (${data.artnum}). (Temporary session data)`;
    productAddMessage.classList.remove('error-message');
    productAddMessage.classList.add('success-message');
    document.getElementById('productAddForm').reset();
}

/**
 * Logs out the admin user.
 */
function logoutAdmin() {
    isAdminLoggedIn = false;
    document.getElementById('productAddView').classList.add('hidden');
    document.getElementById('loginView').classList.remove('hidden');
    document.getElementById('loginMessage').textContent = 'Logged out successfully.';
    document.getElementById('loginMessage').classList.remove('error-message');
    document.getElementById('loginMessage').classList.add('success-message');
    // Keep sidebar open so the user sees the confirmation
}


// --- INITIAL SETUP (ON WINDOW LOAD) ---
document.addEventListener('DOMContentLoaded', () => {
    // Attach event listeners for the new forms
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const productAddForm = document.getElementById('productAddForm');
    if (productAddForm) {
        productAddForm.addEventListener('submit', handleProductAdd);
    }

    // Existing: Clicking image also opens popup
    const gallery = document.getElementById('gallery');
    if (gallery) {
        gallery.addEventListener('click', function(e){
            const img = e.target.closest('img');
            // Ensure it's an img tag directly inside an .item that was clicked
            if(img && img.closest('.item') === e.target.closest('.item')) {
                 openPopup(img);
            }
        });
    }
});