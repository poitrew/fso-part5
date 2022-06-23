import { useState } from 'react'

const LoginForm = ({ login, logout, user }) => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    })

    const handleChange = (event) => {
        setCredentials(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        login(credentials)
        setCredentials({
            username: '',
            password: '',
        })
    }

    const loggedIn = user === null ? false : true

    return (
        <>
            {!loggedIn
                ?
                <form onSubmit={handleSubmit}>
                    <label>
                            username
                        <input
                            type='text'
                            name='username'
                            value={credentials.username}
                            onChange={handleChange}
                        ></input>
                    </label>
                    <br />
                    <label>
                            password
                        <input
                            type='password'
                            name='password'
                            value={credentials.password}
                            onChange={handleChange}
                        ></input>
                    </label>
                    <br />
                    <button type='submit'>login</button>
                </form>
                : <div>{`${user.name} logged in`}<button onClick={logout}>log out</button></div>
            }
        </>
    )
}

export default LoginForm