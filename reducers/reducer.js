import * as actionTypes from '../actions/actionTypes';
import {AsyncStorage } from 'react-native';


const initialState = {

}


const reducer = (state = initialState, action) => {

   switch(action.type) {
           case actionTypes.EXAMPLE:
              return {
               ...state,
              }
            default:
              return state
        }
        return state
};

export default reducer;
