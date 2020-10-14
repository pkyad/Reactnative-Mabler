import * as actionTypes from '../actions/actionTypes'

export const setUserDetails = (userDetails)=>({
  type: actionTypes.SET_USER_DETAILS,
  payload:userDetails
})
export const setAttendance = (attendance)=>({
  type: actionTypes.SET_ATTENDANCE,
  payload:attendance
})
