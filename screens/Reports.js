import React from 'react';
import {
  Image,Platform,Switch,
  ScrollView,StyleSheet,
  Text,Button,TextInput,NativeModules,
  TouchableOpacity,View,Animated,
  Slider,ImageBackground,LayoutAnimation,
  Dimensions, Alert,StatusBar,
  FlatList, AppState, BackHandler ,
  AsyncStorage,ActivityIndicator,
  ToastAndroid,RefreshControl,TouchableWithoutFeedback,TouchableNativeFeedback} from 'react-native';
import {Fontisto, FontAwesome,Entypo,SimpleLineIcons,MaterialCommunityIcons,Feather,Octicons,MaterialIcons,FontAwesome5 } from '@expo/vector-icons';
import  Constants  from 'expo-constants';
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import * as actionTypes from '../actions/actionTypes';
import TabComponent  from '../navigationComponents/TabComponent.js';
import Headers  from '../helpers/Headers.js';
import settings from '../appSettings';
import Loader from '../helpers/Loader';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
const themeColor = settings.themeColor


class Reports extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {header:null}
  };

  constructor(props) {
    super(props);
    this.state={
        user:props.user,
        loader:false
      }
    }

    componentDidMount(){
      console.log(this.state.user,'fndsg');
    }

  renderHeader=()=>{
    var user = this.state.user
    var name = user.first_name
    var displayPicture = user.profile.displayPicture==null?'':user.profile.displayPicture

    return(
      <View style={{position:'absolute',top:Constants.statusBarHeight,height:160,left:0,width:'100%',zIndex:99}}>
      <View style={{flex:1,backgroundColor:themeColor,borderBottomLeftRadius:30,borderBottomRightRadius:30,}}>
          <View style={{flexDirection: 'row',flex:0.3,}}>
            <View style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'center',alignItems: 'center', }}>
               <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Home')}} style={{paddingHorizontal: 15,paddingVertical:15,}}>
                 <MaterialIcons name={'arrow-back'} size={22} color={'#fff'}/>
               </TouchableOpacity>
            </View>
            <View style={{ flex: 0.6, flexDirection: 'row', justifyContent: 'center',alignItems: 'center', }}>
              <Text   style={{ color:'#fff',fontWeight:'700',fontSize:18,textAlign:'center',}} numberOfLines={1}>Profile</Text>
            </View>
         </View>
         <View style={{flexDirection: 'row',flex:0.7,}}>
            <View style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'center', }}>
            </View>
            <View style={{ flex: 0.6, justifyContent: 'flex-start',alignItems:'center' }}>
              <Image source={displayPicture.length>0?{uri:displayPicture}:null} style={{height:60,width:60,borderRadius:30,backgroundColor:'#404040'}} />
              <Text   style={{ color:'#fff',fontWeight:'600',fontSize:18,textAlign:'center',marginTop:5}} numberOfLines={1}>{user.first_name}</Text>
            </View>
         </View>
      </View>
      </View>
    )
  }

  render() {
    return (
      <View style={{flex:1,backgroundColor:'#e2e2e2'}}>
          {this.renderHeader()}
          {this.state.loader&&
            <Loader />
          }
          {!this.state.loader&&
            <View style={{flex:1,paddingTop:160+Constants.statusBarHeight}}>
              <ScrollView contentContainerStyle={{paddingBottom:55}}>

                 <View style={[{marginTop:30,padding:10,backgroundColor:'#fff',marginHorizontal:25,borderRadius:10}]}>
                     <View style={{flexDirection:'row',marginBottom:5}}>
                        <View style={{flex:0.8}}>
                          <Text   style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>Location</Text>
                        </View>
                        <View style={{flex:0.2}}>
                        </View>
                     </View>
                     <Text   style={{ color:'grey',fontWeight:'600',fontSize:16,}} >{this.state.user.profile.city==null?'-':this.state.user.profile.city}</Text>
                 </View>

                 <View style={[{marginTop:15,padding:10,backgroundColor:'#fff',marginHorizontal:25,borderRadius:10}]}>
                     <View style={{flexDirection:'row',marginBottom:5}}>
                        <View style={{flex:0.8}}>
                          <Text   style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>Manager</Text>
                        </View>
                        <View style={{flex:0.2}}>
                        </View>
                     </View>
                     <Text   style={{ color:'grey',fontWeight:'600',fontSize:16,}} >{this.state.user.profile.manager==null?'-':this.state.user.profile.manager}</Text>
                 </View>

                 <View style={[{marginTop:15,padding:10,backgroundColor:'#fff',marginHorizontal:25,borderRadius:10}]}>
                     <View style={{flexDirection:'row',marginBottom:5}}>
                        <View style={{flex:0.8}}>
                          <Text   style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>Phone No</Text>
                        </View>
                        <View style={{flex:0.2}}>
                        </View>
                     </View>
                     <Text   style={{ color:'grey',fontWeight:'600',fontSize:16,}} >{this.state.user.profile.mobile==null?'-':this.state.user.profile.mobile}</Text>
                 </View>

                 <View style={[{marginTop:15,padding:10,backgroundColor:'#fff',marginHorizontal:25,borderRadius:10}]}>
                     <View style={{flexDirection:'row',marginBottom:5}}>
                        <View style={{flex:0.8}}>
                          <Text   style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>Email Id</Text>
                        </View>
                        <View style={{flex:0.2}}>
                        </View>
                     </View>
                     <Text   style={{ color:'grey',fontWeight:'600',fontSize:16,}} >{this.state.user.email.length==0?'-':this.state.user.email}</Text>
                 </View>

              </ScrollView>
            </View>
          }
          <TabComponent navigation={this.props.navigation}  />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
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
});

const mapStateToProps =(state) => {
    return {
     user:state.reducer.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
