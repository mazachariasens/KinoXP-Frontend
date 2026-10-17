const createMovieForm = document.getElementById("create-movie-form");
const createMovieMessage = document.getElementById("create-movie-message");
const createMovieButton = document.getElementById("create-movie-button");

createMovieForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const movie = {
        title: document.getElementById("title").value.trim(),
        category: document.getElementById("category").value.trim(),
        ageLimit: Number(document.getElementById("ageLimit").value),
        duration: Number(document.getElementById("duration").value)
    };

    createMovieButton.disabled = true;
    createMovieMessage.textContent = "Gemmer film...";

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

        createMovieForm.reset();
        createMovieMessage.textContent = `Filmen "${savedMovie.title}" er oprettet.`;

        await loadMovieList();

    } catch (error) {
        createMovieMessage.textContent = error.message;

    } finally {
        createMovieButton.disabled = false;
    }

});