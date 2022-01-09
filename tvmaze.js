/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
const MISSING_IMAGE_URL = "http://tinyurl.com/missing-tv";

async function searchShows(query) {
  const res = await axios.get("http://api.tvmaze.com/search/shows", { params: { q: query } })
  let getShow = res.data;
  let showsArray = [];
  for (let shows of getShow) {
    let showInfo = {
      id: shows.show.id,
      name: shows.show.name,
      summary: shows.show.summary,
      image: shows.show.image ? shows.show.image.medium : MISSING_IMAGE_URL,
    }
    showsArray.push(showInfo);
  };
  return showsArray;
};
// TODO: Make an ajax request to the searchShows api.  Remove
// hard coded data.

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button id = "episodes-btn-${show.id}" class="card-button"> Episode</button>
             <ul id = "listedUnch-${show.id}"></ul>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
    const cardBtn = document.querySelector(`#episodes-btn-${show.id}`);
    cardBtn.addEventListener("click", async function () {
      const episodes = await getEpisodes(show.id);
      console.log(episodes)
      populateEpisodes(episodes,show.id);
    })
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  const episode = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
  let epArr = episode.data;
  let finalInfo = [];
  for (let showInfo of epArr) {
    let episodeInfo = {
      id: showInfo.id,
      name: showInfo.name,
      season: showInfo.season,
      number: showInfo.number,
    }
    finalInfo.push(episodeInfo);
  }
  return finalInfo;
};

function populateEpisodes(episodes,showId) {
  let episodeList = document.querySelector(`#listedUnch-${showId}`);

  for (let episode of episodes) {
    let epiList = document.createElement("li");
    epiList.innerText = `${episode.name} (season ${episode.season}, episode ${episode.number})`;
    episodeList.append(epiList);
  }
  $("#episodes-area").show();
}



// TODO: get episodes from tvmaze
//       you can get this by making GET request to
//       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

// TODO: return array-of-episode-info, as described in docstring above
