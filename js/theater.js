
console.log("theater.js virker!");

async function loadTheaters() {
    const theaterList = document.getElementById("theater-list");
    const emptyMessage = document.getElementById("theater-empty-message");

    theaterList.replaceChildren();
    emptyMessage.textContent = "Henter biografsale...";

    try {
        const response = await fetch("/api/theaters");

        if (!response.ok) {
            throw new Error("Kunne ikke hente biografsale.");
        }

        const theaters = await response.json();

        emptyMessage.textContent = "";

        if (theaters.length === 0) {
            emptyMessage.textContent = "Der findes ingen biografsale.";
            return;
        }

        theaters.forEach(theater => {
            const card = document.createElement("article");
            card.classList.add("theater-card");

            const title = document.createElement("h3");
            title.textContent = theater.name;

            const rows = document.createElement("p");
            rows.textContent = `Antal rækker: ${theater.rowCount}`;

            const seatsPerRow = document.createElement("p");
            seatsPerRow.textContent =
                `Sæder pr. række: ${theater.seatsPerRow}`;

            const capacity = document.createElement("p");
            capacity.textContent =
                `Samlet kapacitet: ${theater.capacity} sæder`;

            card.append(title, rows, seatsPerRow, capacity);
            theaterList.appendChild(card);
        });

    } catch (error) {
        emptyMessage.textContent =
            "Der opstod en fejl ved hentning af biografsale.";

        console.error("Fejl ved hentning af biografsale:", error);
    }
}

loadTheaters();
