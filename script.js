const orderBtn = document.getElementById("orderBtn");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");
const orderForm = document.getElementById("orderForm");

const API_URL = "https://script.google.com/macros/s/AKfycbzPp0INEFbok-kQG08nt0D9YrWzJNMrH_drJP2ODTPbuYe8o5c-hRdlJMVNQRLEN2BT/exec";

// Open Popup
orderBtn.addEventListener("click", () => {
    popup.classList.add("active");
});

// Close Popup
closePopup.addEventListener("click", () => {
    popup.classList.remove("active");
});

// Close when clicking outside
window.addEventListener("click", (e) => {
    if (e.target === popup) {
        popup.classList.remove("active");
    }
});

// Submit Order
orderForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const submitBtn = document.querySelector(".submit-btn");
    submitBtn.disabled = true;
    submitBtn.innerText = "Submitting...";

    const orderData = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        city: document.getElementById("city").value,
        address: document.getElementById("address").value,
        quantity: document.getElementById("quantity").value,
        product: "Premium Product"
    };

    try {

        await fetch(API_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        });

        alert("✅ Your order has been received successfully!");

        orderForm.reset();

        popup.classList.remove("active");

    } catch (error) {

        alert("❌ Failed to submit order. Please try again.");

        console.error(error);

    }

    submitBtn.disabled = false;
    submitBtn.innerText = "Submit Order";

});