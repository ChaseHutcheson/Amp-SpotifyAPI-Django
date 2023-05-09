import React from 'react'

export const Login = () => {
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const response = await fetch('/api/login/', {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          // handle successful login
        } else {
          // handle invalid credentials
        }
      }

    return (
        <div>
            <h1>Log In</h1>
            <form action="/api/submit-form" onSubmit={handleSubmit()}>
                <input>Username: </input>
                <input>Password: </input>
                <button type='submit'>Finish</button>
            </form>
        </div>
    )
}
