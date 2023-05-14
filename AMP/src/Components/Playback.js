import React, { useState, useEffect } from 'react';
import "./assets/css/spotify.css"

const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}

function WebPlayback(props) {
    const [myData, setMyData] = useState([])
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [current_track, setTrack] = useState(track);
    const [deviceId, setDeviceId] = useState(undefined);
    const [position, setPosition] = useState(0);

    useEffect(() => {

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
                console.log('Ready with Device ID', device_id)
                setDeviceId(device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', ( state => {

                if (!state) {
                    return;
                }

                setTrack(state.track_window.current_track);
                setPaused(state.paused);
                setPosition(state.position);
                
                player.getCurrentState().then( state => { 
                    (!state)? setActive(false) : setActive(true) 
                });

            }));

            player.connect();

        };

        setMyData(props.data)

    }, []);

    useEffect(() => {
        // PUT request using fetch inside useEffect React hook
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${props.token}` 
            },
            body: JSON.stringify({
                device_ids: [`${deviceId}`],
            })
        };
        fetch('https://api.spotify.com/v1/me/player', requestOptions)
    
    // empty dependency array means this effect will only run once (like componentDidMount in classes)
    }, [deviceId]);

    const handlePositionChange = (value) => {
        player.seek(value).then(() => {
            setPosition(value);
        });
    };

    const playUserPlaylists = (playlist) => {
        return () => {
            if (!is_active) {
                return;
            } else {
                const requestOptions = {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${props.token}`
                    },
                    body: JSON.stringify({
                        context_uri: myData.PLAYLIST_SONGS?.items[playlist].uri,
                        offset: {
                            position: 5
                        },
                        position_ms: 0
                    })
                };
                fetch('https://api.spotify.com/v1/me/player/play', requestOptions)

                
            }
        };
    }
    
    const timeStamp = (ms) => {
        const seconds = Math.floor(ms/1000);
        const minutes = Math.floor(seconds/60);
        if (seconds % 60 <= 9){
            return (`${minutes % 60}:0${seconds % 60}`)            
        } else {
            return (`${minutes % 60}:${seconds % 60}`)   
        }

    }

    if (!is_active) { 
        return (
            <>
                <div className="container mx-auto">
                    <div className="main-wrapper pb-20">
                        <b> Instance not active. Transfer your playback using your Spotify app </b>
                    </div>
                </div>
            </>)
    } else {
        return (
            <>
                <div className="container mx-auto">
                    <div className="main-wrapper">

                        <img src={current_track?.album.images[0].url} className="now-playing__cover" alt="Image Not Found. Try Clicking Play"/>

                        <div className="now-playing__side">
                            <div className="now-playing__name">{current_track?.name}</div>
                            <div className="now-playing__artist">{current_track?.artists[0].name}</div>

                            <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
                                &lt;
                            </button>

                            <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
                                { is_paused ? "PLAY" : "PAUSE" }
                            </button>

                            <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
                                &gt;
                            </button>

                            <input type="range" min="0" max="100" value={position / current_track?.duration_ms * 100} className="ml-5 progress-bar" onChange={(e) => handlePositionChange(e.target.value / 100 * current_track.duration_ms)}/>
                            <div className=' ml-64'>{timeStamp(position)}</div>

                        </div>
                        <div>
                            <table className='mx-auto my-auto'>
                                <thead>
                                    <tr className=''>
                                        <th className='text-left font-semibold border-b-2 border-r-2'>Playlists</th>
                                        <th className='text-left font-semibold border-b-2 pl-1'>Owner</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myData.PLAYLIST_SONGS?.items.map((key, i) => (
                                        <tr key={i}>
                                            <td className='text-left border-r-2 pr-2'>{key.name}</td>
                                            <td className='text-left pl-1'>{key.owner.display_name}</td>
                                            <td><button className='mb-2 ml-2 shadow bg-red-500 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white font-bold py-1 px-2 rounded' onClick={playUserPlaylists(i)}>PLAY</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default WebPlayback