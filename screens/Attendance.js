
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

class Attendance extends Component {
  static navigationOptions =  ({ navigation }) => {
  const { params = {} } = navigation.state
     return {
          header:null
    };
  }

  constructor(props) {
    super(props);
      this.state = {
        user:props.user,
        loader:false
      }
}


componentDidMount(){
    this.getAttendanceDetails()
}

getAttendanceDetails=async()=>{
    this.setState({loader:true})
    var data = await HttpsClient.get(SERVER_URL + '/api/ERP/attendance/?today=true&user='+this.state.user.pk)
    if(data.type=='success'){
        if(data.data!=null&&data.data.length>0){
          this.props.setAttendance(data.data[0])
          this.props.navigation.navigate('Main')
          return
        }else{
          this.setState({loader:false})
        }
    }else{
      this.setState({loader:false})
    }
}

postAttendance = async()=>{
  var sendData = {
    user:this.state.user.pk,
    date:moment(new Date()).format('YYYY-MM-DD'),
    company:this.state.user.profile.empCompany,
  }

  var data = await HttpsClient.post(SERVER_URL + '/api/ERP/attendance/',sendData)
  if(data.type=='success'){
    this.props.setAttendance(data.data)
    this.props.navigation.navigate('Main')
  }else{
    return
  }
}

renderHeader=()=>{
  return(
    <View style={{height:55,width:width,backgroundColor:themeColor,marginTop:Constants.statusBarHeight}}>
        <View style={{flexDirection: 'row',height:55,alignItems: 'center',}}>
           <View style={{ flex:1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',}}>
             <Text   style={{ color:'#fff',fontWeight:'600',fontSize:22,textAlign:'center',}} numberOfLines={1}>Attendance</Text>
           </View>
         </View>
     </View>
  )
}

showToast=(msg)=>{
  ToastAndroid.showWithGravityAndOffset(msg,ToastAndroid.LONG,ToastAndroid.BOTTOM,25,50);
}

  render(){
     const {navigate} = this.props.navigation;
     if(!this.state.loader){
     return (
        <View style={{flex:1,backgroundColor:'#e2e2e2'}}>

        {this.state.loader&&
          <View style={{flex:1,backgroundColor:"#e2e2e2",justifyContent:'center',alignItems:'center'}}>
            <ActivityIndicator size={'large'} color={themeColor} />
         </View>
      }
         {!this.state.loader&&

           <View style={{flex:1,zIndex:2,}}>
            {this.renderHeader()}
               <View style={{flex:1}}>

               <View  style={{flex:0.5,justifyContent:'flex-end',backgroundColor:'#e2e2e2',borderWidth:0,alignItems:'center'}}>
                 <Image source={require('../assets/man1.png')} style={{resizeMode:'contain'}} />
               </View>

                 <View style={{flex:0.4,zIndex:2,alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontSize:20,color:'#000',fontWeight:'600'}}>MARK MY ATTENDANCE</Text>
                    <Text style={{fontSize:18,color:'#000',fontWeight:'600',marginVertical:5}}>{moment(moment.utc(new Date()).toDate()).local().format('DD - MMMM - YYYY')}</Text>
                    <Text style={{fontSize:18,color:'#000',fontWeight:'600',marginVertical:5}}>{moment(moment.utc(new Date()).toDate()).local().format('dddd')}</Text>
                    <View style={{flexDirection:'row'}}>
                      <TouchableOpacity onPress={()=>{this.postAttendance()}} style={{marginRight:10,backgroundColor:themeColor,borderRadius:20,paddingVertical:8,paddingHorizontal:20,marginVertical:15}}>
                        <Text style={{fontSize:16,color:'#fff',fontWeight:'600'}}>Yes</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Main')}} style={{marginLeft:10,backgroundColor:themeColor,borderRadius:20,paddingVertical:8,paddingHorizontal:20,marginVertical:15}}>
                        <Text style={{fontSize:16,color:'#fff',fontWeight:'600'}}>No</Text>
                      </TouchableOpacity>
                    </View>

                 </View>

              </View>
           </View>
         }
        </View>
    );
  }else{
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
         <ActivityIndicator size="large" color={themeColor} />
      </View>
    )
  }
}
}


const styles = StyleSheet.create({
  submit:{
      marginRight:40,
      marginLeft:40,
      marginTop:10,
      paddingTop:10,
      paddingBottom:10,
      borderRadius:50,
  },
  shadow:{
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0,
    shadowRadius: 3.84,
    elevation: 3,
  },
  imgBackground: {
          width: '100%',
          height: '100%',
          flex: 1
  },
});

const mapStateToProps =(state) => {
    return {
      user:state.reducer.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
     setAttendance:  (args) => dispatch(actions.setAttendance(args)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Attendance)
