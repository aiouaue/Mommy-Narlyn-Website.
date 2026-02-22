let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(id, name, price) {
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }

  updateCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

function updateCart() {
  localStorage.setItem("cart", JSON.stringify(cart));

  const cartItems = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} x ${item.quantity} - $${item.price * item.quantity}
      <button onclick="removeFromCart(${item.id})">Remove</button>
    `;
    cartItems.appendChild(li);
  });

  totalElement.textContent = "Total: $" + total;
}

function purchase() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  alert("Thank you for your purchase!");
  cart = [];
  updateCart();
}

updateCart();