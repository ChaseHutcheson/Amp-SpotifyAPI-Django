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
                {searchResults.map((result) => {
                    <tr key={result.id}>
                        <td>{result.name}</td>
                        <td>{result.artists[0].name}</td>
                        <td>{result.album}</td>
                    </tr>
                })}
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
