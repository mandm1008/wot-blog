import { useEffect, useReducer } from 'react'
import { useRouter } from 'next/router'
import Context from './Context'
import reducer, { initialState } from './reducer'
import { setUser } from './actions'
import { UserServer } from '~/servers'

function Provider({ children }: { children: JSX.Element }) {
  const router = useRouter()
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    fetcher()

    function fetcher() {
      UserServer.get()
        .then((data) => {
          if (!data.error && typeof data !== 'string' && typeof data === 'object') {
            const { accessToken, ...user } = data
            localStorage.setItem('accountToken', accessToken || '')
            dispatch(setUser(user))
          } else {
            dispatch(setUser(null))
            console.log(data.error)
          }
        })
        .catch((e) => {
          console.log(e)
          dispatch(setUser(null))
        })
    }
  }, [router])

  return <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
}

export default Provider
