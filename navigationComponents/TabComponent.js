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
      activeColor:'#fff',
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
    var pageFirst = ['Visits']
    var pageSecond = ['Reports']

    return (
    <View style={{position: 'absolute',bottom:0,height:55,left:0,width:'100%',borderTopWidth:1,borderColor:'#f2f2f2',}}>
    <View style={{flex:1,flexDirection:'row',backgroundColor:'#404040',alignItems: 'center',justifyContent:'space-between'}}>


    <View style={{flex:1}} >
     <Animated.View style={[{height:'100%',borderBottomWidth:home.includes(routeName)?2:0,borderColor:'#fff'}]} >
      <TouchableOpacity onPress={()=>{this.navigate('Home')}} style={{borderRadius:20,justifyContent: 'center',alignItems: 'center',height:'100%'}}>
       <Text style={{color:home.includes(routeName)?'#fff':'#fff',fontSize:16,margin:0,padding:0}}>Home</Text>
      </TouchableOpacity>
     </Animated.View>
    </View>


      <View style={{flex:1}} >
       <Animated.View style={[{height:'100%',borderBottomWidth:pageFirst.includes(routeName)?2:0,borderColor:'#fff'}]} >
        <TouchableOpacity onPress={()=>{this.navigate('Visits')}} style={{borderRadius:20,justifyContent: 'center',alignItems: 'center',height:'100%'}}>
          <Text style={{color:pageFirst.includes(routeName)?'#fff':'#fff',fontSize:16,margin:0,padding:0}}>My Visits</Text>
        </TouchableOpacity>
       </Animated.View>
      </View>

      <View style={{flex:1}} >
       <Animated.View style={[{height:'100%',borderBottomWidth:pageSecond.includes(routeName)?2:0,borderColor:'#fff'}]} >
        <TouchableOpacity onPress={()=>{this.navigate('Reports')}} style={{borderRadius:20,justifyContent: 'center',alignItems: 'center',height:'100%'}}>
          <Text style={{color:pageSecond.includes(routeName)?'#fff':'#fff',fontSize:16,margin:0,padding:0}}>Reports</Text>
        </TouchableOpacity>
       </Animated.View>
      </View>

    </View>
    </View>
    )
  }
}

// <Entypo name="documents" size={this.state.size} color={pageSecond.includes(routeName)?this.state.activeColor:this.state.inactiveColor} />
// <Entypo name="documents" size={this.state.size} color={pageFirst.includes(routeName)?this.state.activeColor:this.state.inactiveColor} />
// <MaterialCommunityIcons name={home.includes(routeName)?"home":"home-outline"} size={this.state.size} color={home.includes(routeName)?this.state.activeColor:this.state.inactiveColor} />
