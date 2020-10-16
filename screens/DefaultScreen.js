
import React, { Component }  from 'react';
import {ActivityIndicator, Alert, ScrollView, StyleSheet, View,StatusBar,TouchableWithoutFeedback, Text, TextInput, Picker, TouchableHighlight,TouchableOpacity, ImageBackground, Image,AsyncStorage,Keyboard,Linking,PermissionsAndroid,ToastAndroid,Dimensions} from 'react-native';
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
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';


const { width,height } = Dimensions.get('window');
const SERVER_URL = settings.url
const themeColor = settings.themeColor

class DefaultScreen extends React.Component{
  constructor(props) {
    super(props);
      this.state = {
        loader:false,
        firstTime:false
      }
}
    check=async()=>{
      const firstTime = await AsyncStorage.getItem('firstTime');
      console.log(JSON.parse(firstTime),'JSON.parse(firstTime)JSON.parse(firstTime)');
      if(JSON.parse(firstTime)==null){
        this.setState({firstTime:true})
        AsyncStorage.setItem('firstTime',JSON.stringify(false));
      }else{
        this.getUserDetails()
      }
    }
    componentDidMount=()=>{
      this.check()
    }

     getUserDetails=async()=>{
       this.setState({firstTime:false})
       console.log('cameeeeee');
       const login = await AsyncStorage.getItem("login")

       if(JSON.parse(login)){
         var data = await HttpsClient.get(SERVER_URL + '/api/HR/users/?mode=mySelf&format=json')
         if(data.type=='success'&&data.data.length>0){
             this.props.setUserDetails(data.data[0])
             AsyncStorage.setItem('mobile',JSON.stringify(data.data[0].profile.mobile));
             this.props.navigation.navigate('Attendance')
             return
         }else{
             this.props.navigation.navigate('Login')
         }
       }
       else{
         this.props.navigation.navigate('Login')
       }
     }
   handleViewRef = ref => this.view = ref;
   slideOutUp = () => this.view.slideOutUp().then(()=>this.getUserDetails())

    render(){
        return(
          <View style={{flex:1,backgroundColor:"#e2e2e2",}}>
              {this.state.firstTime&&
                <View style={{flex:1,}}>
                <TouchableWithoutFeedback onPress={this.slideOutUp} style={{flex:1}}>
                  <Animatable.View ref={this.handleViewRef} style={{flex:1,}}>
                    <LinearGradient colors={['rgba(13,94,224,0.5)', 'rgba(6,56,138,1)']} style={{position:'absolute',top:0,right:0,left:0,bottom:0,}}>
                        <Text style={{color:'#fff',fontSize:40,marginTop:height*0.4,textAlign:'center'}}>mAbler</Text>
                    </LinearGradient>
                  </Animatable.View>
                </TouchableWithoutFeedback>
                </View>
              }
              {!this.state.firstTime&&
                <View style={{flex:1,backgroundColor:"#e2e2e2",justifyContent:'center',alignItems:'center'}}>
                  <ActivityIndicator size={'large'} color={themeColor} />
                </View>
              }
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
