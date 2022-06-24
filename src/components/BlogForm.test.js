import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> updates state and calls on submit', async () => {
    const createBlog = jest.fn()
    const user = userEvent.setup()

    render(<BlogForm create={createBlog} />)
    const input = screen.getAllByRole('textbox')
    const submitBtn = screen.getByText('create')
    await user.type(input[0], 'blog of daniel')
    await user.type(input[1], 'daniel')
    await user.type(input[2], 'test url')
    await user.click(submitBtn)

    const expectedResult = {
        title: 'blog of daniel',
        author: 'daniel',
        url: 'test url'
    }

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toEqual(expectedResult)
})