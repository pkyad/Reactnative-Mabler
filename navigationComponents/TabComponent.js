import * as React from 'react';
import {Animated, StatusBar ,View,FlatList,StyleSheet,TouchableOpacity,TouchableHighlight,Text,Dimensions,Image,AppState,BackHandler,AsyncStorage , TextInput, ScrollView ,TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Button, Alert,ActivityIndicator, ToastAndroid , WebView,Easing} from 'react-native';
import  Constants  from 'expo-constants';
import { FontAwesome ,MaterialCommunityIcons,MaterialIcons,SimpleLineIcons,Entypo,Fontisto,Feather} from '@expo/vector-icons';
import { StackActions, NavigationActions } from 'react-navigation';
import settings from '../appSettings';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
const themeColor = settings.themeColor

export default class TabComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeColor:themeColor,
      inactiveColor:'#000',
      scale: new Animated.Value(0),
      color:'#f2f2f2',
      size:25,
    };

  }

  componentDidMount(){

  }

  navigate=async(nav)=>{
    this.props.navigation.navigate(nav, {}, NavigationActions.navigate({ routeName: 'Home' }))
  }


  render(){
    var routeName = this.props.navigation.state.routeName
    var home = ['Home']
    var pageFirst = ['PageFirst']
    var pageSecond = ['PageSecond']

    return (
    <View style={{position: 'absolute',bottom:0,height:55,left:0,width:'100%',borderTopWidth:1,borderColor:'#f2f2f2',backgroundColor:'transparent'}}>
    <View style={{flex:1,flexDirection:'row',backgroundColor:'rgba(255,255,255,0.95)',alignItems: 'center',justifyContent:'space-between'}}>


    <View style={{flex:1}} >
     <Animated.View style={[{borderRadius:30,height:'100%',}]} >
      <TouchableOpacity onPress={()=>{this.navigate('Home')}} style={{borderRadius:20,justifyContent: 'center',alignItems: 'center',height:'100%'}}>
       <MaterialCommunityIcons name={home.includes(routeName)?"home":"home-outline"} size={this.state.size} color={home.includes(routeName)?this.state.activeColor:this.state.inactiveColor} />
       <Text style={{color:home.includes(routeName)?themeColor:'#000',fontSize:12,margin:0,padding:0}}>Home</Text>
      </TouchableOpacity>
     </Animated.View>
    </View>


      <View style={{flex:1}} >
       <Animated.View style={[{borderRadius:30,height:'100%',}]} >
        <TouchableOpacity onPress={()=>{this.navigate('PageFirst')}} style={{borderRadius:20,justifyContent: 'center',alignItems: 'center',height:'100%'}}>
          <Entypo name="documents" size={this.state.size} color={pageFirst.includes(routeName)?this.state.activeColor:this.state.inactiveColor} />
          <Text style={{color:pageFirst.includes(routeName)?themeColor:'#000',fontSize:12,margin:0,padding:0}}>PageFirst</Text>
        </TouchableOpacity>
       </Animated.View>
      </View>

      <View style={{flex:1}} >
       <Animated.View style={[{borderRadius:30,height:'100%',}]} >
        <TouchableOpacity onPress={()=>{this.navigate('PageSecond')}} style={{borderRadius:20,justifyContent: 'center',alignItems: 'center',height:'100%'}}>
          <Entypo name="documents" size={this.state.size} color={pageSecond.includes(routeName)?this.state.activeColor:this.state.inactiveColor} />
          <Text style={{color:pageSecond.includes(routeName)?themeColor:'#000',fontSize:12,margin:0,padding:0}}>PageSecond</Text>
        </TouchableOpacity>
       </Animated.View>
      </View>

    </View>
    </View>
    )
  }
}
