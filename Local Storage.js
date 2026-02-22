let cart = JSON.parse(localStorage.getItem("cart")) || [];

(function () {
  emailjs.init("-VxSN8dfUtbhiHzMl"); // <-- replace with your EmailJS Public Key
})();

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

  if (!cartItems || !totalElement) return;

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} x ${item.quantity} - ₱${item.price * item.quantity}
      <button onclick="removeFromCart(${item.id})">Remove</button>
    `;
    cartItems.appendChild(li);
  });

  totalElement.textContent = "Total: ₱" + total;
}

function purchase() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const email = document.getElementById("email")?.value.trim();

  if (!email) {
    alert("Please enter your email.");
    return;
  }

  let orderDetails = "";
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    orderDetails += `${item.name} x ${item.quantity} - ₱${itemTotal}\n`;
  });

  const templateParams = {
    to_email: email,
    order_details: orderDetails,
    order_total: total
  };

  emailjs.send("service_e6gie82", "template_0a6tses", templateParams)
    .then(function (response) {
      alert("Purchase successful! Confirmation email sent.");
      console.log("SUCCESS!", response);

      cart = [];
      updateCart();
      localStorage.removeItem("cart");

      const form = document.querySelector("form");
      if (form) form.reset();
    })
    .catch(function (error) {
      console.error("FAILED...", error);
      alert("Failed to send email.");
    });
}

window.addEventListener("load", updateCart); 