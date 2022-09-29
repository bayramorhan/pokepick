import axios from "axios";
import { useState, useEffect } from "react";
import {
  ChevronRightIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import "./picker.css";
import PokeBall from "../assets/pokeball.png";

const baseURL = "https://pokeapi.co/api/v2/";

const Picker = () => {
  const [pokemons, setPokemons] = useState();
  const [selectedPokemon, setSelectedPokemon] = useState();
  const [total, setTotal] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [throwing, setThrowing] = useState(false);
  const [isCatched, setIsCatched] = useState(false);

  useEffect(() => {
    setIsCatched(false);
  }, [selectedPokemon]);

  const getPokemonDetails = async (url) => {
    await axios.get(url).then((response) => {
      console.log(response.data);
      setSelectedPokemon(response.data);
    });
  };

  const getNextPokemon = async () => {
    let nextPokemon = pokemons[currentIdx + 1];
    await getPokemonDetails(nextPokemon.url);
    setCurrentIdx((currentIdx) => currentIdx + 1);
  };

  const getPreviousPokemon = async () => {
    let previousPokemon = pokemons[currentIdx - 1];
    await getPokemonDetails(previousPokemon.url);
    setCurrentIdx((currentIdx) => currentIdx - 1);
  };

  const getLastPokemon = async () => {
    let previousPokemon = pokemons[total - 1];
    await getPokemonDetails(previousPokemon.url);
    setCurrentIdx(total - 1);
  };

  const getFirstPokemon = async () => {
    let firstPokemon = pokemons[0];
    await getPokemonDetails(firstPokemon.url);
    setCurrentIdx(0);
  };

  const moves = () => {
    return selectedPokemon.moves.map((move) => (
      <option className="capitalize" key={move.move.name}>
        {move.move.name.replace("-", " ")}
      </option>
    ));
  };

  const heldItems = () => {
    return selectedPokemon.held_items.length > 0
      ? selectedPokemon.held_items.map((heldItem, key) => (
          <span
            key={key}
            className="px-2 py-1 bg-gray-100 rounded text-sm capitalize text-center"
          >
            {heldItem.item.name.replace("-", " ")}
          </span>
        ))
      : "-";
  };

  const pokeBallClickHandler = () => {
    setThrowing(true);
    setTimeout(() => {
      setThrowing(false);
      setIsCatched(Math.random() < 0.5);
    }, 1500);
  };

  useEffect(() => {
    axios.get(baseURL + "pokemon?limit=1154").then((response) => {
      setTotal(response.data.count);
      setPokemons(response.data.results.filter((item) => item.url));
      let initialPokemon = response.data.results[0];
      getPokemonDetails(initialPokemon.url);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          className={`bg-indigo-50 rounded-full p-2 border border-indigo-200 text-indigo-600 ${
            currentIdx < 10 && "opacity-50 cursor-not-allowed"
          }`}
          disabled={currentIdx < 10}
          onClick={getFirstPokemon}
        >
          <ChevronDoubleRightIcon className="w-4 rotate-180" />
        </button>
        <button
          className={`bg-indigo-50 rounded-full p-2 border border-indigo-200 text-indigo-600 ${
            currentIdx === 0 && "opacity-50 cursor-not-allowed"
          }`}
          disabled={currentIdx === 0}
          onClick={getPreviousPokemon}
        >
          <ChevronRightIcon className="w-4 rotate-180" />
        </button>
        <button
          className="bg-indigo-50 rounded-full p-2 border border-indigo-200 text-indigo-600"
          onClick={getNextPokemon}
        >
          <ChevronRightIcon className="w-4" />
        </button>

        <button
          className={`bg-indigo-50 rounded-full p-2 border border-indigo-200 text-indigo-600 ${
            currentIdx === total - 1 && "opacity-50 cursor-not-allowed"
          }`}
          disabled={currentIdx === total - 1}
          onClick={getLastPokemon}
        >
          <ChevronDoubleRightIcon className="w-4" />
        </button>
      </div>
      {selectedPokemon && (
        <div className="grid grid-cols-12 border divide-x h-[500px]">
          <div className="col-span-12">
            <h2 className="capitalize font-semibold text-lg bg-indigo-50 p-4">
              {selectedPokemon.name}
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4">
            <div className="space-y-10">
              <div className="pt-4 px-6 relative">
                {Math.random() < 0.5 &&
                selectedPokemon.moves.length > 0 &&
                throwing ? (
                  <span className="absolute capitalize truncate bg-black px-4 py-2 bg-opacity-60 text-gray-100 text-sm font-medium top-full mt-4 left-1/2 transform -translate-x-1/2">
                    {selectedPokemon.name} used{" "}
                    {
                      selectedPokemon.moves[
                        Math.floor(Math.random() * selectedPokemon.moves.length)
                      ].move.name
                    }{" "}
                    attack!
                  </span>
                ) : (
                  ""
                )}
                {selectedPokemon?.sprites?.other.dream_world?.front_default && (
                  <img
                    className={`h-44 w-44 object-contain mx-auto ${
                      throwing && Math.random() < 0.5 ? `run` : ""
                    }`}
                    src={
                      selectedPokemon.sprites.other.dream_world.front_default
                    }
                    alt={selectedPokemon.name}
                  />
                )}
                {!selectedPokemon?.sprites?.other.dream_world
                  ?.front_default && (
                  <div className="h-64 w-full border rounded flex items-center justify-center p-4 text-center">
                    <p>No image found for this pokémon</p>
                  </div>
                )}
                {!isCatched && (
                  <img
                    src={PokeBall}
                    alt="Pokéball"
                    className={`w-14 mt-6 mx-auto cursor-pointer hover:scale-110 transition-all duration-200 ${
                      throwing &&
                      "absolute -top-[140px] right-[800px] motion-demo"
                    }`}
                    onClick={pokeBallClickHandler}
                  />
                )}
                {
                  <h2 className={`font-semibold text-center pt-4`}>
                    {isCatched
                      ? `You catched ${selectedPokemon.name}!`
                      : !throwing && "Try to catch!"}
                  </h2>
                }
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-8">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="font-medium py-2 w-44">Pokémon Name</td>
                      <td className="capitalize">{selectedPokemon.name}</td>
                    </tr>
                    <tr>
                      <td className="font-medium py-2 w-44">Weight</td>
                      <td>{selectedPokemon.weight} kg</td>
                    </tr>
                    <tr>
                      <td className="font-medium py-2 w-44">Total Moves</td>
                      <td>{selectedPokemon.moves.length}</td>
                    </tr>
                    <tr>
                      <td className="font-medium py-2 w-44">Types</td>
                      <td>
                        <div className="flex space-x-2 items-center">
                          {selectedPokemon.types.map((type, key) => (
                            <span
                              key={key}
                              className="px-2 py-1 bg-gray-100 rounded text-sm capitalize"
                            >
                              {type.type.name}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium py-2 w-44">Held Items</td>
                      <td>
                        <div className="grid grid-cols-2 gap-2">
                          {heldItems()}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <h2 className="font-medium mb-2">All Moves</h2>
                <select multiple className="w-full h-72">
                  {moves()}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
      <p className="mt-4">
        <span className="text-sm text-gray-500 font-medium">{total}</span>{" "}
        pokémons found in our database
      </p>
    </div>
  );
};

export default Picker;
