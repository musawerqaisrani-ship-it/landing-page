/**
 * ============================================================
 * MOSAWER SHOPs — Frontend Script for GitHub Pages
 * ============================================================
 */

// Google Apps Script Web App Endpoint URL
const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzPp0INEFbok-kQG08nt0D9YrWzJNMrH_drJP2ODTPbuYe8o5c-hRdlJMVNQRLEN2BT/exec";

// DOM Element References
const orderBtn = document.getElementById("orderBtn");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");
const orderForm = document.getElementById("orderForm");
const formMessage = document.getElementById("formMessage");
const submitBtn = document.getElementById("submitBtn");
const submitBtnText = document.getElementById("submitBtnText");

// Open Popup Modal
function openPopupModal() {
    if (!popup) return;
    popup.classList.add("active");
    document.body.style.overflow = "hidden";
}

// Close Popup Modal
function closePopupModal() {
    if (!popup) return;
    popup.classList.remove("active");
    document.body.style.overflow = "auto";
    clearFormMessage();
}

// Event Listeners for Opening / Closing Modal
if (orderBtn) {
    orderBtn.addEventListener("click", openPopupModal);
}

if (closePopup) {
    closePopup.addEventListener("click", closePopupModal);
}

if (popup) {
    popup.addEventListener("click", function (e) {
        if (e.target === popup) {
            closePopupModal();
        }
    });
}

// Close Popup on Escape Key
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && popup && popup.classList.contains("active")) {
        closePopupModal();
    }
});

// Display Form Success / Error Message
function showFormMessage(text, type) {
    if (!formMessage) return;
    formMessage.textContent = text;
    formMessage.className = "form-message show " + type; // "success" or "error"
}

// Clear Form Message
function clearFormMessage() {
    if (!formMessage) return;
    formMessage.textContent = "";
    formMessage.className = "form-message";
}

// Set Loading State for Submit Button
function setLoadingState(isLoading) {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;

    if (isLoading) {
        submitBtn.classList.add("loading");
        if (submitBtnText) submitBtnText.textContent = "Placing Order...";
    } else {
        submitBtn.classList.remove("loading");
        if (submitBtnText) submitBtnText.textContent = "Place Order";
    }
}

// Handle Form Submission
if (orderForm) {
    orderForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        clearFormMessage();

        const nameInput = document.getElementById("name");
        const phoneInput = document.getElementById("phone");
        const cityInput = document.getElementById("city");
        const addressInput = document.getElementById("address");
        const quantityInput = document.getElementById("quantity");

        const name = nameInput ? nameInput.value.trim() : "";
        const phone = phoneInput ? phoneInput.value.trim() : "";
        const city = cityInput ? cityInput.value.trim() : "";
        const address = addressInput ? addressInput.value.trim() : "";
        const quantity = quantityInput ? quantityInput.value.trim() : "1";

        // Client-side validation
        if (!name || !phone || !city || !address) {
            showFormMessage("Please fill in all required fields.", "error");
            return;
        }

        // Phone number validation (at least 7 digits)
        const phoneClean = phone.replace(/[\s\-\+\(\)]/g, "");
        if (phoneClean.length < 7 || isNaN(phoneClean)) {
            showFormMessage("Please enter a valid phone number.", "error");
            return;
        }

        const payload = {
            timestamp: new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" }),
            product: "MOSAWER SHOP Product",
            name: name,
            phone: phone,
            city: city,
            address: address,
            quantity: quantity,
            price: "Rs.1999"
        };

        setLoadingState(true);

        try {
            // Note: Sending body as text/plain prevents browser CORS OPTIONS preflight
            // while allowing Google Apps Script doPost to receive and parse the JSON string.
            const response = await fetch(SCRIPT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify(payload),
                redirect: "follow"
            });

            const responseText = await response.text();
            let result;

            try {
                result = JSON.parse(responseText);
            } catch (jsonErr) {
                console.error("Non-JSON response received:", responseText);
                throw new Error("Server returned an invalid response format.");
            }

            if (result && result.status === "success") {
                showFormMessage("✅ Order Placed Successfully! We will contact you soon.", "success");
                orderForm.reset();

                // Close popup after 2 seconds to let customer read confirmation
                setTimeout(() => {
                    closePopupModal();
                }, 2000);
            } else {
                const errorText = (result && result.message) ? result.message : "Could not submit your order. Please try again.";
                showFormMessage("❌ " + errorText, "error");
            }
        } catch (err) {
            console.error("Order submission error:", err);
            showFormMessage("❌ Could not submit your order. Please check your internet connection or server deployment.", "error");
        } finally {
            setLoadingState(false);
        }
    });
}