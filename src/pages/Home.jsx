/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import styled from 'styled-components';

import CharacterCard from '../components/CharacterCard';
import Header from '../components/Header';
import Loading from '../components/Loading';
import { getLocalStorage, setLocalStorage } from '../helpers/localStorage';

const CardArea = styled.div`
  margin: 0 auto;
  width: 60em;
  padding: 2em 0;
  display: grid;
  grid-template-columns: repeat(3, 20em);
  align-content: center;
  justify-items: center;
`;

export default class Home extends Component {
  // eslint-disable-next-line react/state-in-constructor
  constructor() {
    super();
    this.state = {
      characterList: [],
      favoritedCharacters: getLocalStorage('favoritedCharacters') || [], // Id dos personagens favoritados
      isLoading: true,
    };
  }

  componentDidMount() {
    const fetchApi = async () => {
      const response = await fetch('https://rickandmortyapi.com/api/character');
      const data = await response.json();

      setTimeout(() => this.setState({ isLoading: false, characterList: data.results }), 1000);
    };
    fetchApi();
  }

  updateFavoritesLocalstorage = () => {
    const { favoritedCharacters } = this.state;
    setLocalStorage('favoritedCharacters', favoritedCharacters);
  };

  handleFavorites = ({ target }) => {
    const { favoritedCharacters } = this.state;

    const isFavorite = favoritedCharacters.some((id) => Number(id) === Number(target.id));

    if (isFavorite) {
      const newFavorite = favoritedCharacters.filter((id) => Number(id) !== Number(target.id));
      target.checked = false;
      this.setState({
        favoritedCharacters: newFavorite,
      });
    } else {
      target.checked = true;
      this.setState({
        favoritedCharacters: [...favoritedCharacters, target.id],
      }, this.updateFavoritesLocalstorage);
    }
  };
  // const favoritedChar = favoritedCharacters.find((favoritedId) => favoritedId === id);

  // if (favoritedChar) { // Remove personnagem favorito
  //   const updatedFavorites = favoritedCharacters.filter((favoritedId) => favoritedId !== id);
  //   this.setState({ favoritedCharacters: updatedFavorites }, this.updateFavoritesLocalstorage);
  // } else { // Adiciona personagem favorito
  //   this.setState(
  //     { favoritedCharacters: [...favoritedCharacters, id] },
  //     this.updateFavoritesLocalstorage,
  //   );
  // }
  // };

  // getFavorited = (id) => {
  //   const { favoritedCharacters } = this.state;
  //   return favoritedCharacters.some((favoriteId) => favoriteId === id);
  // };

  render() {
    const { user } = this.props;
    const { characterList, isLoading } = this.state;

    return (
      <>
        <Header user={user} />
        {
        isLoading ? <Loading /> : (
          <CardArea>
            {
              characterList.map((character) => (
                <CharacterCard
                  key={character.id}
                  id={character.id}
                  image={character.image}
                  name={character.name}
                  status={character.status}
                  gender={character.gender}
                  handleFavorites={this.handleFavorites}
                  isFavorited
                />
              ))
            }
          </CardArea>
        )
        }
      </>
    );
  }
}
