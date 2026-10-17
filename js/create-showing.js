
const form = document.getElementById("create-showing-form");
const movieSelect = document.getElementById("showing-movie");
const theaterSelect = document.getElementById("showing-theater");
const startsAtInput = document.getElementById("showing-starts-at");
const message = document.getElementById("create-showing-message");
const submitButton = document.getElementById("create-showing-button");

// Hent eksisterende film og vis dem i dropdown-listen.
async function loadMovies() {
    const response = await fetch("/api/movies");

    if (!response.ok) {
        throw new Error("Kunne ikke hente film.");
    }

    const movies = await response.json();

    movieSelect.replaceChildren(
        new Option("Vælg film", "")
    );

    movies.forEach(movie => {
        movieSelect.add(
            new Option(movie.title, movie.movieId)
        );
    });
}

// Hent eksisterende sale og vis dem i dropdown-listen.
async function loadTheaters() {
    const response = await fetch("/api/theaters");

    if (!response.ok) {
        throw new Error("Kunne ikke hente biografsale.");
    }

    const theaters = await response.json();

    theaterSelect.replaceChildren(
        new Option("Vælg sal", "")
    );

    theaters.forEach(theater => {
        theaterSelect.add(
            new Option(theater.name, theater.theaterId)
        );
    });
}

// Indlæs film og sale, når siden åbner.
async function initializeShowingForm() {
    try {
        await Promise.all([
            loadMovies(),
            loadTheaters()
        ]);
    } catch (error) {
        message.textContent = error.message;
        console.error(error);
    }
}

// Opret forestillingen i backend.
form.addEventListener("submit", async event => {
    event.preventDefault();

    const request = {
        movieId: Number(movieSelect.value),
        theaterId: Number(theaterSelect.value),
        startsAt: startsAtInput.value
    };

    submitButton.disabled = true;
    message.textContent = "Opretter forestilling...";

    try {
        const response = await fetch("/api/showings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));

            throw new Error(
                error.error || error.message ||
                "Kunne ikke oprette forestillingen."
            );
        }

        message.textContent = "Forestillingen er oprettet.";
        form.reset();

        // Opdater forestillingsoversigten.
        if (typeof loadShowings === "function") {
            await loadShowings();
        }

    } catch (error) {
        message.textContent = error.message;
        console.error("Fejl ved oprettelse af forestilling:", error);
    } finally {
        submitButton.disabled = false;
    }
});

initializeShowingForm();
