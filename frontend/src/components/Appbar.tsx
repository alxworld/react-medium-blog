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
            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
              New Blog
            </button>
          </Link>

          <div className="flex flex-col justify-center font-normal pl-2">Signup</div>
        </div>
      </div>
    </div>
  )
}
