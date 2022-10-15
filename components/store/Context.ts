import { createContext } from 'react'
import { Type } from './actions'
import { initState, initialState } from './reducer'

const data: [state: initState, dispatch: React.Dispatch<Type>] = [initialState, () => {}]

const context = createContext(data)

export default context
