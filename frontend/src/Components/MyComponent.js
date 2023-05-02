import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyComponent = () => {
    const [myData, setMyData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/mymodel/')
            .then(response => {
                setMyData(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <div>
            {myData.map(item => (
                <div key={item.id}>{item.name}</div>
            ))}
        </div>
    );
}

export default MyComponent;