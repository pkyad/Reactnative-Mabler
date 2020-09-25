import * as React from 'react';
import {Animated, StatusBar ,View,FlatList,StyleSheet,TouchableOpacity,TouchableHighlight,Text,Dimensions,Image,AppState,BackHandler,AsyncStorage , TextInput, ScrollView ,TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Button, Alert,ActivityIndicator, ToastAndroid , WebView,Easing} from 'react-native';
import  Constants  from 'expo-constants';
import { FontAwesome ,MaterialCommunityIcons,MaterialIcons,SimpleLineIcons,Entypo,Fontisto,Feather} from '@expo/vector-icons';
import { StackActions, NavigationActions } from 'react-navigation';
import settings from '../appSettings';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
const themeColor = settings.themeColor

export default class Headers extends React.Component {

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

  render(){
    //If you intent to create customize header create screen itself
    return (
      <View style={{height:55,width:width,backgroundColor:themeColor,marginTop:Constants.statusBarHeight}}>
          <View style={{flexDirection: 'row',height:55,alignItems: 'center',}}>
             <View style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',}}>
              <TouchableOpacity onPress={()=>{this.props.navigation.openDrawer()}} style={{paddingHorizontal: 15,paddingVertical:10}}>
                <SimpleLineIcons name={'menu'} size={22} color={'#fff'}/>
              </TouchableOpacity>
             </View>
             <View style={{ flex: this.props.screen=='Home'?0.6:0.8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',}}>
               <Text   style={{ color:'#fff',fontWeight:'700',fontSize:18,textAlign:'center',}} numberOfLines={1}>{this.props.name}</Text>
             </View>
             {this.props.screen=='Home'&&
               <TouchableOpacity onPress={()=>{}} style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',}}>

              </TouchableOpacity>
           }
           </View>
       </View>
    )
  }
}
