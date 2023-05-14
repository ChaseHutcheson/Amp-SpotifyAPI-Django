import React, { useState, useEffect } from 'react';
import WebPlayback from './Playback';
import Login from './Login';
import SearchSongs from './SongSearch';

const HomePage = () => {
  const [myData, setMyData] = useState({});
  const [token, setToken] = useState('');

  const fetchUserData = async (key) => {
    const result = await fetch("https://api.spotify.com/v1/me", {
      method: "GET", headers: { Authorization: `Bearer ${key}` }
    })
    const json = await result.json();
    console.log(json);
    setMyData(json);
  }

  useEffect(() => {
    const fetchToken = async () => {
      const response = await fetch('/auth/token');
      const json = await response.json();
      console.log(json)
      setToken(json.access_token);
    }
    fetchToken();
  }, [])

  useEffect(() => {
    if (token) {
      fetchUserData(token);
    }
  }, [token])


  return (
    <div>
      <header className="bg-black py-3">
        <div className="app-container">
          <div className="flex justify-between items-center text-white">
            <figure className="ml-3 cursor-pointer flex items-center gap-3">
              <img className='w-12' src='/sound.png'/>                
              <span className="font-bold block">AMP</span>
              </figure>

            <div className="flex items-center">        
              <div className="flex items-center gap-3 lg:gap-0 ml-4 relative">
              <figure className="ml-8 cursor-pointer flex items-center gap-3 hover:text-hoverspt">
                <button>
                  {myData && myData.images && myData.images.length > 0 && <img className="inline-block h-8 w-8 lg:h-11 lg:w-11 rounded-full" src={myData.images[0].url} alt="PFP"></img>}
                  {myData && <span className="font-bold block">{myData.display_name}</span>}
                </button>
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
              <h1 className="font-bold text-2xl sm:text-4xl md:text-9xl md:leading-11 text-red">Try <span className='font-extrabold text-transparent  bg-clip-text bg-gradient-to-r from-red-500 to-orange-600'>AMP</span> Now!</h1>
            </div>
          </div>
        </section>

        <section 
          className="h-480 md:h-600 bg-spotify-theme-moblie xl:bg-spotify-theme bg-banner-mobile xl:bg-banner bg-181% xl:bg-100% bg-purple-main bg-no-repeat flex items-center md:block"
        >
          <div className="app-container">
            <div className='text-green-main text-center md:pt-124'>
              <h1 className="text-3xl mt-20 font-bold md:text-6xl">Is it music you want?</h1>
              <h2 className="font-medium mt-7 md:mt-11 mb-8 md:mb-11 md:text-2xl">Listen Whatever You Want</h2>
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