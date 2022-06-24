import { useState } from 'react'

const BlogForm = ({ create }) => {
    const [newBlog, setNewBlog] = useState({
        title: '',
        author: '',
        url: '',
    })

    const handleChange = (event) => {
        setNewBlog(prevState => ({
            ...prevState,
            [event.target.name]: event.target.value
        }))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        create(newBlog)
        setNewBlog({
            title: '',
            author: '',
            url: '',
        })
    }

    return (
        <>
            <h2>Create new</h2>
            <form onSubmit={handleSubmit}>
                <label>
                title
                    <input
                        type='text'
                        name='title'
                        placeholder={'blog\'s title'}
                        value={newBlog.title}
                        onChange={handleChange}>
                    </input>
                </label>
                <br />
                <label>
                author
                    <input
                        type='text'
                        name='author'
                        value={newBlog.author}
                        onChange={handleChange}>
                    </input>
                </label>
                <br />
                <label>
                url
                    <input
                        type='text'
                        name='url'
                        value={newBlog.url}
                        onChange={handleChange}>
                    </input>
                </label>
                <br />
                <button type='submit'>create</button>
            </form>
        </>
    )
}

export default BlogForm