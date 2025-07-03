import "./styles/library.css";
import { showHeader, showFooter } from "./components/layout";
import { episodeDescriptions } from "./components/descriptions.js";
let API_URL = "https://rickandmortyapi.com/api/episode";

const displayBody = document.getElementById("app");

/*DISPLAY DEL HEADER*/
const elHeader = document.createElement("header");
elHeader.innerHTML = showHeader();
displayBody.appendChild(elHeader);

/*DISPLAY MAIN*/
const elMain = document.createElement("main");
displayBody.appendChild(elMain);

//Titulo de la página y descripcion corta en un div.
const elH1AndP = document.createElement("section");
elH1AndP.className = "title-subtitle";
elMain.appendChild(elH1AndP);

const elTitle = document.createElement("h1");
elTitle.textContent = "Rick and Morty Episode Library";
elH1AndP.appendChild(elTitle);

const elSubtitle = document.createElement("p");
elSubtitle.textContent = "Search for any Rick and Morty epsiode...";
elH1AndP.appendChild(elSubtitle);

//search bar, en un div
const searchInput = document.createElement("input");
searchInput.type = "search";
searchInput.id = "search-input";
searchInput.placeholder = "Search episode by name: ";
const elDivInput = document.createElement("section");
elDivInput.className = "div-input";
elMain.appendChild(elDivInput);
elDivInput.appendChild(searchInput);

//un div para poner el el filtro y el sort en una misma linea
const divFilters = document.createElement("div");
divFilters.className = "filter-sort";
elDivInput.appendChild(divFilters);

///hacer un select para poder ordenar los episodios de manera alfabetica (A-Z) o (Z-A)
const elSelectSort = document.createElement("select");
elSelectSort.className = "sort-select";
elSelectSort.name = "sort-select";

const elSortdefault = document.createElement("option");
elSortdefault.value = "";
elSortdefault.textContent = "Sort episodes by: ";
elSelectSort.appendChild(elSortdefault);

const elResetOption = document.createElement("option");
elResetOption.value = "Reset";
elResetOption.textContent = "episode number";
elSelectSort.appendChild(elResetOption);

const azOption = document.createElement("option");
azOption.value = "az";
azOption.textContent = "A - Z";
elSelectSort.appendChild(azOption);

const zaOption = document.createElement("option");
zaOption.value = "za";
zaOption.textContent = "Z - A";
elSelectSort.appendChild(zaOption);

divFilters.appendChild(elSelectSort);

//accion de sort
elSelectSort.addEventListener("change", async () => {
  isFavoritesPage = false;
  const selected = elSelectSort.value;
  if (!selected) return;

  if (selected.toLowerCase() === "reset") {
    elPaginacion.style.display = "block";
    fetchEpisode(API_URL); //para volver al default de orden por numero de capítulo
    return;
  }

  try {
    divCardsEl.innerHTML = "<p>Loading the episods... </p>";

    const allEpisodes = await fetchAllEpisodes();

    allEpisodes.sort((a, b) => {
      return (
        a.name.localeCompare(b.name, undefined, { numeric: true }) *
        (selected === "az" ? 1 : -1)
      );
    });

    elPaginacion.style.display = "none";
    displayCard(allEpisodes);
  } catch (err) {
    elPaginacion.style.display = "none";

    divCardsEl.innerHTML = `
         <div class="pag-error">
        <p>${err}</p>
        <a href="./library.html">→ Go back to the library ←</a>
         </div>`;
    console.error(err);
  }
});

// Crear y agregar las cards
const divCardsEl = document.createElement("section");
divCardsEl.id = "cards-container";
elMain.appendChild(divCardsEl);

//variable boolean que me diga si actualmente estoy en la parte de favoritos, si no cada vez que recargo o saco algo de ahí se me vuelve al sort default del principio
let isFavoritesPage = false;

// add eventpara el boton de favoritos de la card
divCardsEl.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-favorite")) {
    const id = parseInt(e.target.dataset.id);
    toggleFavorite(id);

    //otro if para ver si estoy filtrando favoritos o no
    if (isFavoritesPage) {
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      fetchAllEpisodes().then((allEpisodes) => {
        const filtered = allEpisodes.filter((ep) => favorites.includes(ep.id));
        displayCard(filtered);
      });
    } else {
      fetchEpisode(API_URL);
    }
  }
});

async function fetchEpisode(url) {
  divCardsEl.innerHTML = "<p>Loading...</p>";
  try {
    const res = await fetch(url);
    const data = await res.json();

    console.log(data);

    if (data.length == 0) {
      throw new Error("Episode not found");
    }
    displayCard(data.results ?? data);

    if (data.info) {
      elPaginacion.style.display = "flex";
      updatePagination(data.info);
    } else {
      elPaginacion.style.display = "none";
    }
  } catch (err) {
    elPaginacion.style.display = "none";

    divCardsEl.innerHTML = `
         <div class="pag-error">
        <p>${err}</p>
        <a href="./library.html">→ Go back to the library ←</a>
         </div>`;
    console.error(err);
  }
}
///una funcion fetch episode que aplique a todos los episodios, para poder compararlos y usar el sort de sort alphabeticaly, si no me marca solo los q son por cada página
async function fetchAllEpisodes() {
  let allEpisodes = [];
  let nextUrl = API_URL;

  while (nextUrl) {
    const res = await fetch(nextUrl);
    const data = await res.json();
    allEpisodes = [...allEpisodes, ...data.results];
    nextUrl = data.info.next;
  }

  return allEpisodes;
}

