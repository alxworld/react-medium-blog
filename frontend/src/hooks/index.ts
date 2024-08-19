import { useEffect, useState } from 'react'
import axios from 'axios'
import { BACKEND_POINT_URL } from '../config'

export interface Blog {
  id: string
  title: string
  content: string
  author: { name: string }
}

export const useBlog = ({ id }: { id: string }) => {
  const [blog, setBlog] = useState<Blog>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get(`${BACKEND_POINT_URL}/api/v1/blog/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(response => {
        setBlog(response.data.blog)
        setLoading(false)
      })
  }, [id])
  return { loading, blog }
}

export const useBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await axios.get(`${BACKEND_POINT_URL}/api/v1/blog/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        setBlogs(response.data.blogs)
        setLoading(false)
      } catch (error) {
        console.error(error)
      }
    }

    fetchBlogs()
  }, [])

  return { loading, blogs }
}
