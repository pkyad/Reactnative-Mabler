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

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
const themeColor = settings.themeColor
const loginType = settings.loginType

class DrawerContent  extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

  componentDidMount(){
  }

    render(){
      var scrollViewHeight = height-(Constants.statusBarHeight+120)
      var routeName = this.props.items.find(it => it.key === this.props.activeItemKey)

      return(
        <ScrollView containerStyle={{}}>
          <View style={{ backgroundColor: themeColor, height:120, flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:Constants.statusBarHeight}}>
          </View>
          <ScrollView  contentContainerStyle={{height:scrollViewHeight}}>

              {Platform.OS === 'android' && loginType == 'otp' &&
                 <TouchableNativeFeedback centered={true} background={TouchableNativeFeedback.Ripple('grey')} onPress={()=>this.props.navigation.navigate('OtpLogin', {}, NavigationActions.navigate({ routeName: 'Login' }))}>
                    <View style={{flexDirection: 'row',paddingVertical:14,backgroundColor:routeName.routeName=='Login'?'#f2f2f2':'#fff', alignItems: 'center',}}>
                       <View style={{flex:0.22,justifyContent: 'center',alignItems: 'center',}}>
                          <Entypo name="login" size={20} color={routeName.routeName=='Login'?themeColor:"black"} />
                       </View>
                       <View style={{flex:0.75,justifyContent: 'center',alignItems: 'flex-start',marginLeft:14}}>
                           <Text style={{color:routeName.routeName=='Login'?themeColor:"black",fontWeight:'normal',fontSize:16,}} >Login</Text>
                       </View>
                    </View>
                </TouchableNativeFeedback>
            }

              {Platform.OS === 'android' &&
                 <TouchableNativeFeedback centered={true} background={TouchableNativeFeedback.Ripple('grey')} onPress={()=>this.props.navigation.navigate('Home')}>
                    <View style={{flexDirection: 'row',paddingVertical:14,backgroundColor:routeName.routeName=='Home'?'#f2f2f2':'#fff', alignItems: 'center',}}>
                       <View style={{flex:0.22,justifyContent: 'center',alignItems: 'center',}}>
                          <MaterialCommunityIcons name="home-outline" size={24} color={routeName.routeName=='Home'?themeColor:"black"} />
                       </View>
                       <View style={{flex:0.75,justifyContent: 'center',alignItems: 'flex-start',marginLeft:14}}>
                           <Text style={{color:routeName.routeName=='Home'?themeColor:"black",fontWeight:'normal',fontSize:16,}} >Home</Text>
                       </View>
                    </View>
                </TouchableNativeFeedback>
             }

            {Platform.OS === 'android' &&
               <TouchableNativeFeedback centered={true} background={TouchableNativeFeedback.Ripple('grey')} onPress={()=>this.props.navigation.navigate('PageFirst')}>
                  <View style={{flexDirection: 'row',paddingVertical:14,backgroundColor:routeName.routeName=='PageFirst'?'#f2f2f2':'#fff', alignItems: 'center',}}>
                     <View style={{flex:0.22,justifyContent: 'center',alignItems: 'center',}}>
                        <Entypo name="documents" size={20} color={routeName.routeName=='PageFirst'?themeColor:"black"} />
                     </View>
                     <View style={{flex:0.75,justifyContent: 'center',alignItems: 'flex-start',marginLeft:14}}>
                         <Text style={{color:routeName.routeName=='PageFirst'?themeColor:"black",fontWeight:'normal',fontSize:16,}} >PageFirst</Text>
                     </View>
                  </View>
              </TouchableNativeFeedback>
          }

          {Platform.OS === 'android' &&
             <TouchableNativeFeedback centered={true} background={TouchableNativeFeedback.Ripple('grey')} onPress={()=>this.props.navigation.navigate('PageSecond')}>
                <View style={{flexDirection: 'row',paddingVertical:14,backgroundColor:routeName.routeName=='PageSecond'?'#f2f2f2':'#fff', alignItems: 'center',}}>
                   <View style={{flex:0.22,justifyContent: 'center',alignItems: 'center',}}>
                      <Entypo name="documents" size={20} color={routeName.routeName=='PageSecond'?themeColor:"black"} />
                   </View>
                   <View style={{flex:0.75,justifyContent: 'center',alignItems: 'flex-start',marginLeft:14}}>
                       <Text style={{color:routeName.routeName=='PageSecond'?themeColor:"black",fontWeight:'normal',fontSize:16,}} >PageSecond</Text>
                   </View>
                </View>
            </TouchableNativeFeedback>
        }

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

  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);
