const message = document.getElementById("showings-message");
const showingsList = document.getElementById("showings-list");

fetch("http://localhost:8080/api/showings").then(response =>{
    if(!response.ok){
        throw new Error("Kunne ikke hente forestillinger. ");
    }

    return response.json();
})
.then(showings=>{
    message.textContent = "";
    showingsList.replaceChildren();

    if(showings.length === 0) {
        message.textContent = "Der er ingen forestillinger. ";
        return;

    }
    showings.forEach(showing => {
        const cancelled = showing.status === "CANCELLED";
        const row = document.createElement("tr");
        const movie = document.createElement("td");
        movie.textContent = showing.movieTitle;
        const theater = document.createElement("td");
        theater.textContent = showing.theaterName;
        const time = document.createElement("td");
        time.textContent = new Date(showing.startsAt)
            .toLocaleString("da-DK");

        const status = document.createElement("td");
        status.textContent = cancelled ? "AFLYST" : "PLANLAGT";

        const action = document.createElement("td");
        const button = document.createElement("button");

        button.type = "button";
        button.textContent = cancelled ? "Aflyst" : "Vælg sæder";
        button.disabled = cancelled;

        button.addEventListener("click", () => {
            loadSeats(showing.showingId, showing);
        });
        action.appendChild(button);

        row.append(movie, theater, time, status, action);
        showingsList.appendChild(row);
    });
})
    .catch(error => {
        message.textContent = error.message;
        console.error("Fejl ved hentning af forestillinger: ", error);
    });