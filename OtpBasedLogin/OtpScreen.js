
import React, { Component }  from 'react';
import {ActivityIndicator, Alert, ScrollView, StyleSheet, View,StatusBar, Text, TextInput, Picker, TouchableHighlight,TouchableOpacity, ImageBackground, Image,AsyncStorage,Keyboard,Linking,PermissionsAndroid,ToastAndroid,Dimensions} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Constants from 'expo-constants';
import { FontAwesome,MaterialCommunityIcons } from '@expo/vector-icons';
import settings from '../appSettings';
import * as Expo from 'expo';
import * as Permissions from 'expo-permissions';


const { width,height } = Dimensions.get('window');
const SERVER_URL = settings.url
const themeColor = settings.themeColor

class OtpScreen extends Component {
  static navigationOptions =  ({ navigation }) => {
  const { params = {} } = navigation.state
     return {
          header:null
    };
  }

  constructor(props) {
    super(props);
      this.state = {
        username:'',
        otp:[],
        needOTP:true,
        text:'',
        screen:'',
        mobileNo:'',
        checked:true,
        csrf:null,
        sessionid:null,
        loadingVisible:false,
        url:''
      }
      this.otpTextInput = []
}


componentDidMount(){
  var screen = this.props.navigation.getParam('screen',null)
  var username = this.props.navigation.getParam('username',null)
  var userPk = this.props.navigation.getParam('userPk',null)
  var token = this.props.navigation.getParam('token',null)
  var mobile = this.props.navigation.getParam('mobile',null)
  var csrf = this.props.navigation.getParam('csrf',null)
  var url = this.props.navigation.getParam('url',null)



  if(screen == 'LogInScreen'){
    this.setState({text:'Login',screen:'login',username:username,url:url})
  }else{
    this.setState({text:'Register',screen:'register',username:username,mobileNo:username,url:url})
    this.setState({userPk: userPk,token:token,mobile:mobile,mobileNo:username,csrf:csrf,url:url})
  }
}


renderVerify=()=>{
  return(
    <View style={{flexDirection: 'row',width:width,alignItems: 'center',justifyContent:'center',marginBottom:15,}}>
          <TouchableOpacity onPress={()=>this.verify()} style={{ flex:1,borderRadius:3,borderWidth:1,borderColor:themeColor,height:45,alignItems:'center',justifyContent:'center',marginHorizontal:20,backgroundColor:themeColor}}>
            <Text style={{color:'#fff',fontWeight:'700',fontSize:20,}}>Verify</Text>
          </TouchableOpacity>
      </View>
  )
}

renderHeader=()=>{
  return(
    <View style={{height:55,width:width,backgroundColor:themeColor,marginTop:Constants.statusBarHeight}}>
        <View style={{flexDirection: 'row',height:55,alignItems: 'center',}}>
           <View style={{ flex:1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',}}>
             <Text   style={{ color:'#fff',fontWeight:'600',fontSize:22,textAlign:'center',}} numberOfLines={1}>Enter OTP</Text>
           </View>
         </View>
     </View>
  )
}


resend(){
this.showToast('request sent!')
if(this.state.screen == 'login'){
 var data = new FormData();
 data.append("id", this.state.username);
 fetch(this.state.url + '/generateOTP/', {
   method: 'POST',
   body: data
 })
   .then((response) => {
     if (response.status == 200) {
       this.setState({ username: this.state.username })
       this.setState({ needOTP: true })
       return true
     }else{
       return false
     }
   })
   .then((responseJson) => {
     if (!responseJson){
       this.showToast('No user found , Please register')
     }else{
       return
     }
   })
   .catch((error) => {
     this.showToast(error.toString())
     return
   });
}else{
   var data = new FormData();
   data.append( "mobile", this.state.mobileNo );
   fetch( SERVER_URL + '/api/homepage/registration/?mobile='+this.state.mobileNo, {
     method: 'GET',
   })
   .then((response) =>{
     if(response.status == 200 || response.status==201 ){
       var d = response.json()
       this.setState({ needOTP: true })
       return d
     }else{
       this.showToast('Mobile No Already register with user')
     }
   })
   .then((responseJson) => {
      this.setState({ userPk: responseJson.pk,token:responseJson.token,mobile:responseJson.mobile,username:this.state.mobileNo })
    })
   .catch((error) => {
     return
   });
}
}

showToast=(msg)=>{
  ToastAndroid.showWithGravityAndOffset(msg,ToastAndroid.LONG,ToastAndroid.BOTTOM,25,50);
}


verify() {
  var otp = this.state.otp.join('')

  if(otp.length < 4){
     this.showToast('Enter 4 digits OTP')
     return
  }
 this.setState({loadingVisible:true})
  if(this.state.screen == 'login'){
   var data = new FormData();
   data.append("username", this.state.username);
   data.append("otp", otp);
   fetch(this.state.url + '/login/?otpMode=True&mode=api', {
     method: 'POST',
     body: data,
     headers: {
     }
   }).then((response) => {
     this.setState({loadingVisible:false})
     if (response.status == 200) {
       var sessionid = response.headers.get('set-cookie').split('sessionid=')[1].split(';')[0]
       this.setState({ sessionid: sessionid })
       AsyncStorage.setItem("sessionid", sessionid)
       return response.json()
     }
     else {
       return undefined
     }
   }).then((responseJson) => {
     var csrf = responseJson.csrf_token
     var url = this.state.url
     AsyncStorage.setItem("csrf", responseJson.csrf_token)
     AsyncStorage.setItem("userpk", JSON.stringify(responseJson.pk))
     AsyncStorage.setItem("login", JSON.stringify(true)).then(res => {
          return  this.props.navigation.navigate ('DefaultScreen')
     });
    return
   })
   .catch((error) => {
     this.setState({loader:false})
     this.showToast('Incorrect OTP')
    });
 }else{
   if(this.state.otp == undefined){
     this.showToast('OTP was incorrect..')
     return
   }else{
     if(this.state.otp.length < 4){
       this.setState({otp:this.state.clipboard})
     }
     var data = new FormData();
     data.append( "token", this.state.token );
     data.append( "mobileOTP", this.state.otp );
     data.append( "mobile", this.state.username );
     data.append( "email", null );
     data.append( "is_staff", 'False');
     data.append( "password", this.state.username );
     data.append( "firstName", this.state.username );
     data.append( "csrf", this.state.csrf );
     fetch( SERVER_URL +'/api/homepage/registration/'+ this.state.userPk+'/', {
       method: 'PATCH',
       body: data
     })
     .then((response) =>{
       this.setState({loadingVisible:false})
       if(response.status == '200' || response.status == '201'){
         var sessionid = response.headers.get('set-cookie').split('sessionid=')[1].split(';')[0]
         AsyncStorage.setItem("sessionid", sessionid)
         this.setState({sessionid:sessionid})
         return response.json()
       }
     })
     .then((responseJson) => {
       AsyncStorage.setItem("csrf", responseJson.csrf)
       var result = responseJson
       AsyncStorage.setItem("user_name", JSON.stringify(this.state.username))
       AsyncStorage.setItem("userpk", JSON.stringify(result.pk))
       AsyncStorage.setItem("login", JSON.stringify(true)).then(res => {
         this.props.navigation.navigate('Home', {'login':true}, NavigationActions.navigate({ routeName: 'Home' }))
       });
       })
     .catch((error) => {
       return
     });
  }
 }
}

  focusPrevious=(key, index)=>{
       if (key === 'Backspace' && index !== 0)
           this.otpTextInput[index - 1].focus();
   }

   focusNext=(index, value)=>{
      if (index < this.otpTextInput.length - 1 && value) {
          this.otpTextInput[index + 1].focus();
      }
      if (index === this.otpTextInput.length - 1) {
          this.otpTextInput[index].blur();
      }
      const otp = this.state.otp;
      otp[index] = value;
      this.setState({ otp });
  }

  renderInputs=()=>{
        const inputs = Array(4).fill(0);
        const txt = inputs.map(
            (i, j) => <View key={j} style={{paddingHorizontal:10}}>
                <TextInput
                    style={[styles.shadow, { height:40,width:40,borderWidth:0,backgroundColor:'#fff',borderRadius: 0,paddingHorizontal:15,color:'#000' }]}
                    keyboardType="numeric"
                    selectionColor={'#ffffff'}
                    maxLength={1}
                    onChangeText={v => this.focusNext(j, v)}
                    onKeyPress={e => this.focusPrevious(e.nativeEvent.key, j)}
                    ref={input => { this.otpTextInput[j] = input}}
                />
            </View>
        );
        return txt;
    }

  render(){
     const {navigate} = this.props.navigation;
     if(!this.state.loader){
     return (
        <View style={{flex:1,backgroundColor:'#e2e2e2'}}>

          {this.renderHeader()}

           <View style={{flex:1,zIndex:2,}}>
               <View style={{flex:1}}>

               <View  style={{flex:0.5,justifyContent:'flex-end',backgroundColor:'#e2e2e2',borderWidth:0,alignItems:'center'}}>
                 <Image source={require('../assets/man.png')} style={{resizeMode:'contain'}} />
               </View>

                 <View style={{flex:0.4,zIndex:2,alignItems:'center',justifyContent:'center'}}>

                     <View style={{marginHorizontal:30,width:width-60,marginVertical:15,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                      {this.renderInputs()}
                    </View>

                    <View style={{flexDirection:'row',marginTop:15}}>
                      <Text style={{fontSize: 14,color:'#000',}}> {`Did't receive any code?`}</Text>
                      <TouchableOpacity style={{marginLeft:10}} onPress={()=>{this.resend()}}>
                        <Text style={{fontSize:16,fontWeight:'700',color:'#000',textDecorationLine: 'underline'}}>RESEND</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={()=>{this.verify()}} style={{backgroundColor:themeColor,borderRadius:20,height:50,width:50,alignItems:'center',justifyContent:'center',marginVertical:15,borderRadius:25}}>
                       <MaterialCommunityIcons name="arrow-right" size={24} color="#fff" />
                    </TouchableOpacity>
                 </View>
              </View>
           </View>
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

export default OtpScreen
