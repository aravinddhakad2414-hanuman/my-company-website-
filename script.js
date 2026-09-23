const form = document.getElementById("contactForm");
const message = document.getElementById("message");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    message.textContent =
        "Thank you! Your consultation request has been received.";

    message.style.color = "#55d6be";

    form.reset();
});
