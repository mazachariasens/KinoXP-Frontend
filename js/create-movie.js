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
        const response = await fetch("/api/movies", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(movie)
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));

            throw new Error(error.message || "Filmen kunne ikke oprettes."
            );

        }

        const savedMovie = await response.json();

        form.reset();
        message.textContent = `Filmen "${savedMovie.title}" er oprettet.`;
    } catch (error) {
        message.textContent = error.message;

    } finally {
        button.disabled = false;
    }

});