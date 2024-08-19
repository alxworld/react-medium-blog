import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { SignupInput } from '@alexsamin/blogging-common'
import axios from 'axios'
import { BACKEND_POINT_URL } from '../config'

export const Auth = ({ type }: { type: 'signup' | 'signin' }) => {
  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: '',
    email: '',
    password: '',
  })
  const navigate = useNavigate()

  async function sendRequest() {
    console.log('Inside sendRequest with TYPE ' + type)
    console.log(postInputs)
    try {
      const response = await axios.post(`${BACKEND_POINT_URL}/api/v1/user/${type}`, postInputs)
      const token = response.data.jwt_token
      console.log(token)
      localStorage.setItem('token', token)
      navigate('/blogs')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="h-screen flex justify-center flex-col">
      {/* {JSON.stringify(postInputs)} */}
      <div className="flex justify-center m-12">
        <div className="max-w-lg">
          <div className="px-10">
            <div className="text-center text-2xl font-bold">Create an account</div>
            <div className="text-left text-sm font-light text-slate-400">
              {type === 'signup' ? 'Already have an account?' : 'Don’t have an account?'}
              <Link className="underline pl-2" to={type === 'signup' ? '/signin' : '/signup'}>
                {type === 'signup' ? 'Signin' : 'Signup'}
              </Link>
            </div>
          </div>
          <div className="pt-4">
            {type === 'signup' ? (
              <LabelInput
                label="Name"
                placeHolder="Alexander S"
                onChange={e => {
                  setPostInputs({ ...postInputs, name: e.target.value })
                }}
                type="text"
              />
            ) : null}

            <LabelInput
              label="Email"
              placeHolder="jsalex@gmail.com"
              onChange={e => {
                setPostInputs({ ...postInputs, email: e.target.value })
              }}
              type="text"
            />

            <LabelInput
              label="Password"
              placeHolder="********"
              onChange={e => {
                setPostInputs({ ...postInputs, password: e.target.value })
              }}
              type="password"
            />
          </div>
          <div className="pt-6">
            <button type="button" onClick={sendRequest} className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
              {type === 'signup' ? 'SignUp' : 'SignIn'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function LabelInput({ label, placeHolder, onChange, type }: { label: string; placeHolder: string; onChange: any; type: string }) {
  return (
    <div>
      <label className="block text-sm font-normal text-muted-foreground pt-2">{label}</label>
      <input onChange={onChange} type={type} id={label} className="block w-full appearance-none rounded-md border border-input bg-background px-2 py-2 placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-primary sm:text-sm" placeholder={placeHolder} required />
    </div>
  )
}
