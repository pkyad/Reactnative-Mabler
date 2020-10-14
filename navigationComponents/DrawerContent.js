import React from 'react';
import { Platform,
  AsyncStorage,
  StyleSheet,ScrollView,
  View,Image,Dimensions,
  StatusBar,Alert,TouchableOpacity,
  TouchableNativeFeedback} from 'react-native';
import { createBottomTabNavigator,createAppContainer,createSwitchNavigator,NavigationActions } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator,DrawerItems } from 'react-navigation-drawer';
import Constants from 'expo-constants';
import { FontAwesome ,MaterialCommunityIcons,MaterialIcons,SimpleLineIcons,Feather,Entypo} from '@expo/vector-icons';
import { Text, TouchableRipple } from 'react-native-paper';
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import * as actionTypes from '../actions/actionTypes';
import settings from '../appSettings';
import { LinearGradient } from 'expo-linear-gradient';
import HttpsClient from '../helpers/HttpsClient';
import moment from 'moment';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
const themeColor = settings.themeColor
const loginType = settings.loginType
const SERVER_URL = settings.url

class DrawerContent  extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          user:props.user,
          attendance:props.attendance,
        }
    }

  componentDidMount(){
  }

  patchAttendance = async()=>{
    var sendData = {
      checkOutTime:moment(new Date()).format('YYYY-MM-DD')
    }
    if(this.state.attendance==null){
      this.refresh()
      return
    }
    var data = await HttpsClient.patch(SERVER_URL + '/api/ERP/attendance/'+this.state.attendance.pk+'/',sendData)
    if(data.type=='success'){
        this.refresh()
    }else{
      this.refresh()
    }
  }

  refresh=()=>{
    AsyncStorage.removeItem('userpk')
    AsyncStorage.removeItem('sessionid')
    AsyncStorage.removeItem('csrf')
    AsyncStorage.removeItem('user_name')

    this.props.setUserDetails(null)
    this.props.setAttendance(null)
    AsyncStorage.setItem("login", JSON.stringify(false))

    this.props.navigation.closeDrawer();
    this.props.navigation.navigate('Login')
  }

  logout = ()=>{
        Alert.alert('Log out','Do you want to logout?',
            [{text: 'Cancel', onPress: () => {
                return null
              }},
              {text: 'Confirm', onPress: () => {
                this.patchAttendance()
              }},
          ],
          { cancelable: false }
        )
    }

    render(){
      var scrollViewHeight = height-(Constants.statusBarHeight)
      var routeName = this.props.items.find(it => it.key === this.props.activeItemKey)

      return(
        <ScrollView containerStyle={{flex:1}}>
          <ScrollView  contentContainerStyle={{height:(height+Constants.statusBarHeight)-8}} >
          <LinearGradient colors={['rgba(13,94,224,0.5)', 'rgba(6,56,138,1)']} style={{ position: 'absolute', left: 0, right: 0, top: Constants.statusBarHeight, bottom:0 }} >
             <View style={{height:80,alignItems:'flex-end'}} >
               <TouchableOpacity onPress={()=>{this.props.navigation.closeDrawer()}} style={{paddingHorizontal: 15,paddingVertical:10}}>
                 <SimpleLineIcons name={'menu'} size={22} color={'#fff'}/>
               </TouchableOpacity>
             </View>

              {Platform.OS === 'android' &&
                 <TouchableNativeFeedback centered={true} background={TouchableNativeFeedback.Ripple('grey')} onPress={()=>this.props.navigation.navigate('Home')}>
                    <View style={{flexDirection: 'row',paddingVertical:14,backgroundColor:routeName.routeName=='Home'?'transparent':'transparent', alignItems: 'center',}}>
                       <View style={{flex:1,justifyContent: 'center',alignItems: 'center',}}>
                           <Text style={{color:routeName.routeName=='Home'?'#fff':"#fff",fontWeight:'normal',fontSize:18,}} >Home</Text>
                       </View>
                    </View>
                </TouchableNativeFeedback>
             }

            {Platform.OS === 'android' &&
               <TouchableNativeFeedback centered={true} background={TouchableNativeFeedback.Ripple('grey')} onPress={()=>this.props.navigation.navigate('PageFirst')}>
                  <View style={{flexDirection: 'row',paddingVertical:14,backgroundColor:routeName.routeName=='PageFirst'?'transparent':'transparent', alignItems: 'center',}}>
                     <View style={{flex:1,justifyContent: 'center',alignItems: 'center',}}>
                         <Text style={{color:routeName.routeName=='PageFirst'?'#fff':"#fff",fontWeight:'normal',fontSize:18,}} >My Visits</Text>
                     </View>
                  </View>
              </TouchableNativeFeedback>
          }

          {Platform.OS === 'android' &&
             <TouchableNativeFeedback centered={true} background={TouchableNativeFeedback.Ripple('grey')} onPress={()=>this.props.navigation.navigate('PageSecond')}>
                <View style={{flexDirection: 'row',paddingVertical:14,backgroundColor:routeName.routeName=='PageSecond'?'transparent':'transparent', alignItems: 'center',}}>
                   <View style={{flex:1,justifyContent: 'center',alignItems: 'center',}}>
                       <Text style={{color:routeName.routeName=='PageSecond'?'#fff':"#fff",fontWeight:'normal',fontSize:18,}} >Orders</Text>
                   </View>
                </View>
            </TouchableNativeFeedback>
          }

          {Platform.OS === 'android' &&
             <TouchableNativeFeedback centered={true} background={TouchableNativeFeedback.Ripple('grey')} onPress={()=>this.props.navigation.navigate('PageThird')}>
                <View style={{flexDirection: 'row',paddingVertical:14,backgroundColor:routeName.routeName=='PageThird'?'transparent':'transparent', alignItems: 'center',}}>
                   <View style={{flex:1,justifyContent: 'center',alignItems: 'center',}}>
                       <Text style={{color:routeName.routeName=='PageThird'?'#fff':"#fff",fontWeight:'normal',fontSize:18,}} >Training</Text>
                   </View>
                </View>
            </TouchableNativeFeedback>
          }

        <View style={[styles.container,{justifyContent: 'flex-end',}]}>
                  <View style={{ flex: 1, alignItems: 'center',justifyContent: 'flex-end',marginBottom:20 }}>
                      <Text   style={{fontSize:18,color:'#fff', }}>Powered by mAbler</Text>
                      <Text   style={{fontSize:16,color:'#fff', marginTop:10}}>App version {Constants.manifest.version}</Text>
                      <TouchableOpacity onPress={()=>{this.logout()}} style={{width:'100%',height:40,alignItems:'center',justifyContent:'center'}}>
                        <Text   style={{fontSize:20,color:'#fff',fontWeight:'600' }}>Logout</Text>
                      </TouchableOpacity>
                  </View>
            </View>

        </LinearGradient>

          </ScrollView>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mapStateToProps =(state) => {
    return {
      user:state.reducer.user,
      attendance:state.reducer.attendance,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUserDetails:  (args) => dispatch(actions.setUserDetails(args)),
    setAttendance:  (args) => dispatch(actions.setAttendance(args)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);

// {Platform.OS === 'android' && loginType == 'otp' && this.state.user==null&&
//    <TouchableNativeFeedback centered={true} background={TouchableNativeFeedback.Ripple('grey')} onPress={()=>this.props.navigation.navigate('OtpLogin', {}, NavigationActions.navigate({ routeName: 'Login' }))}>
//       <View style={{flexDirection: 'row',paddingVertical:14,backgroundColor:routeName.routeName=='Login'?'#f2f2f2':'#fff', alignItems: 'center',}}>
//          <View style={{flex:0.22,justifyContent: 'center',alignItems: 'center',}}>
//             <Entypo name="login" size={20} color={routeName.routeName=='Login'?themeColor:"black"} />
//          </View>
//          <View style={{flex:0.75,justifyContent: 'center',alignItems: 'flex-start',marginLeft:14}}>
//              <Text style={{color:routeName.routeName=='Login'?themeColor:"black",fontWeight:'normal',fontSize:16,}} >Login</Text>
//          </View>
//       </View>
//   </TouchableNativeFeedback>
// }
