import * as actionTypes from '../actions/actionTypes'

export const setUserDetails = (userDetails)=>({
  type: actionTypes.SET_USER_DETAILS,
  payload:userDetails
})
