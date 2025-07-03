/*FUNCIONES PARA EL HEADER Y EL FOOTER*/

export function showHeader() {
  return `
      <nav>
        <a href="/index.html"
          ><img src="/images/LogoPortal.png" alt="Logo de la página"
        /></a>
        <h3><a href="/library.html">Episodes Library</a></h3>
      </nav>
  `;
}

export function showFooter() {
  return `
      <div class="logos-footer">
        <a href="">
            <img
            src="/favicons/github.png"
            alt="Logo de github del repositorio"
            />
        </a>
        <a href="https://www.imdb.com/es/title/tt2861424/">
            <img
            src="/favicons/imdb.png"
            alt="Perfil de IMDB de Rick & Morty"
            />
        </a>
      </div>
      <div>
        <p>&copyThe Rick and Morty Library</p>        
      </div>
  `;
}
