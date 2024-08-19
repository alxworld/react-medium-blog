import { Link } from 'react-router-dom'
import { AvatarIcon } from './BlogCard'

export const Appbar = () => {
  return (
    <div className="flex justify-between border-b px-10  pt-2">
      <div>
        <Link to={'/blogs'}>Medium</Link>
      </div>
      <div>
        <div className="flex">
          <AvatarIcon name="Alexander S" />
          <Link to={'/publish'}>
            <button className="flex flex-col justify-center text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2 text-center me-1.5 mb-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
              New Blog
            </button>
          </Link>
          <Link to={'/signin'}>
            <div className="flex flex-col justify-center font-normal pl-4 cursor-pointer">Logout</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
