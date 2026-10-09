function renderSeats(theater) {
    const seatMaps = document.getElementById("theater-seat-maps");

    // Opret et kort til salen
    const theaterCard = document.createElement("section");
    theaterCard.classList.add("theater-card");

    const title = document.createElement("h3");
    title.textContent = theater.name;

    theaterCard.appendChild(title);

    // Opret lærredet
    const screen = document.createElement("div");
    screen.classList.add("cinema-screen");
    screen.textContent = "LÆRRED";

    theaterCard.appendChild(screen);

    // Opret container til sæderækkerne
    const seatMap = document.createElement("div");
    seatMap.classList.add("seat-map");

    // Antal sæder i hver række
    seatMap.style.setProperty(
        "--seat-count",
        theater.seatsPerRow
    );

    // Gennemløb alle rækker
    for (let row = 1; row <= theater.rowCount; row++) {
        const seatRow = document.createElement("div");
        seatRow.classList.add("seat-row");

        // Rækkenummer til venstre
        const leftLabel = document.createElement("span");
        leftLabel.classList.add("row-label");
        leftLabel.textContent = row;

        // Container til sæderne i rækken
        const seats = document.createElement("div");
        seats.classList.add("seats");

        // Opret hvert sæde i rækken
        for (
            let seatNumber = 1;
            seatNumber <= theater.seatsPerRow;
            seatNumber++
        ) {
            const seat = document.createElement("button");

            seat.type = "button";
            seat.classList.add("seat", "seat-available");

            seat.title = `Række ${row}, sæde ${seatNumber}`;

            seat.setAttribute(
                "aria-label",
                `Række ${row}, sæde ${seatNumber}`
            );

            seats.appendChild(seat);
        }

        // Rækkenummer til højre
        const rightLabel = document.createElement("span");
        rightLabel.classList.add("row-label");
        rightLabel.textContent = row;

        seatRow.appendChild(leftLabel);
        seatRow.appendChild(seats);
        seatRow.appendChild(rightLabel);

        seatMap.appendChild(seatRow);
    }

    theaterCard.appendChild(seatMap);
    seatMaps.appendChild(theaterCard);
}