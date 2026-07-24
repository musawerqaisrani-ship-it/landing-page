const orderBtn = document.getElementById("orderBtn");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");
const orderForm = document.getElementById("orderForm");

const API_URL = "https://script.google.com/macros/s/AKfycbzPp0INEFbok-kQG08nt0D9YrWzJNMrH_drJP2ODTPbuYe8o5c-hRdlJMVNQRLEN2BT/exec";

orderBtn.onclick = () => {
    popup.classList.add("active");
};

closePopup.onclick = () => {
    popup.classList.remove("active");
};

window.onclick = (e) => {
    if (e.target == popup) {
        popup.classList.remove("active");
    }
};

orderForm.addEventListener("submit", async function(e){

    e.preventDefault();

    const orderData = {

        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        city: document.getElementById("city").value,
        address: document.getElementById("address").value,
        quantity: document.getElementById("quantity").value,
        product: "Premium Product"

    };

    try{

        const response = await fetch(API_URL,{

            method:"POST",

            body:JSON.stringify(orderData)

        });

        const result = await response.json();

        if(result.success){

            alert("✅ Order Submitted Successfully!");

            orderForm.reset();

            popup.classList.remove("active");

        }else{

            alert("Something went wrong.");

        }

    }catch(err){

        alert("Server Error!");

        console.log(err);

    }

});