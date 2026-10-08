console.log("theater.js virker!");

fetch("http://localhost:8080/api/theaters")
    .then(response => response.json())
    .then(theaters => {

        console.log(theaters);

        const theaterList = document.getElementById("theater-list");
        const emptyMessage = document.getElementById("theater-empty-message");

        if (theaters.length === 0) {
            emptyMessage.textContent = "Der findes ingen biografsale.";
            return;
        }

        theaters.forEach(theater => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${theater.name}</td>
                <td>${theater.rowCount}</td>
                <td>${theater.seatsPerRow}</td>
                <td>${theater.capacity}</td>
            `;

            theaterList.appendChild(row);
        });
    })
    .catch(error => {
        console.error("Fejl ved hentning af biografsale:", error);
    });
