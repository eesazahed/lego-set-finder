const apikey = ""; // Insert your API key here. 

const main = document.getElementById("main");
const form = document.getElementById("form");
const searchTheme = document.getElementById("searchTheme");
const searchSet = document.getElementById("searchSet");
const loading = document.getElementById("loading");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  searchForSet(searchTheme.value, searchSet.value);
});

async function searchForSet(theme, set) {
  loading.innerHTML = "Loading...";
  main.innerHTML = "";

  const themesFile = "./themes.json";
  const themesResponse = await fetch(themesFile);
  const themesData = await themesResponse.json();

  let returnedThemes = [];

  themesData.results.forEach((result) => {
    if (result.name.toUpperCase() === theme.toUpperCase()) {
      returnedThemes.push(result.id);
    }
  });

  if (returnedThemes.length > 0) {
    returnedThemes.forEach((themeID) => {
      themesData.results.forEach((result) => {
        if (result.parent_id == themeID) {
          returnedThemes.push(result.id);
        }
      });
    });
    searchForTheme(returnedThemes, set);
  } else {
    loading.innerHTML = "Theme unavailable.";
  }
}

async function searchForTheme(themes, set) {
  let setsURL, setsResponse, setsData;

  let results = [];

  for (let i = 0; i < themes.length; i++) {
    setsURL = `https://rebrickable.com/api/v3/lego/sets/?key=${apikey}&theme_id=${themes[i]}&search=${set}&page_size=1000`;
    setsResponse = await fetch(setsURL);
    setsData = await setsResponse.json();

    if (setsData.count !== 0) {
      results.push(setsData.results);
    }
  }

  main.innerHTML = "";

  if (results.length > 0) {
    results.forEach((theme) =>
      theme.forEach((set) => {
        if (/^\d+(-\d+)?$/.test(set.set_num)) createSet(set);
      })
    );
    loading.innerHTML = "";
  } else {
    loading.innerHTML = "Set unavailable";
  }
}

function createSet(data) {
  const newSet = document.createElement("div");
  newSet.className = "lego-set";
  newSet.innerHTML = `
        <img src=${data.set_img_url} alt=${data.name} />
        <p>${data.name}</p>
        <p>Set Number: ${data.set_num}</p>
        <p>Year: ${data.year}</p>
        <p>${data.num_parts} pieces.</p>
    `;
  main.appendChild(newSet);
}
