
const createShowingForm = document.getElementById("create-showing-form");
const movieSelect = document.getElementById("showing-movie");
const theaterSelect = document.getElementById("showing-theater");
const startsAtInput = document.getElementById("showing-starts-at");
const createShowingMessage = document.getElementById("create-showing-message");
const createShowingButton = document.getElementById("create-showing-button");

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
            new Option(movie.title, movie.id)
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
        createShowingMessage.textContent = error.message;
        console.error("Fejl ved indlæsning af formular: ", error);
    }
}

// Opret forestillingen i backend.
createShowingForm.addEventListener("submit", async event => {
    event.preventDefault();

    const request = {
        movieId: Number(movieSelect.value),
        theaterId: Number(theaterSelect.value),
        startsAt: startsAtInput.value + ":00"
    };

    createShowingButton.disabled = true;
    createShowingMessage.textContent = "Opretter forestilling...";

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
                error.error ||
                error.message ||
                "Kunne ikke oprette forestillingen."
            );
        }

        createShowingMessage.textContent = "Forestillingen er oprettet.";
        createShowingForm.reset();

        // Opdater forestillingsoversigten.
        if (typeof loadShowings === "function") {
            await loadShowings();
        }

    } catch (error) {
        createShowingMessage.textContent = error.message;
        console.error("Fejl ved oprettelse af forestilling:", error);
    } finally {
        createShowingButton.disabled = false;
    }
});

initializeShowingForm();
