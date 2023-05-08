import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyComponent = () => {
    const [myData, setMyData] = useState([]);

    
    const fetchUserData = () => {
        fetch("http://127.0.0.1:8000/api/get-tokens")
          .then(response => {
            return response.json();
          })
          .then(data => {
            console.log(data);
            setMyData(data);
          }).catch(console.error);
      }
    
      useEffect(() => {
        fetchUserData()
      }, [])
    
      return (
        <div>
          {myData.length > 0 && (
            <ul>
              {myData.map(user => (
                <li key={user.id}>{user.display_name}</li>
              ))}
            </ul>
          )}
        </div>
      );
    
}

export default MyComponent;