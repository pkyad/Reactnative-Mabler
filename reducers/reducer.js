import * as actionTypes from '../actions/actionTypes';
import {AsyncStorage } from 'react-native';


const initialState = {
   user:null,
   attendance:null
}


const reducer = (state = initialState, action) => {

   switch(action.type) {
            case actionTypes.SET_USER_DETAILS:
              return {
               ...state,
               user: action.payload,
              }
            case actionTypes.SET_ATTENDANCE:
              return {
               ...state,
               attendance: action.payload,
              }
            default:
              return state
        }
        return state
};

export default reducer;
