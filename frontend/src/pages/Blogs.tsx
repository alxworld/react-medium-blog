import { BlogCard } from '../components/BlogCard'
import { Appbar } from '../components/Appbar'
import { useBlogs } from '../hooks'

export const Blogs = () => {
  const { loading, blogs } = useBlogs()

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Appbar />
      <div className="flex justify-center cursor-pointer">
        <div className="max-w-xl">
          {blogs.map(blog => (
            <BlogCard key={blog.id} id={blog.id} authorName={blog.author.name || 'Author'} publishedDate="9th Sep 2009" title={blog.title} content={blog.content} />
          ))}
        </div>
      </div>
    </div>
  )
}
