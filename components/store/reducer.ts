import { SET_USER, SET_LAYOUT } from './type'
import { Type } from './actions'

export type initState = {
  user: Models.User | null
  layout: 1 | 2 | 3
}

const initialState: initState = {
  user: null,
  layout: 3 // pc : 3 | tablet: 2 | mobile : 1
}

function reducer(state: initState, action: Type) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload
      }
    case SET_LAYOUT:
      return {
        ...state,
        layout: action.payload
      }
    default:
      return state
  }
}

export { initialState }
export default reducer
