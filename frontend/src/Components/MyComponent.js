import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Logo from './assets/imgs/spotify_logo.png'


const MyComponent = () => {
    const [myData, setMyData] = useState([]);

    function getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== '') {
          const cookies = document.cookie.split(';');
          for (let i = 0; i < cookies.length; i++) {
              const cookie = cookies[i].trim();
              // Does this cookie string begin with the name we want?
              if (cookie.substring(0, name.length + 1) === (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
              }
          }
      }
      return cookieValue;
    }
    
    const fetchUserData = () => {
        fetch("http://127.0.0.1:8000/api/spotify-callback", {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') //getCookie function retrieves the CSRF token from the cookie
          }
        })
          .then(response => {
            return response.json();
          })
          .then(res => {
            setMyData(res);
            console.log(res)
          }).catch(console.error);
      }

      useEffect(() => {
        fetchUserData();
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
    
        document.body.appendChild(script);
    
        window.onSpotifyWebPlaybackSDKReady = () => {
    
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(props.token); },
                volume: 0.5
            });
    
            setPlayer(player);
    
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });
    
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });
    
    
            player.connect();
    
        };
      }, [])
  
  
      return (
        <body>
          <header class="bg-black py-3">
            <div class="app-container">
              <div class="flex justify-between items-center text-white">
                <figure>
                  <a href="">
                    <h1 className='ml-2 font-bold text-lg'>AMP</h1>
                  </a>
                </figure>

                <div class="flex items-center">
                  <nav class="lg:block hidden">
                    <ul class="flex items-center">
                      <li>
                        <a class="inline-block text-white font-bold py-4 px-5 hover:text-hoverspt" href="#premium">
                          Premium
                        </a>
                      </li>
          
                      <li>
                        <a class="inline-block text-white font-bold py-4 px-5 hover:text-hoverspt" href="#suporte">
                          Suporte
                        </a>
                      </li>
          
                      <li>
                        <a class="inline-block text-white font-bold py-4 px-5 hover:text-hoverspt" href="#baixar">
                          Baixar
                        </a>
                      </li>
                    </ul>
                  </nav>
          
                  <div class="flex items-center gap-3 lg:gap-0 ml-4 relative after:content-[''] after:h-4 after:w-px after:bg-white after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:hidden after:lg:block">
                    <figure class="ml-8 cursor-pointer flex items-center gap-3 hover:text-hoverspt">
                      <img class="inline-block h-8 w-8 lg:h-11 lg:w-11 rounded-full" src={myData.USER_DATA.images[0].url} alt="User Photo"></img>
                      <span class="font-bold hidden lg:block">Profile</span>
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
                  <a 
                    class="button bg-red text-white mt-5 md:mt-11" 
                    href="">
                    Iniciar teste grátis
                  </a>
                  <p class="text-red text-xs mt-8 md:font-semibold">Subject to Terms and Conditions. Only available to users who haven't tried Premium yet.</p>
                </div>
              </div>
            </section>

            <section 
              class="h-480 md:h-600 bg-spotify-theme-moblie xl:bg-spotify-theme bg-banner-mobile xl:bg-banner bg-181% xl:bg-100% bg-purple-main bg-no-repeat flex items-center md:block"
            >
              <div class="app-container">
                <div class='text-green-main text-center xl:text-left md:pt-124'>
                  <h1 class="text-3xl font-bold md:text-6xl">Is it music you want?</h1>
                  <h2 class="font-medium mt-7 md:mt-11 mb-8 md:mb-11 md:text-2xl">Listen to the best releases of the moment.</h2>
                  <a 
                    class="button bg-green-main text-purple-main" 
                    href="">
                    Access the web player
                  </a>
                </div>
              </div>
            </section>
          </main>

          <footer class="bg-black fixed inset-x-0 bottom-0 py-20">
            <div class="app-container">
              <div class="text-white flex flex-col lg:flex-row md:block lg:flex lg:justify-between">
                <div class="flex flex-col lg:flex-row gap-12 lg:gap-14">
                  <h4>Super cool epic footer</h4>
                </div>
              </div>
            </div>
          </footer>
        </body>
      );
    
}

export default MyComponent;