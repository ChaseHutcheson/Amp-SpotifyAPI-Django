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


    if (!is_active) { 
        return (
            <>
                <div className="container mx-auto">
                    <div className="main-wrapper">
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
                                &lt;&lt;
                            </button>

                            <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
                                { is_paused ? "PLAY" : "PAUSE" }
                            </button>

                            <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
                                &gt;&gt;
                            </button>

                            <input type="range" min="0" max="100" step="1" value={position / current_track?.duration_ms * 100} className="progress-bar" onChange={(e) => handlePositionChange(e.target.value / 100 * current_track.duration_ms)} />

                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default WebPlayback