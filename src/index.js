import "./styles/index.css";
import { showHeader, showFooter } from "./components/layout"; //las funciones del header y el footer

import { episodeDescriptions } from "./components/descriptions.js";

let API_URL = "https://rickandmortyapi.com/api/episode";

/*document.querySelector("#app").innerHTML = `
  <div>
  </div>
*/
const displayBody = document.getElementById("app");

/*DISPLAY DEL HEADER*/
const elHeader = document.createElement("header");
elHeader.innerHTML = showHeader();
displayBody.appendChild(elHeader);

/*DISPLAY MAIN*/
const elMain = document.createElement("main");
displayBody.appendChild(elMain);

const elDivIntro = document.createElement("div");
elDivIntro.className = "intro";
elMain.appendChild(elDivIntro);
//imágen del título, en un div con el resto de la intro
const titleImage = document.createElement("img");
titleImage.src = "/MainLogo.png";
titleImage.alt = "Main page title: 'Rick & Morty'";
titleImage.className = "main-logo";
elDivIntro.appendChild(titleImage);
//subtitulo
const elSubTitle = document.createElement("h3");
elSubTitle.textContent = "Episode Library";
elDivIntro.appendChild(elSubTitle);
//parrafito
const elParrafo = document.createElement("p");
elParrafo.textContent =
  "Search for episodes! Save your favorites! Try ur episode randomizer!";
elDivIntro.appendChild(elParrafo);
//anchor a la libreria
const elAlibrary = document.createElement("a");
elAlibrary.href = "./library.html";
elAlibrary.textContent = " Go to library ";
elDivIntro.appendChild(elAlibrary);

/*RANDOMIZADOR DE EPISODIOS*/
const elDivRandomizer = document.createElement("div");
elDivRandomizer.className = "div-randomizer";
elMain.appendChild(elDivRandomizer);
elDivRandomizer.innerHTML = `
<div class="container">
  <div class="content-img" id="img-1">
    <img src="./public/FotoLeftSide.png" alt="decoracion del randomizador">
  </div>
  <div class="content">
    <h1>The Episode Randomizer</h1>
    <p>Generate a random episode by clicking the button below</p>
    <button id="random-btn">CLICK HERE</button>
    <div id="episode-card" class="episode-card hidden">
    </div>
    </div>
    <div class="content-img" id="img-2">
       <img src="./public/FotoRightSide.png" alt="decoracion del randomizador">
    </div>
</div>`;

//hacer que el boton busque en la api un episodio random.
document.getElementById("random-btn").addEventListener("click", async () => {
  const card = document.getElementById("episode-card");
  card.classList.remove("hidden");
  card.innerHTML = "<p>loading...</p>";

  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const total = data.info.count;
    const randomId = Math.floor(Math.random() * total) + 1;

    const episodeRes = await fetch(`${API_URL}/${randomId}`);
    const episode = await episodeRes.json();
    const description =
      episodeDescriptions[randomId] || "No description available.";

    card.innerHTML = `
        <h3>${episode.name}</h3>
        <h5>Episode: ${episode.episode}</h5>
        <h5>Air Date: ${episode.air_date}</h5>
        <p>${description}</p>
 `;
    card.classList.remove("hidden");
  } catch (error) {
    card.innerHTML = "Unable to find an episode.";
    console.error(error);
  }
});

/*DISPLAY FOOTER*/
const elFooter = document.createElement("footer");
elFooter.innerHTML = showFooter();
displayBody.appendChild(elFooter);
