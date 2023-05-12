import React, { useState, useEffect } from 'react';
import WebPlayback from './Playback';
import Login from './Login';
import SearchSongs from './SongSearch';

const HomePage = () => {
  const [myData, setMyData] = useState([]);
  const [playlistData, setPlaylistData] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const UserData =  await fetch("http://127.0.0.1:8000/api/spotify-callback")
      const json = await UserData.json();
      setMyData(json)
      setToken(json.SENSETIVE.access_token)
    }
    fetchUserData();
  }, [])

  const fetchUserPlaylists = async () => {
    const UserPlaylists = await (
      await fetch('https://api.spotify.com/v1/playlists/3I0r3nEZzs8bRDo9lRlReL/tracks', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }).then(response => {
        return response.json()
      })
    )
    setPlaylistData(UserPlaylists)
  }

  const pfpUrl = String(myData.PROFILE_DATA?.images[0].url)  
  const display_name = String(myData.PROFILE_DATA?.display_name)
  console.log(playlistData)

  return (
    <div>
      <header className="bg-black py-3">
        <div className="app-container">
          <div className="flex justify-between items-center text-white">
            <figure>
              <a href="">
                <h1 className='ml-2 font-bold text-lg'>AMP</h1>
              </a>
            </figure>

            <div className="flex items-center">        
              <div className="flex items-center gap-3 lg:gap-0 ml-4 relative">
                <figure className="ml-8 cursor-pointer flex items-center gap-3 hover:text-hoverspt">
                  <img className="inline-block h-8 w-8 lg:h-11 lg:w-11 rounded-full" src={pfpUrl} alt="PFP"></img>
                  <span className="font-bold block">{display_name}</span>
                  <i className="bi bi-chevron-down text-xs hidden lg:block"></i>
                  <button><i className="bi bi-list text-white text-2xl block lg:hidden"></i></button>
                </figure>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="flex flex-col items-center bg-pink h-97 md:h-98 lg:h-99 xl:h-100">
          <div className="app-container">
            <div className="text-center pt-5">
              <h1 className="font-bold text-2xl sm:text-4xl md:text-9xl md:leading-11 text-red">Try Amp Now!</h1>
            </div>
          </div>
        </section>

        <section 
          className="h-480 md:h-600 bg-spotify-theme-moblie xl:bg-spotify-theme bg-banner-mobile xl:bg-banner bg-181% xl:bg-100% bg-purple-main bg-no-repeat flex items-center md:block"
        >
          <div className="app-container">
            <div className='text-green-main text-center md:pt-124'>
              <h1 className="text-3xl mt-20 font-bold md:text-6xl">Is it music you want?</h1>
              <h2 className="font-medium mt-7 md:mt-11 mb-8 md:mb-11 md:text-2xl">Listen to the best releases of the moment.</h2>
              <div>
              { (token === '') ? <Login/> : <WebPlayback token={token} data={myData}/> }
              <SearchSongs access_token={token} />
              </div>
              <ul>
                
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
    
}

export default HomePage;