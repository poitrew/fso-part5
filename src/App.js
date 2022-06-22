import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: '',
  })
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

  const handleCreateBlogInput = (event) => {
    setNewBlog(prevState => ({
      ...prevState,
      [event.target.name]: event.target.value
    }))
  }

  console.log(blogs)

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login(credentials)
      localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
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
    setUser(null)
  }

  const addBlog = async (event) => {
    event.preventDefault()
    try {
      const savedBlog = await blogService.create(newBlog)
      setBlogs(prev => prev.concat(savedBlog))
      setNewBlog({
        title: '',
        author: '',
        url: '',
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
        <div>
          {`${user.name} logged in`}
          <button onClick={handleLogout}>log out</button>
        </div>
        <h2>Create new</h2>
        <form onSubmit={addBlog}>
          <label>
            title
            <input 
              type='text'
              name='title'
              value={newBlog.title}
              onChange={handleCreateBlogInput}>
            </input>
          </label>
          <br />
          <label>
            author
            <input 
              type='text'
              name='author'
              value={newBlog.author}
              onChange={handleCreateBlogInput}>
            </input>
          </label>
          <br />
          <label>
            url
            <input 
              type='text'
              name='url'
              value={newBlog.url}
              onChange={handleCreateBlogInput}>
            </input>
          </label>
          <br />
          <button type='submit'>create</button>
        </form>
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
