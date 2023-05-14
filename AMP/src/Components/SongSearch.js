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
    <div className='mx-auto'>
      <form onSubmit={handleSubmit} className='mb-6'>
        <input className='bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name" type="text"' type="text" placeholder="Search songs..." value={searchTerm} onChange={handleChange} />
        <button className='shadow bg-red-500 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded' type="submit">Search</button>
      </form>
      <h1 className='text-xl font-bold mb-2'>Search Results</h1>
      <table className='mx-auto mb-10 w-4/6' title='Search Results'>
        <thead>
          <tr>
            <th className='text-left font-semibold border-b-2 border-r-2'>Songs</th>
            <th className='text-left font-semibold border-b-2 border-r-2'>Artist</th>
            <th className='text-left font-semibold border-b-2'>Album</th>
          </tr>
        </thead>
        <tbody>
          {
            searchResults.length > 0 &&
            searchResults.map((result, i) => (
              <tr key={result.id}>
                <td className='text-left border-b-2'>{result.name}</td>
                <td className='text-left border-b-2'>{result.artists[0].name}</td>
                <td className='text-left border-b-2'>{result.album.name}</td>
                <td><button className='mb-2 shadow bg-red-500 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white font-bold py-1 px-2 rounded' onClick={() => playSong(result.uri)}>PLAY</button></td>
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