//suncion para el display de las cars de e`pisodios
function displayCard(episodes) {
  console.log(episodes);

  divCardsEl.innerHTML = "";

  //agregar favoritos y que se pueda guardar en localstorage (con su id)
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  episodes.forEach((e) => {
    //variable para las descripciones de cada capitulo
    const description =
      episodeDescriptions[e.id] || "No description available.";
    //variable para saber si un episodio es favorito o no
    const isFavorite = favorites.includes(e.id);

    const card = document.createElement("div");
    card.className = "episode-card";
    //agrega un atributo para representar la card del episodio
    card.dataset.id = e.id;
    card.innerHTML = `
    <div class="episode-number">
        <h5>${e.id})</h5>
        <h5>${e.episode}</h5>
    </div>
    <div class="episode-details">
        <h3>${e.name}</h3>
        <h5>Air date: ${e.air_date}</h5>
        <div class="episode-description">
        <p>${description}</p>
        </div>
        <button class="btn-favorite" data-id="${e.id}">
        ${isFavorite ? "Remove from favorites" : "Select as favorite"}
        </button>
    </div>`;

    divCardsEl.appendChild(card);
  });
}

//funcion toggle de id para favoritos/no favoritos
function toggleFavorite(id) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (favorites.includes(id)) {
    favorites = favorites.filter((favId) => favId !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

//search de episodios por nombre
searchInput.addEventListener("keypress", (event) => {
  isFavoritesPage = false;
  console.log(event);

  if (event.key === "Enter") {
    const valorBusqueda = searchInput.value.trim().toLowerCase();

    if (valorBusqueda == "") {
      fetchEpisode(API_URL);
      return;
    }
    const allEpEl = document.querySelectorAll(".episode-card");
    allEpEl.forEach((el) => {
      const name = el.querySelector("h3").innerText.toLowerCase();
      if (name == valorBusqueda) {
        divCardsEl.innerHTML = "";
        divCardsEl.appendChild(el);
        return;
      }
    });

    try {
      const urlToSearchByName = `${API_URL}?name=${valorBusqueda}`;

      fetchEpisode(urlToSearchByName);
    } catch (err) {
      divCardsEl.innerHTML = `<p>${err}</p>`;
      console.error(err);
    }
  }
});

//crear un div con el boton de filtar por favoritos
const elDivFiltrar = document.createElement("div");
elDivFiltrar.className = "filter";
divFilters.appendChild(elDivFiltrar);
const elFilterBtn = document.createElement("button");
elFilterBtn.textContent = " Filter by favorites";
elFilterBtn.className = "filter-fav-btn";
elDivFiltrar.appendChild(elFilterBtn);

elFilterBtn.addEventListener("click", () => {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  isFavoritesPage = true;

  if (favorites.length === 0) {
    divCardsEl.innerHTML = `
    <div class=no-favorites>
    <img src="/images/NoFavorites.png" alt="non favorite episodes found"/>
    <p>No episodes marked as favorites as of yet</p>
    <a href="./library.html">Go back to library</a>
    </div>

    `;
    return;
  }

  fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      const filtered = data.results.filter((ep) => favorites.includes(ep.id));
      displayCard(filtered);
    });
});

/*agregar botones de paginación despues del sector de filtros pero antes de las cards*/
const elPaginacion = document.createElement("div");
elPaginacion.className = "pagination";
elDivInput.appendChild(elPaginacion);
/*crear y append botones*/
const btnFirstEl = document.createElement("button");
btnFirstEl.textContent = "<< First <<";
const btnPrevEl = document.createElement("button");
btnPrevEl.textContent = "< Prev <";
const btnNextEl = document.createElement("button");
btnNextEl.textContent = "> Next >";
const btnLastEl = document.createElement("button");
btnLastEl.textContent = ">> Last >>";
elPaginacion.appendChild(btnFirstEl);
elPaginacion.appendChild(btnPrevEl);
elPaginacion.appendChild(btnNextEl);
elPaginacion.appendChild(btnLastEl);

function updatePagination(info) {
  btnFirstEl.onclick = () => {
    fetchEpisode(`${API_URL}?page=1`);
  };
  btnPrevEl.onclick = () => {
    fetchEpisode(info.previous);
  };
  btnNextEl.onclick = () => {
    fetchEpisode(info.next);
  };
  btnLastEl.onclick = () => {
    fetchEpisode(`${API_URL}?page=${info.pages}`);
  };
}

/*LLAMAR AL FETCH PARA QUE SE VEAN LAS CARDS DE LOS EPISODIOS*/
fetchEpisode(API_URL);

///

/*DISPLAY FOOTER*/
const elFooter = document.createElement("footer");
elFooter.innerHTML = showFooter();
displayBody.appendChild(elFooter);
