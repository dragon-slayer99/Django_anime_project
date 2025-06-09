const baseURL = "https://api.jikan.moe/v4";

document.addEventListener("DOMContentLoaded", async () => {
    const animeImage = document.getElementById("animeImage");
    const episodesInfo = document.getElementById("episodesInfo");
    const episodeDuration = document.getElementById("episodeDuration");
    const genre = document.querySelector(".genre");
    const animeRating = document.getElementById("animeRating");
    const japaneseName = document.getElementById("japaneseName");
    const status = document.querySelector(".status");

    // Get anime title from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const animeTitle = urlParams.get('title');

    if (!animeTitle) {
        console.error('No anime title provided');
        return;
    }

    try {
        const response = await fetch(`${baseURL}/anime?q=${encodeURIComponent(animeTitle)}&limit=1`);
        const data = await response.json();

        const {
            airing,
            duration,
            episodes,
            genres,
            rating,
            title_japanese,
            url,
        } = data.data[0];

        episodesInfo.innerHTML = `<i class="fas fa-film"></i> Episodes: ${episodes || 'N/A'}`;
        episodeDuration.innerHTML = `<i class="fas fa-clock"></i> ${duration || 'N/A'}`;
        // to handle excption

        genre.innerHTML = '<i class="fas fa-tags"></i>';
       
            genres.forEach(element => {
                const span = document.createElement("span");
                span.textContent = element.name;
                genre.appendChild(span);
            });


        animeRating.innerHTML = `<i class="fas fa-star"></i> ${rating || 'N/A'}`;
        japaneseName.innerHTML = `<i class="fas fa-language"></i> ${title_japanese || 'N/A'}`;
        status.innerHTML = `<i class="fas fa-broadcast-tower"></i> ${airing ? 'Currently Airing' : 'Finished Airing'}`;

    } catch (error) {
        console.error('Error fetching anime data:', error);
    }
});