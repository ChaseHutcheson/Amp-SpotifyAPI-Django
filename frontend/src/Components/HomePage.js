import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Logo from './assets/imgs/spotify_logo.png'
import SpotifyPlayer from 'react-spotify-web-playback';
import WebPlayback from './Playback';

const HomePage = () => {
  const [myData, setMyData] = useState([]);
  const [playlistData, setPlaylistData] = useState([]);
  const [token, setToken] = useState(null);
  const [player, setPlayer] = useState(undefined);
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const UserData = await (
        await fetch("http://127.0.0.1:8000/api/spotify-callback"
        ).then(response => {
          return response.json();
        }).then(response => {
          setToken(response.SENSETIVE.access_token)
        })
      )
      setMyData(UserData)
    };

    fetchUserData()
  }, [])

  useEffect(() => {
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

    if (token) {
      fetchUserPlaylists()
    }
  }, [token])
  
  return (
    <div>
      <header class="bg-black py-3">
        <div class="app-container">
          <div class="flex justify-between items-center text-white">
            <figure>
              <a href="">
                <h1 className='ml-2 font-bold text-lg'>AMP</h1>
              </a>
            </figure>

            <div class="flex items-center">        
              <div class="flex items-center gap-3 lg:gap-0 ml-4 relative">
                <figure class="ml-8 cursor-pointer flex items-center gap-3 hover:text-hoverspt">
                  <img class="inline-block h-8 w-8 lg:h-11 lg:w-11 rounded-full" alt="User Photo"></img>
                  <span class="font-bold hidden lg:block"></span>
                  <i class="bi bi-chevron-down text-xs hidden lg:block"></i>
                  <button><i class="bi bi-list text-white text-2xl block lg:hidden"></i></button>
                </figure>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section class="flex flex-col items-center bg-pink h-97 md:h-98 lg:h-99 xl:h-100">
          <div class="app-container">
            <div class="text-center pt-5">
              <h1 class="font-bold text-2xl sm:text-4xl md:text-9xl md:leading-11 text-red">Try Amp Now!</h1>
            </div>
          </div>
        </section>

        <section 
          class="h-480 md:h-600 bg-spotify-theme-moblie xl:bg-spotify-theme bg-banner-mobile xl:bg-banner bg-181% xl:bg-100% bg-purple-main bg-no-repeat flex items-center md:block"
        >
          <div class="app-container">
            <div class='text-green-main text-center md:pt-124'>
              <h1 class="text-3xl mt-20 font-bold md:text-6xl">Is it music you want?</h1>
              <h2 class="font-medium mt-7 md:mt-11 mb-8 md:mb-11 md:text-2xl">Listen to the best releases of the moment.</h2>
              <div>
                <WebPlayback token={token}/>
              </div>
              <ul>
                
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer class="bg-black fixed inset-x-0 bottom-0 py-20">
        <div class="app-container">
          <div class="text-white text-center">
            <div>
              <h4>Super cool epic footer</h4>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
    
}

export default HomePage;