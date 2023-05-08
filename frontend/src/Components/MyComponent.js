import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
            console.log(res);
            setMyData(res);
          }).catch(console.error);
      }
    
      useEffect(() => {
        fetchUserData()
      }, [])
    
      return (
        <div>
          <div>User ID: {myData.USER_DATA.id}</div>
          <div>Display_name: {myData.USER_DATA.display_name}</div>
          <div>{myData.map((USER_DATA) => {<div>{USER_DATA.display_name}</div>})}</div>
        </div>
      );
    
}

export default MyComponent;