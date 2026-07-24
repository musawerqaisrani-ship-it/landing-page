// ============================================================
// CONFIG
// ============================================================
// Your Google Apps Script Web App deployment URL (the /exec URL,
// NOT the /library URL — libraries cannot be called over HTTP).
const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzPp0INEFbok-kQG08nt0D9YrWzJNMrH_drJP2ODTPbuYe8o5c-hRdlJMVNQRLEN2BT/exec";

// ============================================================
// ELEMENT REFERENCES
// ============================================================
const orderBtn = document.getElementById("orderBtn");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");
const orderForm = document.getElementById("orderForm");
const formMessage = document.getElementById("formMessage");
const submitBtn = document.getElementById("submitBtn");
const submitBtnText = document.getElementById("submitBtnText");

// ============================================================
// POPUP OPEN / CLOSE
// ============================================================
function openPopup() {
    popup.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closePopupModal() {
    popup.classList.remove("active");
    document.body.style.overflow = "auto";
    clearFormMessage();
}

orderBtn.addEventListener("click", openPopup);

closePopup.addEventListener("click", closePopupModal);

popup.addEventListener("click", function (e) {
    if (e.target === popup) {
        closePopupModal();
    }
});

// Close popup with the Escape key (nice-to-have, keeps UX solid)
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && popup.classList.contains("active")) {
        closePopupModal();
    }
});

// ============================================================
// FORM MESSAGE HELPERS (replaces browser alert())
// ============================================================
function showFormMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = "form-message show " + type; // "success" | "error"
}

function clearFormMessage() {
    formMessage.textContent = "";
    formMessage.className = "form-message";
}

// ============================================================
// SUBMIT BUTTON LOADING STATE
// ============================================================
function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle("loading", isLoading);
    submitBtnText.textContent = isLoading ? "Placing Order..." : "Place Order";
}

// ============================================================
// FORM SUBMIT -> SAVE DIRECTLY TO GOOGLE SHEETS
// ============================================================
orderForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    clearFormMessage();

    const nameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone");
    const cityInput = document.getElementById("city");
    const addressInput = document.getElementById("address");
    const quantityInput = document.getElementById("quantity");

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const city = cityInput.value.trim();
    const address = addressInput.value.trim();
    const quantity = quantityInput.value;

    // Basic client-side validation
    if (name === "" || phone === "" || city === "" || address === "") {
        showFormMessage("Please fill all fields.", "error");
        return;
    }

    const phonePattern = /^[0-9+\-\s]{7,15}$/;
    if (!phonePattern.test(phone)) {
        showFormMessage("Please enter a valid phone number.", "error");
        return;
    }

    const orderData = {
        product: "Premium Product",
        name: name,
        phone: phone,
        city: city,
        address: address,
        quantity: quantity,
        price: "Rs.1999",
        timestamp: new Date().toISOString()
    };

    setLoading(true);

    try {
        // IMPORTANT: Content-Type is "text/plain" on purpose.
        // Google Apps Script Web Apps do not handle the CORS
        // "preflight" (OPTIONS) request that browsers send
        // automatically for "application/json" bodies.
        // Sending as text/plain keeps this a "simple request",
        // which skips preflight, avoids CORS errors, and still
        // lets us send a JSON string that Code.gs parses itself.
        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error("Server responded with status " + response.status);
        }

        const result = await response.json();

        if (result && result.status === "success") {
            showFormMessage("✅ Order placed successfully! We'll contact you soon.", "success");
            orderForm.reset();

            // Give the user a moment to read the success message,
            // then close the popup automatically.
            setTimeout(() => {
                closePopupModal();
            }, 1800);
        } else {
            const errorMsg = (result && result.message) ? result.message : "Something went wrong. Please try again.";
            showFormMessage("❌ " + errorMsg, "error");
        }
    } catch (error) {
        console.error("Order submission failed:", error);
        showFormMessage("❌ Could not submit your order. Please check your internet connection and try again.", "error");
    } finally {
        setLoading(false);
    }
});
