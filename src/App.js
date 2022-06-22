import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUser = localStorage.getItem('loggedUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleCredentialsChange = (event) => {
    setCredentials(prevState => ({
      ...prevState,
      [event.target.name]: event.target.value
    }))
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login(credentials)
      localStorage.setItem('loggedUser', JSON.stringify(user))
      setUser(user)
      setCredentials({ 
        username: '',
        password: ''
      })
    } catch(error) {
      console.log(error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('loggedUser')
  }

  const loginForm = () => (
    <>
      <h2>login to application</h2>
      <form onSubmit={handleLogin}>
        <label>
          username
          <input
            type='text'
            name='username'
            value={credentials.username}
            onChange={handleCredentialsChange}
          ></input>
        </label>
        <br />
        <label>
          password
          <input
            type='password'
            name='password'
            value={credentials.password}
            onChange={handleCredentialsChange}
          ></input>
        </label>
        <br />
        <button type='submit'>login</button>
      </form>
    </>
  )

  const main = () => {
    return (
      <>
        <h2>blogs</h2>
        <div>
          {`${user.name} logged in`}
          <button onClick={handleLogout}>log out</button>
        </div>
        {blogs.map(blog => 
          <Blog key={blog.id} blog={blog} />
        )}
      </>
    )
  }

  return (
    <div>
      {user === null ? loginForm() : main()}
    </div>
  )
}

export default App
