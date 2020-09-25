import React, { Component }  from 'react';
import { Alert, ScrollView, StyleSheet, View, Text, TextInput, Picker, TouchableHighlight,TouchableOpacity, ImageBackground, Image,AsyncStorage,Keyboard,Linking,PermissionsAndroid,ToastAndroid,Dimensions} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Constants from 'expo-constants';
import { FontAwesome } from '@expo/vector-icons';
import * as Expo from 'expo';
import * as Permissions from 'expo-permissions';
import { StackActions, NavigationActions } from 'react-navigation';
import settings from '../appSettings';
import HttpsClient from '../helpers/HttpsClient';

const url = settings.url
const themeColor = settings.themeColor
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default  class OtpLogin extends Component {
    static navigationOptions = ({ navigation }) => {
      const { params = {} } = navigation.state
      return {header:null}
    };

    constructor(props) {
      super(props);
      this.state = {
          needOTP : false,
          username:'',
          sessionid:'',
          name:'',
          token:'',
          loginname:'',
          password:'',
          url:'',
          keyboardOpen:false,
          keyboardOffset:0,
      }
      Keyboard.addListener('keyboardDidHide',this.keyboardDidHide)
      Keyboard.addListener( 'keyboardDidShow', this.keyboardDidShow)
    }

    showKeyboard =()=>{
        this.setState({keyboardOpen : false})
        this.setState({scrollHeight:this.state.scrollHeight+500})
        setTimeout(()=> {
          if (this.refs == undefined || this.refs._scrollView == undefined || this.refs._scrollView.scrollToEnd == undefined) {
            return
          }
          this.refs._scrollView.scrollToEnd({animated: true});
        }, 500);
    }

    hideKeyboard =(e)=>{
        this.setState({keyboardOpen : true})
        this.setState({keyboardHeight:e.endCoordinates.height+30});
        try {
          this.setState({scrollHeight:this.state.scrollHeight-500})
        } catch (e) {} finally {}
        setTimeout(()=> {
          if (this.refs == undefined || this.refs._scrollView == undefined || this.refs._scrollView.scrollToEnd == undefined) {
            return
          }
          this.refs._scrollView.scrollToEnd({animated: true});
          }, 500);
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    getOtp=async()=> {
       if(this.state.mobileNo == undefined){
         this.refs.toast.show('Mobile no was incorrect ');
       }
       else{
         var data = new FormData();
         data.append( "mobile", this.state.mobileNo );
         var sendData = {
           mobile:this.state.mobileNo
         }
         console.log(url + '/api/homepage/registration/');
         fetch( url + '/api/homepage/registration/?mobile='+this.state.mobileNo, {
           method: 'GET',
         }).then((response)=>{
           if(response.status == 200 || response.status==201 ){
             var d = response.json()
             return d
           }else{
             this.refs.toast.show('Mobile No Already register with user ');
           }
         })
         .then((responseJson) => {
            this.setState({ userPk: responseJson.pk,token:responseJson.token,mobile:responseJson.mobile,username:this.state.mobile });
            AsyncStorage.setItem("userpk", responseJson.pk + '')
            this.props.navigation.navigate('OtpScreen',{
              username:this.state.mobileNo,
              screen:'',
              userPk:responseJson.pk,
              token:responseJson.token,
              mobile:responseJson.mobileNo,
              csrf:responseJson.csrf,
              url:this.state.url,
              mobileOTP:'',
            });
          })
         .catch((error) => {
           return
         });
       }
   }

  showToast=(msg)=>{
    ToastAndroid.showWithGravityAndOffset(msg,ToastAndroid.LONG,ToastAndroid.BOTTOM,25,50);
  }

  sendOtp=async()=>{
      var mob = /^[1-9]{1}[0-9]{9}$/;
      if (this.state.mobileNo == undefined || mob.test(this.state.mobileNo) == false) {
         this.showToast('Enter Correct Mobile Number')
      }else {

         var data = await HttpsClient.get(url+'/generateOTP/?mobile='+this.state.mobileNo)
         if(data.type=='success'){
             this.showToast('OTP request sent')
             this.props.navigation.navigate('OtpScreen',{screen:'LogInScreen',url:url,username:this.state.mobileNo,});
             return
         }else{
             this.showToast('Mobile is not registered.')
             // this.getOtp()
             // var register = await HttpsClient.post(url+'/api/homepage/registration/',{mobile:this.state.mobileNo,bodyType:'formData',login:true})
             // if(register.type=='success'){
             //   this.setState({ userPk: register.data.pk,token:register.data.token,mobile:register.data.mobile,username:this.state.mobile });
             //   this.props.navigation.navigate('OtpScreen',{
             //     username:this.state.mobileNo,
             //     screen:'',
             //     userPk:register.data.pk,
             //     token:register.data.token,
             //     mobile:register.data.mobileNo,
             //     csrf:register.data.csrf,
             //     url:url,
             //     mobileOTP:'',
             //   });
             // }
         }
    }
}

renderHeader=()=>{
  return(
    <View style={{height:55,width:width,backgroundColor:themeColor,marginTop:Constants.statusBarHeight}}>
        <View style={{flexDirection: 'row',height:55,alignItems: 'center',}}>
           <View style={{ flex:1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',}}>
             <Text   style={{ color:'#fff',fontWeight:'600',fontSize:22,textAlign:'center',}} numberOfLines={1}>Enter Mobile</Text>
           </View>
         </View>
     </View>
  )
}

  render(){
     const {navigate} = this.props.navigation;
     return (
       <View style={{flex:1,backgroundColor:'#e2e2e2',}}>
       {this.renderHeader()}
         <View style={{flex:1,zIndex:2,}}>
             <View style={{flex:1}}>
                <View  style={{flex:0.5,justifyContent:'flex-end',backgroundColor:'#e2e2e2',borderWidth:0,alignItems:'center'}}>
                  <Image source={require('../assets/man.png')} style={{resizeMode:'contain'}} />
                </View>
               <View style={{flex:0.4,zIndex:2,alignItems:'center',justifyContent:'center'}}>

                 <View style={{marginVertical:15,alignItems:'center',justifyContent:'center'}}>
                   <TextInput style={{height: 45,borderBottomWidth:2,borderColor:'#c2c2c2',minWidth:width*0.4,maxWidth: width*0.8,borderRadius:0,color:'#000',fontSize:20,textAlign:'center'}}
                       placeholder=""
                       selectionColor={'#000'}
                       onChangeText={query => {if(query.length==10){Keyboard.dismiss()}; this.setState({ mobileNo: query });this.setState({ username: query }) }}
                       value={this.state.username}
                       keyboardType={'numeric'}
                    />
                 </View>

                <TouchableOpacity onPress={()=>{this.sendOtp()}} style={{backgroundColor:themeColor,borderRadius:20,paddingVertical:8,paddingHorizontal:20,marginVertical:15}}>
                  <Text style={{fontSize:16,color:'#fff',fontWeight:'700'}}>Send OTP</Text>
                </TouchableOpacity>

               </View>
             </View>
         </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

});
