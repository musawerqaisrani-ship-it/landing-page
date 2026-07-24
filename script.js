const orderBtn = document.getElementById("orderBtn");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");
const orderForm = document.getElementById("orderForm");

orderBtn.addEventListener("click", () => {
    popup.classList.add("active");
    document.body.style.overflow = "hidden";
});

closePopup.addEventListener("click", () => {
    popup.classList.remove("active");
    document.body.style.overflow = "auto";
});

popup.addEventListener("click", function(e){
    if(e.target === popup){
        popup.classList.remove("active");
        document.body.style.overflow = "auto";
    }
});

orderForm.addEventListener("submit", function(e){

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const city = document.getElementById("city").value.trim();
    const address = document.getElementById("address").value.trim();
    const quantity = document.getElementById("quantity").value;

    if(name==="" || phone==="" || city==="" || address===""){
        alert("Please fill all fields.");
        return;
    }

    const message =
`🛒 *NEW ORDER*

📦 Product: Premium Product

👤 Name: ${name}

📞 Phone: ${phone}

🏙️ City: ${city}

🏠 Address: ${address}

🔢 Quantity: ${quantity}

💰 Price: Rs.1999

Please confirm my order.`;

    const whatsapp =
`https://wa.me/923417087991?text=${encodeURIComponent(message)}`;

    window.open(whatsapp,"_blank");

});