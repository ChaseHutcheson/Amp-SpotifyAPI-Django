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
            });
    }, []);

    return (
        <div>
            <a href='http://127.0.0.1:8000/api/authenticate'><button >Get Tokens</button></a>
        </div>
    );
}

export default MyComponent;