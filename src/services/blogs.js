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
  console.log(token)
  const requestConfig = {
    headers: {
      Authorization: token,
    }
  }
  const response = await axios.post(baseUrl, newBlog, requestConfig)
  return response.data
}

export default { getAll, setToken, create }