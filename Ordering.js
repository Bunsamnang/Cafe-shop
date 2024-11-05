// Function to get URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id'),
        name: decodeURIComponent(params.get('name')),
        price: parseFloat(params.get('price')), // Parse price as float
    };
}

let basePrice; // Declare basePrice globally so we can access it in multiple functions
let quantity = 1;
let cart = [];

// Function to get price adjustment based on selected size
function getSizePriceAdjustment() {
    const selectedOption = document.querySelector('.size-answer:checked'); // Get selected size option
    if (selectedOption) {
        if (selectedOption.id === "option2_size") {
            return 0.50; // Medium
        } else if (selectedOption.id === "option3_size") {
            return 1.00; // Large
        }
    }
    return 0; // Default to 0 if small or no option selected
}

// Function to render the page based on parameters
function renderPage() {
    const { id, name, price } = getUrlParams(); // Get the parameters from the URL
    basePrice = price; // Store the base price globally
    
    const img = document.createElement('img');
    const textElement = document.createElement('p');
    const priceElement = document.getElementById('price');
    const quantityElement = document.getElementById('quantity');

    textElement.textContent = name; // Display the name of the drink
    priceElement.textContent = `Price: $${basePrice.toFixed(2)}`; // Display initial price
    quantityElement.textContent = quantity;

    // Choose the image based on the ID passed in the URL
    if (id == 1) {
        img.src = 'https://images.ctfassets.net/v601h1fyjgba/71VWCR6Oclk14tsdM9gTyM/6921cc6b21746f62846c99fa6a872c35/Iced_Latte.jpg';
    } else if (id == 2) {
        img.src = 'https://www.yesmooretea.com/wp-content/uploads/2021/11/Iced-Americano-2.jpg';
    } else if (id == 3) {
        img.src = 'https://142079338.cdn6.editmysite.com/uploads/1/4/2/0/142079338/s589659027750538725_p149_i1_w598.jpeg';
    } else if (id == 4) {
        img.src = 'https://images.aws.nestle.recipes/resized/08ee4b739607eed390994f64190cd0a4_iced_shaken_espresso_nescafe_1080_850.jpg';
    }
    else if (id == 5) {
        img.src = 'https://i0.wp.com/www.sipandsanity.com/wp-content/uploads/2023/04/FI-iced-chocolate-almond-milk-shaken-espresso.jpg?ssl=1';
    }
    else if (id == 6) {
        img.src = 'https://gimmedelicious.com/wp-content/uploads/2018/03/Iced-Matcha-Latte2.jpg';
    }
    else if (id == 7) {
        img.src = 'https://www.allrecipes.com/thmb/LgtetzzQWH3GMxFISSii84XEAB8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/258686-IcedCaramelMacchiato-ddmps-4x3-104704-2effb74f7d504b8aa5fbd52204d0e2e5.jpg';
    }
    else if (id == 8) {
        img.src = 'https://feynman.coffee/cdn/shop/products/IcedMocha-01_2048x.jpg?v=1617701624';
    }

    // Clear previous content and append new image and text
    document.getElementById("Img").innerHTML = '';
    document.getElementById("Img").appendChild(img);

    document.getElementById("Txt").innerHTML = '';
    document.getElementById("Txt").appendChild(textElement);

}

// Function to update the total price based on selected size
function updateTotal() {
    let updatedPrice = basePrice + getSizePriceAdjustment(); // Add price adjustment for size
    const total = updatedPrice * quantity;

    // Update the total price on the page
    document.getElementById('price').textContent = `Price: $${total.toFixed(2)}`;
}

// Function to handle quantity change
function handleQuantityChange(change) {
    const quantityElement = document.getElementById('quantity');
    quantity += change; // Update quantity by change (+1 or -1)
    
    // Prevent negative or zero quantity
    if (quantity < 1) {
        quantity = 1;
    }

    quantityElement.textContent = quantity; // Update the quantity display
    updateTotal(); // Recalculate total
}

// Function to add item to cart
// Function to add item to cart and store it in localStorage
function addToCart() {
    const { id, name } = getUrlParams();
    let price = basePrice + getSizePriceAdjustment();
    let ice = 0;
    let sugar = 0;
    let size = '';
    
    const selectedIceOption = document.querySelector('.ice-answer:checked');
    const selectedSugarOption = document.querySelector('.sugar-answer:checked');
    const selectedSizeOption = document.querySelector('.size-answer:checked'); // Get selected size option

    if (selectedSizeOption) {
        if (selectedSizeOption.id === "option1_size") {
            size = 'Small'; // Medium
        } else if (selectedSizeOption.id === "option2_size") {
            size = 'Medium'; // Medium
        } else {
            size = 'Large'; // Large
        }
    }

    if (selectedIceOption) {
        if (selectedIceOption.id === "option1_ice") {
            ice = 25; // Medium
        } else if (selectedIceOption.id === "option2_ice") {
            ice = 50; // Large
        } else if (selectedIceOption.id === "option3_ice") {
            ice = 75; // Large
        } else {
            ice = 100;
        }
    }

    if (selectedSugarOption) {
        if (selectedSugarOption.id === "option1_sugar") {
            sugar = 25; // Medium
        } else if (selectedSugarOption.id === "option2_sugar") {
            sugar = 50; // Large
        } else if (selectedSugarOption.id === "option3_sugar") {
            sugar = 75; // Large
        } else {
            sugar = 100;
        }
    }


    cart.push({ id, name, price, quantity, size, ice, sugar });

    // Store the updated cart in localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    alert("Item added to cart!");
}


// Call the renderPage function when the page loads
window.onload = function() {
    renderPage();
    cart = JSON.parse(localStorage.getItem('cart')) || [];


    // Add event listeners to radio buttons to update price when size changes
    document.querySelectorAll('.size-answer').forEach(optionEl => {
        optionEl.addEventListener('change', updateTotal); // Call updateTotal() when size changes
    });

    document.getElementById('increase').addEventListener('click', function() {
        handleQuantityChange(1); // Increase quantity
    });

    document.getElementById('decrease').addEventListener('click', function() {
        handleQuantityChange(-1); // Decrease quantity
    });
};
