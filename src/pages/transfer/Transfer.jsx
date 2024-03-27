import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import Searchinput from '../../component/elements/Search'
import UserLists from '../../component/elements/UserLists'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../component/parts/card'
import Layout from '../../component/templates/layout'
import { setProfileDetails } from '../../store/reducer/profile'
import useApi from '../../utils/useApi'

// for development only

const values = {
  users:
    '{"isAuth":true,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsInVzZXJuYW1lIjoidXNlcjEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MTE0OTUxODksImV4cCI6MTcxMTQ5ODc4OX0.CVEZTK4ee8OzmnKCdMrCDPXP4tz7o2t2XY137Hiiy3o"}',
  _persist: '{"version":-1,"rehydrated":true}',
}

function Transfer() {
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])

  const api = useApi()
  const dispatch = useDispatch()

  const handleInputChange = (e) => {
    const { name, value } = e.target

    setSearch(value)
  }
  // for development only
  useEffect(() => {
    localStorage.setItem('persist:root', values)
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await api
          .get(`/user`)
          .then(({ data }) => {
            const userProfile = data.data[0]
            const { id, email, username, balance, image, phone, pin } =
              userProfile

            dispatch(
              setProfileDetails({
                id,
                email,
                username,
                balance,
                image,
                phone,
                pin,
              })
            )
          })
          .catch((err) => {
            console.log(err)
          })
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    fetchUser()
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const response = await api.get('/user/all', {
          params: {
            search: search,
          },
        })
        setUsers(response.data.data)
      } catch (error) {
        console.log(error)
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [search])

  if (loading) {
    return <div>Loading...</div>
  }
  return (
    <>
      <Layout>
        <Card className='bg-white border-none drop-shadow-md'>
          <CardHeader className='gap-6 p-[30px]'>
            <CardTitle className='text-lg font-bold'>Search Receiver</CardTitle>
            <Searchinput onInputChange={handleInputChange} name='Search' />
          </CardHeader>
          <CardContent className='flex flex-col gap-5 px-[30px pb-5'>
            {users.length === 0 ? (
              <div className='flex items-center mt-4'>
                <svg
                  className='w-10 h-10 me-3 text-gray-200 dark:text-gray-700'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 20 20'>
                  <path d='M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z' />
                </svg>
                <div>
                  <div className='h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2'></div>
                  <div className='w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700'></div>
                </div>
              </div>
            ) : (
              users.map((item) => (
                <Link key={item.id} to={`/transfers/${item.id}/send`}>
                  <UserLists data={item} isLoading={loading} />
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </Layout>
    </>
  )
}

export default Transfer
