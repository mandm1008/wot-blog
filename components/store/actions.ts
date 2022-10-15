import { SET_USER, SET_LAYOUT } from './type'

export type Type = { type: string; payload: any }

export const setUser = (payload: any) =>
  ({
    type: SET_USER,
    payload
  } as Type)

export const setLayout = (payload: any) =>
  ({
    type: SET_LAYOUT,
    payload
  } as Type)
