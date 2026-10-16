alert("movie.js virker");

fetch("/api/movies")
    .then(response => response.json())
    .then(movies => {

        const movieList = document.getElementById("movie-list");
        const emptyMessage = document.getElementById("empty-message");

        console.log(movies);

        if (movies.length === 0) {
            emptyMessage.textContent = "Der findes ingen film.";
            return;
        }

        movies.forEach(movie => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${movie.title}</td>
                <td>${movie.category}</td>
                <td>${movie.ageLimit}+</td>
                <td>${movie.duration} min</td>
            `;

            movieList.appendChild(row);
        });
    })
    .catch(error => {
        console.error("Fejl ved hentning af film:", error);
    });