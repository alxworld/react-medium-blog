import { Blog } from '../hooks'
import { AvatarIcon } from './BlogCard'

export const FullBlogBody = ({ blog }: { blog: Blog }) => {
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-12 px-24 pt-10 w-full">
        <div className="col-span-8">
          <div className="text-4xl font-bold pb-2">{blog.title}</div>
          <div className="text-slate-500">Posted on 2nd Sep 2020</div>
          <div className="py-6">{blog.content}</div>
        </div>
        <div className="col-span-4">
          <div>
            <div className="text-slate-500 text-xl">Author</div>
          </div>
          <div className="flex">
            <div className="flex flex-col justify-center p-4">
              <AvatarIcon name={blog.author.name || 'Anonymous'} />
            </div>
            <div>
              <div className="text-2xl font-bold">{blog.author.name || 'Anonymous'}</div>
              <div className="text-sm">Random text about the author that makes his work known to the world.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
