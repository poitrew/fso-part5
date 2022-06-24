import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

let container
const mockHandler = jest.fn()

beforeEach(() => {
    const testBlog = {
        user: {
            name: 'tester',
        },
        title: 'test title',
        author: 'test author',
        url: 'test url',
        likes: 10
    }

    container = render(<Blog blog={testBlog} like={mockHandler} />).container
})

test('render blog with blog\'s title', () => {
    const element = screen.getByText('test title test author')
    const hiddenDiv = container.querySelector('blog-detail')
    expect(element).toBeDefined()
    expect(hiddenDiv).toBe(null)
})

test('blog\'s url and likes count are shown after clicking the button', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.blog-detail')
    expect(div).toHaveTextContent('test urllikes 10')
})

test('blog\'s like button clicked twice trigger event handler twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const likeBtn = screen.getByText('like')
    await user.dblClick(likeBtn)

    expect(mockHandler.mock.calls).toHaveLength(2)
})