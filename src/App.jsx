import React, { useEffect, useState } from 'react'

function App() {
  const [pokemons, setPokemons] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPokemon, setSelectedPokemon] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
      const data = await res.json()
      setPokemons(data.results)
    }

    fetchData()
  }, [])

  const filtered = pokemons.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="app">
      <h1>Pokédex</h1>

      <input
        type="text"
        placeholder="Rechercher un Pokémon..."
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <div className="pokemon-list">
        {filtered.map((pokemon, index) => (
          <PokemonCard
            key={index}
            name={pokemon.name}
            url={pokemon.url}
            onClick={() => setSelectedPokemon(pokemon.url)}
          />
        ))}
      </div>

      {selectedPokemon && (
        <PokemonModal url={selectedPokemon} onClose={() => setSelectedPokemon(null)} />
      )}
    </div>
  )
}

function PokemonCard({ name, url, onClick }) {
  const [details, setDetails] = useState(null)

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await fetch(url)
      const data = await res.json()
      setDetails(data)
    }

    fetchDetails()
  }, [url])

  if (!details) return null

  return (
    <div className="pokemon-card" onClick={onClick}>
      <img src={details.sprites.front_default} alt={name} />
      <h3>{name.charAt(0).toUpperCase() + name.slice(1)}</h3>
      <p>Numéro: {details.id}</p>
    </div>
  )
}

function PokemonModal({ url, onClose }) {
  const [details, setDetails] = useState(null)
  const [species, setSpecies] = useState(null)
  const [evolutionNames, setEvolutionNames] = useState([])

  useEffect(() => {
    const fetchAll = async () => {
      const res = await fetch(url)
      const data = await res.json()
      setDetails(data)

      const resSpecies = await fetch(data.species.url)
      const speciesData = await resSpecies.json()
      setSpecies(speciesData)

      const evoRes = await fetch(speciesData.evolution_chain.url)
      const evoData = await evoRes.json()

      const evoNames = []
      let evo = evoData.chain
      while (evo) {
        evoNames.push(evo.species.name)
        evo = evo.evolves_to[0]
      }
      setEvolutionNames(evoNames)
    }

    fetchAll()
  }, [url])

  if (!details || !species) return null

  const types = details.types.map(t => t.type.name).join(', ')
  const abilities = details.abilities.map(a => a.ability.name).join(', ')
  const genderRate = species.gender_rate
  const gender = genderRate === -1 ? "Inconnu" : "Mâle & Femelle"
  const category = species.genera.find(g => g.language.name === "fr")?.genus || "Espèce"
  const weaknesses = "Non disponible ici" // Simplifié pour l’instant

  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose}>Fermer</button>
        <h2>{details.name.toUpperCase()} (#{details.id})</h2>
        <img src={details.sprites.front_default} alt={details.name} />

        <p><strong>Catégorie :</strong> {category}</p>
        <p><strong>Taille :</strong> {details.height}</p>
        <p><strong>Poids :</strong> {details.weight}</p>
        <p><strong>Genre :</strong> {gender}</p>
        <p><strong>Types :</strong> {types}</p>
        <p><strong>Talents :</strong> {abilities}</p>
        <p><strong>Faiblesses :</strong> {weaknesses}</p>
        <p><strong>Évolutions :</strong> {evolutionNames.join(' ➜ ')}</p>
      </div>
    </div>
  )
}

export default App
