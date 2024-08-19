import { Link } from 'react-router-dom'

interface BlogCardProps {
  authorName: string
  publishedDate: string
  title: string
  content: string
  id: string
}

export const BlogCard = ({ id, authorName, publishedDate, title, content }: BlogCardProps) => {
  return (
    <Link to={`/blog/${id}`}>
      <div>
        <div className="flex">
          <div className="flex flex-col justify-center">
            <AvatarIcon name={authorName} />
          </div>
          <div className="flex flex-col justify-center font-normal pl-2">{authorName}</div>
          <div className="flex flex-col justify-center font-extralight pl-2">{publishedDate}</div>
        </div>
        <div className="justify-center text-xl font-bold pb-2">{title}</div>
        <div className="justify-center text-md font-normal pb-2">{content.slice(0, 100)}...</div>
        <div className="justify-center text-sm font-light pb-4"> {`${Math.ceil(content.length / 100)} min read`} </div>
        <div className="bg-slate-200 h-1 w-full"></div>
      </div>
    </Link>
  )
}

export function AvatarIcon({ name }: { name: string }) {
  return (
    <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
      <span className="font-medium text-gray-600 dark:text-gray-300">{name[0]}</span>
    </div>
  )
}
