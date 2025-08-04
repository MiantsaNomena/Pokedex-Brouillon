let allPokemons = [];

async function loadPokemons() {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100');
  const data = await response.json();
  const container = document.getElementById("pokemonList");

  for (let pokemon of data.results) {
    const res = await fetch(pokemon.url);
    const poke = await res.json();

    allPokemons.push(poke);
    displayPokemon(poke, container);
  }
}

function displayPokemon(pokemon, container) {
  const card = document.createElement("div");
  card.className = "pokemon-card";
  card.innerHTML = `
    <h3>#${pokemon.id} ${pokemon.name}</h3>
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    <p><strong>Type:</strong> ${pokemon.types.map(t => t.type.name).join(", ")}</p>
    <p><strong>Taille:</strong> ${pokemon.height / 10} m</p>
    <p><strong>Poids:</strong> ${pokemon.weight / 10} kg</p>
  `;
  container.appendChild(card);
}

document.getElementById("search").addEventListener("input", function () {
  const value = this.value.toLowerCase();
  const container = document.getElementById("pokemonList");
  container.innerHTML = "";

  const filtered = allPokemons.filter(p => p.name.includes(value));
  filtered.forEach(p => displayPokemon(p, container));
});

loadPokemons();
