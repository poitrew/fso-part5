import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
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
    const handleLogin = async (credentials) => {
        try {
            const user = await loginService.login(credentials)
            localStorage.setItem('loggedUser', JSON.stringify(user))
            blogService.setToken(user.token)
            setUser(user)
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

    const addBlog = async (newBlog) => {
        try {
            const savedBlog = await blogService.create(newBlog)
            setBlogs(prev => prev.concat(savedBlog))
            setMessage({
                content: `a new blog ${savedBlog.title} by ${savedBlog.author} added`,
                color: 'green'
            })
            resetMessage()
        } catch(error) {
            console.log(error)
        }
    }

    const updateLikes = async (blogId, newBlog) => {
        try {
            const savedBlog = await blogService.update(blogId, newBlog)
            setBlogs(blogs.map(blog => blog.id !== blogId ? blog : savedBlog))
        } catch(error) {
            console.log(error)
        }
    }

    const deleteBlog = async (blogId) => {
        try {
            await blogService.remove(blogId)
            setBlogs(blogs.filter(blog => blog.id !== blogId))
        } catch(error) {
            console.log(error)
        }
    }

    return (
        <div>
            <h2>{user === null ? 'log in to application' : 'blogs'}</h2>
            <Notification message={message} />
            <LoginForm login={handleLogin} logout={handleLogout} user={user}/>
            {user !== null &&
        <>
            <Togglable buttonLabel='new blog'>
                <BlogForm create={addBlog} />
            </Togglable>
            {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
                <Blog key={blog.id} blog={blog} like={updateLikes} del={deleteBlog}/>
            )}
        </>
            }

        </div>
    )
}

export default App
