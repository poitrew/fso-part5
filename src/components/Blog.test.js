import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('render blog with blog\'s title', () => {
    const testBlog = {
        user: {
            name: 'tester',
        },
        title: 'test title',
        author: 'test author',
        url: 'test url',
        likes: 10
    }

    const mockHandler = jest.fn()

    const { container } = render(<Blog blog={testBlog} like={mockHandler} del={mockHandler} />)
    const element = screen.getByText('test title')
    const hiddenDiv = container.querySelector('blog-detail')
    expect(element).toBeDefined()
    expect(hiddenDiv).toBe(null)
})