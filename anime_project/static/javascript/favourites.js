const baseURL = "https://api.jikan.moe/v4";
let favorites = JSON.parse(localStorage.getItem('animeFavorites')) || [];

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
    
    // If we're on the favorites page, re-render the favorites
    // const wrapper = document.querySelector(".wrapper");
    // if (wrapper && window.renderFavorites) {
    //     window.renderFavorites();
    // }
}

document.addEventListener("DOMContentLoaded", () => {
    async function renderFavorites() {
        const wrapper = document.querySelector(".wrapper");
        wrapper.innerHTML = '';

        if (favorites.length === 0) {
            wrapper.innerHTML = `<div class="no-favorites">No favorite animes added yet!</div>`;
            return;
        }

        for (const animeName of favorites) {
            try {
                const response = await fetch(`${baseURL}/anime?q=${encodeURIComponent(animeName)}&limit=1`);
                const data = await response.json();

                if (data.data.length > 0) {
                    const {
                        episodes,
                        type,
                        images: {
                            jpg: {
                                large_image_url
                            }
                        },
                        title
                    } = data.data[0];

                    const card = document.createElement("div");
                    card.className = 'card';

                    let episodeText = episodes;
                    if (type !== "TV") {
                        episodeText = type;
                    }

                    card.innerHTML = `
                    <img src="${large_image_url}" alt="${title} image">
                    <div class="card-info">
                        <div class="title-row">
                            <h2>${title}</h2>
                            <button class="favorite-btn active" onclick="toggleFavorite(this)" data-anime="${title}">
                            <i class="fas fa-heart"></i>
                            </button>
                        </div>
                        <span class="duration"><i class="fa-solid fa-eye"></i>${episodeText}</span>
                    </div>`;

                    wrapper.appendChild(card);
                }
            } catch (error) {
                console.error(`error for ${animeName}: `, error);
            }
        }

        const headingTop = document.querySelector(".heading-top");
        headingTop.innerHTML = '<h1>My Favorite Animes</h1>';

        const swiper = document.querySelector(".swiper");
        if (swiper) {
            swiper.style.display = 'none';
        }
    }

    
    window.renderFavorites = renderFavorites;

    renderFavorites();

    const showFavorites = document.querySelector(".favorites-btn");
    if (showFavorites) {
        showFavorites.addEventListener('click', renderFavorites);
    }
})
