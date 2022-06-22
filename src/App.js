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
      setUser(user)
      setCredentials({ 
        username: '',
        password: ''
      })
    } catch(error) {
      console.log(error)
    }
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
        {`${user.name} logged in`}
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
