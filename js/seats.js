let currentShowingId = null; // Variabel til at holde styr på den aktuelle forestilling
let currentShowing = null;
const selectedSeatsIds = new Set(); // Brug et Set til at holde styr på valgte sæder

const reservationSection = document.getElementById("reservation-section"); // Sektionen til reservation
const reservationForm = document.getElementById("reservation-form"); // Formularen til reservation
const reservationMessage = document.getElementById("reservation-message"); // Element til at vise besked
const selectedSeatsMessage = document.getElementById("selected-seats-message"); // Element til at vise valgte sæder
const reservationButton = document.getElementById("reservation-button"); // Knappen til at reservere

async function loadSeats(showingId, showing) {// Funktion til at hente og vise sæder for en given forestilling.
    await loadActiveReservations(showingId);
    const seatMaps = document.getElementById("theater-seat-maps"); // Elementet, hvor sædekortene skal vises.
    const seatsMessage = document.getElementById("seats-message"); // Elementet, hvor beskeder om sæder skal vises.

    currentShowingId = showingId; // Opdater den aktuelle forestilling
    currentShowing = showing; // Opdater den aktuelle forestilling.

    selectedSeatsIds.clear(); // Ryd tidligere valgte sæder så snart en ny forestilling vælges.
    reservationSection.hidden = true; // Skjul reservationssektionen, indtil sæderne er hentet.
    reservationMessage.textContent = ""; // Ryd tidligere beskeder.
    reservationForm.reset(); // Nulstil formularen.

    seatMaps.replaceChildren(); // Ryd tidligere sædekort
    seatsMessage.textContent = "Henter sæder..."; // Vis besked om, at sæderne hentes

    try { // Hent sæderne fra API'et
        const response = await fetch(
            `/api/showings/${showingId}/seats`
    );

if (!response.ok) { // Hvis svaret ikke er OK, kast en fejl
    throw new Error("Kunne ikke hente sæderne.");
}

const seats = await response.json();

renderSeats(seats, showing);
seatsMessage.textContent = "";
} catch (error) {
    seatsMessage.textContent = error.message;
    console.error("Fejl ved hentning af sæder:", error);
}
}

function renderSeats(seats, showing) {
    const seatMaps = document.getElementById("theater-seat-maps");

    seatMaps.replaceChildren();

    // Opret et kort til forestillingen
    const theaterCard = document.createElement("section");
    theaterCard.classList.add("theater-card");

    const title = document.createElement("h3");
    title.textContent = `${showing.movieTitle} – ${showing.theaterName}`;
    theaterCard.appendChild(title);

    // Opret lærredet
    const screen = document.createElement("div");
    screen.classList.add("cinema-screen");
    screen.textContent = "LÆRRED";
    theaterCard.appendChild(screen);

    // Opret container til sæderækkerne
    const seatMap = document.createElement("div");
    seatMap.classList.add("seat-map");

    // Saml sæderne efter rækkenummer
    const rows = new Map();

    seats.forEach(seat => {
        if (!rows.has(seat.rowNumber)) {
            rows.set(seat.rowNumber, []);
        }

        rows.get(seat.rowNumber).push(seat);
    });

    //Sorter rækker og sæder, så de vises i rigtig rækkefølge.
    const sortedRows = [...rows.entries()]
        .sort((a, b) => a[0] - b[0]);

    sortedRows.forEach(([rowNumber, rowSeats]) => {
        rowSeats.sort((a, b) => a.seatNumber - b.seatNumber);

        const seatRow = document.createElement("div");
        seatRow.classList.add("seat-row");

        const leftLabel = document.createElement("span");
        leftLabel.classList.add("row-label");
        leftLabel.textContent = rowNumber;

        const seatContainer = document.createElement("div");
        seatContainer.classList.add("seats");
        seatContainer.style.setProperty("--seat-count", rowSeats.length);


        rowSeats.forEach(seatData => {
            const seat = document.createElement("button");

            seat.type = "button";
            seat.classList.add("seat");
            seat.textContent = seatData.seatNumber;

            seat.title = `Række ${seatData.rowNumber}, sæde ${seatData.seatNumber}`;

            seat.setAttribute(
                "aria-label",
                `Række ${seatData.rowNumber}, sæde ${seatData.seatNumber}`);

            seat.setAttribute("aria-pressed", "false");

            if (seatData.reserved) {
                // Sædet er allerede reserveret
                seat.classList.add("seat-reserved");
                seat.disabled = true;
                seat.title += " – reserveret";
            } else {
                // Sædet er ledigt
                seat.classList.add("seat-available");

                seat.addEventListener("click", () => { // programmet "lytter" om brugeren klikker på et sæde.
                    if (selectedSeatsIds.has(seatData.seatId)) {
                        selectedSeatsIds.delete(seatData.seatId);
                        seat.classList.remove("seat-selected");
                        seat.classList.add("seat-available");
                        seat.setAttribute("aria-pressed", "false");
                    } else {
                        selectedSeatsIds.add(seatData.seatId);
                        seat.classList.add("seat-selected");
                        seat.classList.remove("seat-available");
                        seat.setAttribute("aria-pressed", "true");
                    }

                    updateSelectedSeats();

                });
            }

            seatContainer.appendChild(seat);
        });

        const rightLabel = document.createElement("span");
        rightLabel.classList.add("row-label");
        rightLabel.textContent = rowNumber;

        seatRow.append(leftLabel, seatContainer, rightLabel);
        seatMap.appendChild(seatRow);
    });

    theaterCard.appendChild(seatMap);

    const legend = document.createElement("p");
    legend.classList.add("seat-legend");
    legend.textContent = "Grøn = ledigt · Rød = reserveret · Blå = valgt";

    theaterCard.appendChild(legend);
    seatMaps.appendChild(theaterCard);
}

function updateSelectedSeats() {
    const count = selectedSeatsIds.size;

    selectedSeatsMessage.textContent = count === 0
    ? "Du har ikke valgt nogen sæder."
        : `Du har valgt ${count} sæde(r).`;

    reservationSection.hidden = count === 0;
    reservationMessage.textContent = "";
}

// Send reservation til backend
reservationForm.addEventListener("submit", async event => {
    event.preventDefault();

    if (currentShowingId === null || selectedSeatsIds.size === 0) {
        reservationMessage.textContent = "Vælg en forestilling og mindst ét sæde.";
        return;
    }

    const request = {
        showingId: currentShowingId,
        seatIds: [...selectedSeatsIds],
        customerName:
        document.getElementById("customer-name").value.trim(),
        customerPhone: document.getElementById("customer-phone").value.trim()
    };

    reservationButton.disabled = true;
    reservationMessage.textContent = "Opretter reservation...";

    try {
        const response = await fetch(
            `/api/reservations`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(request)
            }
        );

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));

            throw new Error(error.message || "Reservationen kunne ikke gennemføres. Kontrollér, om sæderne stadig er ledige.");
        }

        const reservation = await response.json();

        selectedSeatsIds.clear();
        reservationForm.reset();
        reservationSection.hidden = true;

        reservationMessage.textContent =
            `Reservation #${reservation.reservationId} er oprettet.`;

        //Hent den nyeste status fra backend
        await loadSeats(currentShowingId, currentShowing);

        // loadSeats nulstiller beskeden, så vis bekræftelsen igen.
        reservationMessage.textContent = `Reservation #${reservation.reservationId} er oprettet.`;

    } catch (error) {
        reservationMessage.textContent = error.message;
        console.error("Fejl ved reservation:", error);
    } finally {
        reservationButton.disabled = false;
    }
});