async function loadActiveReservations(showingId) {
    const section = document.getElementById("active-reservations-section");
    const list = document.getElementById("active-reservations-list");
    const message = document.getElementById("active-reservations-message");

    section.hidden = false;
    list.replaceChildren();
    message.textContent = "Henter reservationer...";

    try {
        const response = await fetch(
            `/api/reservations?showingId=${showingId}`
        );

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(
                error.error || "Reservationerne kunne ikke hentes"
            );
        }

        const reservations = await response.json();

        if (reservations.length === 0) {
            message.textContent = "Der er ingen aktive reservationer for forestillingen.";
            return;
        }

        reservations.forEach(reservation => {
            const row = document.createElement("tr");

            const values = [
                reservation.reservationId,
                reservation.customerName,
                reservation.customerPhone,
                reservation.seats.join(" . "),
                reservation.status

            ];

            values.forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            list.appendChild(row);
        });

        message.textContent = "";
    } catch (error) {
        message.textContent = error.message;
        console.error("Fejl ved hentning af reservationer:", error);
    }

}