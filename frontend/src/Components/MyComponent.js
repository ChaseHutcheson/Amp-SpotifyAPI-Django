import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyComponent = () => {
    const [myData, setMyData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/get-tokens')
            .then(response => {
                setMyData(response.data);
            })
            .catch(error => {
                console.log(error);
            })
            
            console.log(myData);
    }, []);

    return (
        <div>
            <script src="https://sdk.scdn.co/spotify-player.js"></script>
            <script>
                window.onSpotifyWebPlaybackSDKReady = () ={'>'} {
                const token = '[My access token]';
                const player = new Spotify.Player({
                    name: 'Web Playback SDK Quick Start Player',
                    getOAuthToken: cb => { cb(token); },
                    volume: 0.5
                });
            </script>
            <a href='http://127.0.0.1:8000/api/spotify-login'><button >Get Tokens</button></a>
        </div>
    );
}

export default MyComponent;