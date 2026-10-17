const showingsMessage = document.getElementById("showings-message");
const showingsList = document.getElementById("showings-list");
const refreshButton = document.getElementById("refresh-showings");



//Formaterer dato og klokkeslæt uden at ændre det valgte tidspunkt.
function formatDateTime(dateTime) {
    if (!dateTime) {
        return "Ukendt tidspunkt";
    }

    //Backend returnerer LocalDateTime - Vi fortolker værdien som lokal tid
    const [datePart, timePart] = dateTime.split("T");

    if (!datePart || !timePart) {
        return dateTime;
    }

    const [year, month, day] = datePart.split("-");
    const [hours, minutes] = datePart.split(":");

    return `${day}-${year} kl. ${hours}:${minutes}`;

}

//Henter og viser alle forestillinger.
async function loadShowings() {
    showingsMessage.textContent = "Henter forestillinger...";
    showingsList.replaceChildren();
    refreshButton.disabled = true;

    try {
        const response = await fetch("/api/showings");

        if (!response.ok) {
            throw new Error("Kunne ikke hente forestillinger. Prøv igen.");
        }

        const showings = await response.json();

        showingsList.replaceChildren();
        showingsMessage.textContent = "";

            if (showings.length === 0) {
                showingsMessage.textContent = "Der er ingen forestillinger. ";
                return;

            }

            showings.forEach(showing => {
                const cancelled = showing.status === "CANCELLED";

                const row = document.createElement("tr");

                const movie = document.createElement("td");
                movie.textContent = showing.movieTitle ?? "Ukendt film";

                const theater = document.createElement("td");
                theater.textContent = showing.theaterName ?? "Ukendt sal";

                const time = document.createElement("td");
                time.textContent = formatDateTime(showing.startsAt);

                const status = document.createElement("td");
                status.textContent = cancelled ? "AFLYST" : "PLANLAGT";

                const action = document.createElement("td");
                const button = document.createElement("button");

                button.type = "button";
                button.textContent = cancelled ? "Aflyst" : "Vælg sæder";

                button.disabled = cancelled;

                button.addEventListener("click", () => {
                    if (typeof loadSeats === "function") {
                        loadSeats(showing.showingId, showing);
                    } else {
                        console.error("Funktionen loadSeats() findes ikke." + "Kontroller seats.js");

                        showingsMessage.textContent = "Kunne ikke åbne sædeoversigten.";
                    }
                });

                action.appendChild(button);
                row.append(movie, theater, time, status, action);
                showingsList.appendChild(row);
            });

    } catch (error) {
        showingsMessage.textContent = error.message;

        console.error("Fejl ved hentning af forestillinger: ", error);

    } finally {
        refreshButton.disabled = false;
    }
}
//Opdater forestillingsoversigten ved klik
refreshButton.addEventListener("click", loadShowings);

//Hent forestillinger, når siden indlæses
loadShowings();



