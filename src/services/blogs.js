import axios from 'axios'
const baseUrl = '/api/blogs'

let token

const setToken = newToken => {
    token = `Bearer ${newToken}`
}

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const create = async newBlog => {
    const requestConfig = {
        headers: {
            Authorization: token,
        }
    }
    const response = await axios.post(baseUrl, newBlog, requestConfig)
    return response.data
}

const remove = async blogId => {
    const requestConfig = {
        headers: {
            Authorization: token,
        }
    }
    await axios.delete(`${baseUrl}/${blogId}`, requestConfig)
}

const update = async (blogId, newBlog) => {
    const requestConfig = {
        headers: {
            Authorization: token,
        }
    }
    const response = await axios.put(`${baseUrl}/${blogId}`, newBlog, requestConfig)
    return response.data
}

export default { getAll, setToken, create, update, remove }