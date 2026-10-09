async function loadSeats(showingId, showing) {
    const seatMaps = document.getElementById("theater-seat-maps");
    const seatsMessage = document.getElementById("seats-message");

    seatMaps.replaceChildren();
    seatsMessage.textContent = "Henter sæder...";

    try {
        const response = await fetch(
            `http://localhost:8080/api/showings/${showingId}/seats`
    );

if (!response.ok) {
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

    // Tegn hver sæderække
    rows.forEach((rowSeats, rowNumber) => {
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

            seat.title = `Række ${seatData.rowNumber}, sæde ${seatData.seatNumber}`;
            seat.setAttribute(
                "aria-label",
                `Række ${seatData.rowNumber}, sæde ${seatData.seatNumber}`
            );
            seat.setAttribute("aria-pressed", "false");

            if (seatData.reserved) {
                // Sædet er allerede reserveret
                seat.classList.add("seat-reserved");
                seat.disabled = true;
                seat.title += " – reserveret";
            } else {
                // Sædet er ledigt
                seat.classList.add("seat-available");

                seat.addEventListener("click", () => {
                    const selected = seat.classList.toggle("seat-selected");
                    seat.setAttribute("aria-pressed", String(selected));
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