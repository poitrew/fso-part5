import { useState } from 'react'

const Blog = ({ blog, like, del }) => {
    const [blogDetailVisibility, setBlogDetailVisibility] = useState(false)

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const handleLike = () => {
        const newBlog = {
            user: blog.user.id,
            likes: blog.likes + 1,
            author: blog.author,
            title: blog.title,
            url: blog.url
        }
        like(blog.id, newBlog)
    }

    const handleRemove = () => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
            del(blog.id)
        }
    }

    const toggleBlogDetailVisibility = () => setBlogDetailVisibility(!blogDetailVisibility)

    return (
        <div>
            <div style={blogStyle}>
                {blog.title} <button onClick={toggleBlogDetailVisibility}>{blogDetailVisibility ? 'hide' : 'view'}</button>
            </div>
            {blogDetailVisibility &&
                <div style={blogStyle} className='blog-detail'>
                    {blog.author}<br />
                    {blog.url}<br />
                    likes {blog.likes} <button onClick={handleLike}>like</button><br />
                    {blog.user.name}<br />
                    <button style={{ background: 'lightblue', cursor: 'pointer' }}onClick={handleRemove}>remove</button>
                </div>
            }
        </div>
    )
}

export default Blog