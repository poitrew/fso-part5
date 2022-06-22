import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  // ----------------------- STATE INITIALIZATION ------------------------
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState({
    content: '',
    color: '',
  })
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
  // ----------------------- EFFECT HOOKS ------------------------
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

  // ----------------------- utils ------------------------------

  const resetMessage = () => {
    setTimeout(() => {
      setMessage({
        content: '',
        color: '',
      })
    }, 5000)
  }

  // ----------------------- EVENT HANDLERS ------------------------
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
      setMessage({
        content: 'Wrong username or password',
        color: 'red'
      })
      resetMessage()
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
      setMessage({
        content: `a new blog ${savedBlog.title} by ${savedBlog.author} added`,
        color: 'green'
      })
      resetMessage()
      setNewBlog({
        title: '',
        author: '',
        url: '',
      })
    } catch(error) {
      console.log(error)
    }
  }

  // ----------------------- FUNCTIONS FOR CREATING JSX ------------------------

  const loginForm = () => (
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
  )

  const main = () => {
    return (
      <>
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
      <h2>{user === null ? 'log in to application' : 'blogs'}</h2>
      <Notification message={message} />
      {user === null 
        ? loginForm()
        : main()
      }
    </div>
  )
}

export default App
