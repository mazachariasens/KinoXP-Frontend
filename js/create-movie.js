const form = document.getElementById("create-movie-form");
const message = document.getElementById("create-movie-message");
const button = document.getElementById("create-movie-button");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const movie = {
        title: document.getElementById("title").value.trim(),
        category: document.getElementById("category").value.trim(),
        ageLimit: Number(document.getElementById("ageLimit").value),
        duration: Number(document.getElementById("duration").value)
    };

    button.disabled = true;
    message.textContent = "Gemmer film...";

    try {
        const response = await fetch("http://localhost:8080/api/movies"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        }
    }


}