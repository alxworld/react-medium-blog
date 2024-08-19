import { Appbar } from '../components/Appbar'
import { useBlog } from '../hooks'
import { useParams } from 'react-router-dom'
import { FullBlogBody } from '../components/FullBlogBody'

export const Blog = () => {
  const { id } = useParams()
  console.log('Blog Id =>', id)
  const { loading, blog } = useBlog({ id: id || '' })

  console.log('Blog =>', blog)

  if (loading || !blog) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Appbar />
      <FullBlogBody blog={blog} />
    </div>
  )
}
