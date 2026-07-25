/**
 * ============================================================
 * RIVAAJ MAHAL HAIR OIL — Frontend Script with Google Sheets Integration
 * ============================================================
 */

const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzPp0INEFbok-kQG08nt0D9YrWzJNMrH_drJP2ODTPbuYe8o5c-hRdlJMVNQRLEN2BT/exec";

// DOM Elements
const orderBtn = document.getElementById("orderBtn");
const stickyOrderBtn = document.getElementById("stickyOrderBtn");
const addToCartBtn = document.getElementById("addToCartBtn");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");
const orderForm = document.getElementById("orderForm");
const formMessage = document.getElementById("formMessage");
const submitBtn = document.getElementById("submitBtn");
const submitBtnText = document.getElementById("submitBtnText");

const qtyInput = document.getElementById("qtyInput");
const minusBtn = document.getElementById("minusBtn");
const plusBtn = document.getElementById("plusBtn");
const popupQuantityInput = document.getElementById("quantity");
const totalPriceDisplay = document.getElementById("totalPriceDisplay");

const UNIT_PRICE = 2000;

// Quantity Stepper Logic
function updateQuantity(newQty) {
    let q = parseInt(newQty, 10);
    if (isNaN(q) || q < 1) q = 1;
    if (q > 10) q = 10;

    if (qtyInput) qtyInput.value = q;
    if (popupQuantityInput) popupQuantityInput.value = q;

    const total = q * UNIT_PRICE;
    if (totalPriceDisplay) {
        totalPriceDisplay.textContent = "Rs. " + total.toLocaleString("en-US") + ".00";
    }
}

if (minusBtn) {
    minusBtn.addEventListener("click", () => {
        const current = parseInt(qtyInput ? qtyInput.value : "1", 10);
        updateQuantity(current - 1);
    });
}

if (plusBtn) {
    plusBtn.addEventListener("click", () => {
        const current = parseInt(qtyInput ? qtyInput.value : "1", 10);
        updateQuantity(current + 1);
    });
}

if (popupQuantityInput) {
    popupQuantityInput.addEventListener("input", (e) => {
        updateQuantity(e.target.value);
    });
}

// Image Gallery Switcher
function changeImage(src, element) {
    const mainImg = document.getElementById("mainProductImg");
    if (mainImg) {
        mainImg.src = src;
    }
    
    const thumbs = document.querySelectorAll(".thumb-item");
    thumbs.forEach(t => t.classList.remove("active"));
    if (element) {
        element.classList.add("active");
    }
}

// Modal Open / Close
function openPopupModal() {
    if (!popup) return;
    popup.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closePopupModal() {
    if (!popup) return;
    popup.classList.remove("active");
    document.body.style.overflow = "auto";
    clearFormMessage();
}

if (orderBtn) orderBtn.addEventListener("click", openPopupModal);
if (stickyOrderBtn) stickyOrderBtn.addEventListener("click", openPopupModal);
if (addToCartBtn) addToCartBtn.addEventListener("click", openPopupModal);
if (closePopup) closePopup.addEventListener("click", closePopupModal);

if (popup) {
    popup.addEventListener("click", function (e) {
        if (e.target === popup) closePopupModal();
    });
}

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && popup && popup.classList.contains("active")) {
        closePopupModal();
    }
});

// Form Message Helpers
function showFormMessage(text, type) {
    if (!formMessage) return;
    formMessage.textContent = text;
    formMessage.className = "form-message show " + type;
}

function clearFormMessage() {
    if (!formMessage) return;
    formMessage.textContent = "";
    formMessage.className = "form-message";
}

function setLoadingState(isLoading) {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;

    if (isLoading) {
        submitBtn.classList.add("loading");
        if (submitBtnText) submitBtnText.textContent = "Submitting Order...";
    } else {
        submitBtn.classList.remove("loading");
        if (submitBtnText) submitBtnText.textContent = "Confirm Cash on Delivery Order";
    }
}

// Form Submission -> Google Apps Script
if (orderForm) {
    orderForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        clearFormMessage();

        const nameInput = document.getElementById("name");
        const phoneInput = document.getElementById("phone");
        const cityInput = document.getElementById("city");
        const addressInput = document.getElementById("address");
        const qtyVal = popupQuantityInput ? popupQuantityInput.value : "1";

        const name = nameInput ? nameInput.value.trim() : "";
        const phone = phoneInput ? phoneInput.value.trim() : "";
        const city = cityInput ? cityInput.value.trim() : "";
        const address = addressInput ? addressInput.value.trim() : "";

        if (!name || !phone || !city || !address) {
            showFormMessage("Please fill in all required fields.", "error");
            return;
        }

        const phoneClean = phone.replace(/[\s\-\+\(\)]/g, "");
        if (phoneClean.length < 7 || isNaN(phoneClean)) {
            showFormMessage("Please enter a valid phone number.", "error");
            return;
        }

        const totalAmount = parseInt(qtyVal, 10) * UNIT_PRICE;

        const payload = {
            timestamp: new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" }),
            product: "Rivaaj Mahal Hair Oil",
            name: name,
            phone: phone,
            city: city,
            address: address,
            quantity: qtyVal,
            price: "Rs. " + totalAmount.toLocaleString("en-US") + ".00"
        };

        setLoadingState(true);

        try {
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
                throw new Error("Server returned an invalid response format.");
            }

            if (result && result.status === "success") {
                showFormMessage("✅ Order Placed Successfully! We will deliver within 2 to 5 days.", "success");
                orderForm.reset();
                updateQuantity(1);

                setTimeout(() => {
                    closePopupModal();
                }, 2200);
            } else {
                const errorText = (result && result.message) ? result.message : "Could not submit your order.";
                showFormMessage("❌ " + errorText, "error");
            }
        } catch (err) {
            console.error("Order submission error:", err);
            showFormMessage("❌ Could not submit your order. Please check your internet connection.", "error");
        } finally {
            setLoadingState(false);
        }
    });
}