import React, { useState } from 'react';

function SearchSongs(props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${searchTerm}&type=track`, {
        headers: {
          Authorization: `Bearer ${props.access_token}`,
        },
      });
      const data = await response.json();
      setSearchResults(data.tracks.items);
      console.log(data.tracks.items)
    } catch (error) {
      console.error(error);
    }
  };

  const playSong = async (songURI) => {
    try {
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${props.access_token}`
        },
        body: JSON.stringify({
          uris: [
            songURI
          ],
        })
      };
  
      const response = await fetch('https://api.spotify.com/v1/me/player/play', requestOptions);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error ${response.status}: ${errorData.error.message}`);
      }
  
      console.log('Song started playing:', songURI);
    } catch (error) {
      console.error('Error playing song:', error);
    }
  };
  

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Search songs..." value={searchTerm} onChange={handleChange} />
        <button type="submit">Search</button>
      </form>
      <table>
        <thead>
            <td>Song</td>
            <td>Artist</td>
            <td>Album</td>
        </thead>
        <tbody>
          {
            searchResults.length > 0 &&
            searchResults.map((result, i) => (
              <tr key={i}>
                <td>{result.name}</td>
                <td>{result.artists[0].name}</td>
                <td>{result.album.name} <button onClick={() => playSong(result.uri)}>PLAY</button></td>
              </tr>
            ))
          }
        </tbody>
      </table>
      {/* {searchResults.length > 0 && (
        <ul>
          {searchResults.map((result) => (
            <li key={result.id}>
              {result.name} by {result.artists[0].name}
            </li>
          ))}
        </ul>
      )} */}
    </div>
  );
}

export default SearchSongs;
