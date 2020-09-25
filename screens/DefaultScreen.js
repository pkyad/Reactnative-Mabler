
import React, { Component }  from 'react';
import {ActivityIndicator, Alert, ScrollView, StyleSheet, View,StatusBar, Text, TextInput, Picker, TouchableHighlight,TouchableOpacity, ImageBackground, Image,AsyncStorage,Keyboard,Linking,PermissionsAndroid,ToastAndroid,Dimensions} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Constants from 'expo-constants';
import { FontAwesome,MaterialCommunityIcons } from '@expo/vector-icons';
import settings from '../appSettings';
import * as Expo from 'expo';
import * as Permissions from 'expo-permissions';
import moment from 'moment';
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import * as actionTypes from '../actions/actionTypes';
import HttpsClient from '../helpers/HttpsClient';


const { width,height } = Dimensions.get('window');
const SERVER_URL = settings.url
const themeColor = settings.themeColor

class DefaultScreen extends React.Component{


    componentDidMount=()=>{
      this.getUserDetails()
    }

     getUserDetails=async()=>{
       console.log('cameeeeee');
       const login = await AsyncStorage.getItem("login")

       if(JSON.parse(login)){
         var data = await HttpsClient.get(SERVER_URL + '/api/HR/users/?mode=mySelf&format=json')
         if(data.type=='success'&&data.data.length>0){
             this.props.setUserDetails(data.data[0])
             AsyncStorage.setItem('mobile',JSON.stringify(data.data[0].profile.mobile));
             this.props.navigation.navigate('Main')
             return
         }else{
             this.props.navigation.navigate('Login')
         }
       }
       else{
         this.props.navigation.navigate('Login')
       }
     }


    render(){
        return(
          <View style={{flex:1,backgroundColor:"#e2e2e2",justifyContent:'center',alignItems:'center'}}>
              <ActivityIndicator size={'large'} color={themeColor} />
          </View>
      );
    }
  }

  const mapStateToProps =(state) => {
    return {
      user:state.reducer.user,
    }
  }

  const mapDispatchToProps = (dispatch) => {
    return {
        setUserDetails:  (args) => dispatch(actions.setUserDetails(args)),
    };
  }

  export default connect(mapStateToProps, mapDispatchToProps)(DefaultScreen);


  //   const userToken = await AsyncStorage.getItem('userpk');
  //   const sessionid = await AsyncStorage.getItem('sessionid');
  //   const csrf = await AsyncStorage.getItem('csrf');
  //   if(csrf!=null){
  //     fetch(SERVER_URL + '/api/HR/users/?mode=mySelf&format=json', {
  //       headers: {
  //         "Cookie" :"csrftoken="+csrf+";sessionid=" + sessionid +";",
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json',
  //         'Referer': URL,
  //         'X-CSRFToken': csrf
  //       },
  //       method: 'GET'
  //     })
  //     .then((response) =>{
  //       if (response.status !== 200) {
  //         return;
  //       }
  //       else if(response.status == 200){
  //         return response.json()
  //       }
  //     })
  //     .then((responseJson) => {
  //       responseJson[0].serverUrl = URL
  //       this.props.setUserDetails(responseJson[0])
  //       AsyncStorage.setItem('mobile',JSON.stringify(responseJson[0].profile.mobile));
  //       this.props.navigation.navigate('Home')
  //       return
  //     })
  //     .catch((error) => {
  //       this.props.navigation.navigate('Login')
  //     });
  //   }else{
  //     this.props.navigation.navigate('Login')
  //   }
  // }else{
  //   this.props.navigation.navigate('Login')
  // }
