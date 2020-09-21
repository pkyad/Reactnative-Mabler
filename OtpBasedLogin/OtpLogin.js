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
         console.log(url + '/api/homepage/registration/');
         fetch( url + '/api/homepage/registration/', {
           method: 'POST',
           body: data
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
         this.showToast('OTP request sent')
         var data = await HttpsClient.get(url+'/generateOTP/?mobile='+this.state.mobileNo)
         if(data.type=='success'){
             this.props.navigation.navigate('OtpScreen',{screen:'LogInScreen',url:url,username:this.state.mobileNo,});
             return
         }else{
             var register = await HttpsClient.post(url+'/api/homepage/registration/',{mobile:this.state.mobileNo,bodyType:'formData',login:true})
             if(type=='success'){
               this.setState({ userPk: register.data.pk,token:register.data.token,mobile:register.data.mobile,username:this.state.mobile });
               this.props.navigation.navigate('OtpScreen',{
                 username:this.state.mobileNo,
                 screen:'',
                 userPk:register.data.pk,
                 token:register.data.token,
                 mobile:register.data.mobileNo,
                 csrf:register.data.csrf,
                 url:url,
                 mobileOTP:'',
               });
             }
         }
    }

}

  render(){
     const {navigate} = this.props.navigation;
     return (
       <View style={{flex:1,backgroundColor:'#fff',}}>
         <View style={{flex:1,zIndex:2,}}>
             <View style={{flex:1}}>
               <View style={{flex:0.9,zIndex:2,alignItems:'center',justifyContent:'center'}}>


                 <View style={{marginVertical:15,alignItems:'center'}}>
                    <Text style={{fontWeight: 'bold',fontSize: 25,color:'#000'}}> Welcome back ! </Text>
                    <Text style={{fontSize: 14,color:'#000',marginTop:5}}> Great To See You Again </Text>
                 </View>

                 <View style={{marginHorizontal:30,width:width-60,marginVertical:15,}}>
                   <View style={{position:'absolute',top:-9,left:20,zIndex:2,backgroundColor:'#fff'}}>
                      <Text style={{fontSize:12,paddingHorizontal:5,color:'#000'}}>Enter your mobile no</Text>
                   </View>
                   <TextInput style={{height: 45,borderWidth:1,borderColor:'#000',width:'100%',borderRadius:10,color:'#000',paddingHorizontal:15}}
                       placeholder=""
                       selectionColor={'#000'}
                       onChangeText={query => { this.setState({ mobileNo: query });this.setState({ username: query }) }}
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
