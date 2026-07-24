const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzPp0INEFbok-kQG08nt0D9YrWzJNMrH_drJP2ODTPbuYe8o5c-hRdlJMVNQRLEN2BT/exec";

const orderBtn = document.getElementById("orderBtn");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");
const orderForm = document.getElementById("orderForm");

const submitBtn = document.getElementById("submitBtn");
const submitBtnText = document.getElementById("submitBtnText");
const formMessage = document.getElementById("formMessage");

orderBtn.addEventListener("click", () => {
    popup.classList.add("active");
});

closePopup.addEventListener("click", () => {
    popup.classList.remove("active");
    clearMessage();
});

window.addEventListener("click", (e) => {
    if (e.target === popup) {
        popup.classList.remove("active");
        clearMessage();
    }
});

function showMessage(text, type) {
    formMessage.innerHTML = text;
    formMessage.className = "form-message show " + type;
}

function clearMessage() {
    formMessage.innerHTML = "";
    formMessage.className = "form-message";
}

function loading(state) {
    submitBtn.disabled = state;

    if (state) {
        submitBtn.classList.add("loading");
        submitBtnText.innerHTML = "Submitting...";
    } else {
        submitBtn.classList.remove("loading");
        submitBtnText.innerHTML = "Place Order";
    }
}

orderForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    clearMessage();

    loading(true);

    const data = {
        product: "Premium Product",
        name: document.getElementById("name").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        city: document.getElementById("city").value.trim(),
        address: document.getElementById("address").value.trim(),
        quantity: document.getElementById("quantity").value,
        price: "1999"
    };

    try {

        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.status === "success") {

            showMessage("✅ Order Submitted Successfully!", "success");

            orderForm.reset();

            setTimeout(() => {
                popup.classList.remove("active");
                clearMessage();
            }, 1500);

        } else {

            showMessage("❌ " + result.message, "error");

        }

    } catch (err) {

        console.error(err);

        showMessage("❌ Server Error. Please try again.", "error");

    }

    loading(false);

});