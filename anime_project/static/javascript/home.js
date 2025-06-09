const swiper = new Swiper('.swiper', {
    // Optional parameters
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    // Pagination
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },

    // Effect
    effect: 'slide',
    speed: 800,
});

// favorites functionality store favorites in local memory
let favorites = JSON.parse(localStorage.getItem('animeFavorites')) || [];

// Initialize favorite buttons
document.addEventListener('DOMContentLoaded', () => {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(btn => {
        const animeName = btn.getAttribute('data-anime');
        if (favorites.includes(animeName)) {
            btn.classList.add('active');// changes the color of the heart by adding active class
        }
    });
});

function toggleFavorite(button) {
    const animeName = button.getAttribute('data-anime');
    const index = favorites.indexOf(animeName);

    if (index === -1) {
        // Add to favorites
        favorites.push(animeName);
        button.classList.add('active');// color the heart
    } else {
        // Remove from favorites
        favorites.splice(index, 1);
        button.classList.remove('active');// de-color the heart
    }

    // Save to localStorage
    localStorage.setItem('animeFavorites', JSON.stringify(favorites));
}

async function fetchAnimeData() {
    //const baseURL = "https://api.jikan.moe/v4/anime"; // random anime(old)
    //const baseURL = "https://api.jikan.moe/v4/top/anime";// top anime most rated
    const baseURL = "https://api.jikan.moe/v4/seasons/now";// airing anime right now
    const wrapper = document.querySelector(".wrapper");
    try {
        const response = await fetch(baseURL);
        console.log(response);
        console.log(typeof response);
        const data = await response.json();
        console.log(data);
        console.log(typeof data);
        data.data.forEach(element => {
            const {
                episodes,
                images: {
                    jpg: {
                        image_url,
                        large_image_url,
                        small_image_url
                    }
                },
                synopsis,
                title,
                title_english,
                type,
                url
            } = element;
            const card = document.createElement("div");

            let episode = episodes;
            if (type !== "TV" || episodes === null) {
                episode = type;
            }

            let animeTitle = title_english;
            if (animeTitle === null) {
                animeTitle = title;
            }

            card.className = 'card';
            card.innerHTML = `
                    <a href="/description/?title=${encodeURIComponent(animeTitle)}&image=${encodeURIComponent(large_image_url)}&synopsis=${encodeURIComponent(synopsis)}"><img src="${large_image_url}" alt="${animeTitle} image"></a>
                    <div class="card-info">
                        <div class="title-row">
                            <h2>${animeTitle}</h2>
                            <button class="favorite-btn" onclick="toggleFavorite(this)" data-anime="${animeTitle}"><i
                                    class="fas fa-heart"></i></button>
                        </div>
                        <span class="duration"><i class="fa-solid fa-eye"></i>${episode}</span>
                    </div>
                `;

            wrapper.appendChild(card);

        })


    } catch (error) {
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAnimeData();

    // Add event listeners for search
    const searchBox = document.getElementById("searchBox");
    const searchButton = document.querySelector(".search-btn");

    // Search on Enter key
    searchBox.addEventListener('keydown', event => {
        if (event.key === "Enter") {
            fetchSearchData();
        }
    });

    // Search on button click

});

async function fetchSearchData() {
    const searchBox = document.getElementById("searchBox");
    let searchTerm = searchBox.value.trim();

    if (!searchTerm) return; // Don't search if input is empty

    const baseURL = "https://api.jikan.moe/v4";
    try {
        const response = await fetch(`${baseURL}/anime?q=${encodeURIComponent(searchTerm)}&limit=10`);
        const data = await response.json();
        console.log(data);
        const wrapper = document.querySelector(".wrapper");
        wrapper.innerHTML = ''; // Clear existing content

        if (data.data.length === 0) {
            searchTerm = "Not Found";
        }

        data.data.forEach(element => {
            const {
                episodes,
                images: {
                    jpg: {
                        image_url,
                        large_image_url,
                        small_image_url
                    }
                },
                synopsis,
                title,
                title_english,
                type,
                url
            } = element;

            let episode = episodes;
            if (type !== "TV") {
                episode = type;
            }

            let animeTitle = title_english;
            if (animeTitle === null) {
                animeTitle = title;
            }
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                    <a href="/description/?title=${encodeURIComponent(animeTitle)}&image=${encodeURIComponent(large_image_url)}&synopsis=${encodeURIComponent(synopsis)}"><img src="${large_image_url}" alt="${animeTitle} image"></a>
                    <div class="card-info">
                        <div class="title-row">
                            <h2>${animeTitle}</h2>
                            <button class="favorite-btn" onclick="toggleFavorite(this)" data-anime="${animeTitle}"><i
                                    class="fas fa-heart"></i></button>
                        </div>
                        <span class="duration"><i class="fa-solid fa-eye"></i>${episode}</span>
                    </div>
                `;
            
            wrapper.appendChild(card);
        });

        const swiper = document.querySelector(".swiper");
        swiper.style.display = "none";

        const headingTop = document.querySelector(".heading-top");
        headingTop.innerHTML = `<h1>Search Results: ${searchTerm}</h1>`;

        const homeBtn = document.querySelector(".home-btn");
        homeBtn.style.border = "1px solid var()"

    } catch (error) {
        console.error('Error fetching search results:', error);
    }
}

