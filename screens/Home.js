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
import HttpsClient from '../helpers/HttpsClient';
import Loader from '../helpers/Loader';


const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
const themeColor = settings.themeColor
const url = settings.url


class Home extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {header:null}
  };

  constructor(props) {
    super(props);
    this.state={
       loader:false,
       user:props.user,
       billCustomer:null,
       newOutlet:null,
       orderValue:null,
       visits:null,
      }
    }

getDashboard=async()=>{
  var data = await HttpsClient.get(url + '/api/ERP/frontlinerDashboard/')
  if(data.type=='success'){
      if(data.data.success){
        this.setState({billCustomer:data.data.billCustomer,newOutlet:data.data.newOutlet,orderValue:data.data.orderValue,visits:data.data.visits})
      }
  }else{
      return
  }
}

 componentDidMount(){
    this.getDashboard()
 }

 renderHeader=()=>{
   var user = this.state.user
   var name = user.first_name
   var displayPicture = user.profile.displayPicture==null?'':user.profile.displayPicture

   return(
     <View style={{position:'absolute',top:Constants.statusBarHeight,height:180,left:0,width:'100%',zIndex:99}}>
     <View style={{flex:1,backgroundColor:themeColor,borderBottomLeftRadius:30,borderBottomRightRadius:30,}}>
         <View style={{flexDirection: 'row',flex:0.3,}}>
           <View style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'center',alignItems: 'center', }}>
             <TouchableOpacity onPress={()=>{this.props.navigation.openDrawer()}} style={{paddingHorizontal: 15,paddingVertical:10}}>
               <SimpleLineIcons name={'menu'} size={22} color={'#fff'}/>
             </TouchableOpacity>
           </View>
           <View style={{ flex: 0.6, flexDirection: 'row', justifyContent: 'center',alignItems: 'center', }}>
             <Text   style={{ color:'#fff',fontWeight:'700',fontSize:18,textAlign:'center',}} numberOfLines={1}>mPower</Text>
           </View>
           <TouchableOpacity onPress={()=>{}} style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',}}>
              <View style={{position:'absolute',top:0,bottom:10,right:10,left:0, justifyContent: 'center', alignItems: 'center',}}>
                 <View style={{backgroundColor:'red',width:8,height:8,borderRadius:4,zIndex:999}} />
              </View>
              <FontAwesome name="bell" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row',flex:0.7,}}>
           <View style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'center', }}>
           </View>
           <View style={{ flex: 0.6, justifyContent: 'flex-start',alignItems:'center' }}>
             <Image source={displayPicture.length>0?{uri:displayPicture}:null} style={{height:60,width:60,borderRadius:30,backgroundColor:'#404040'}} />
             <Text   style={{ color:'#fff',fontWeight:'600',fontSize:18,textAlign:'center',marginTop:5}} numberOfLines={1}>Welcome {user.first_name}</Text>
             <Text   style={{ color:'#fff',fontWeight:'600',fontSize:12,textAlign:'center',marginTop:5}} numberOfLines={1}>{`Heres's your perfomance dashboard`}</Text>
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
                <View style={{flex:1,paddingTop:180+Constants.statusBarHeight}}>
                  <ScrollView contentContainerStyle={{paddingBottom:75}}>

                    {this.state.visits!=null&&
                      <View style={[{marginTop:30,paddingHorizontal:15,paddingVertical:20,backgroundColor:'#fff',marginHorizontal:25,borderRadius:10}]}>
                          <View style={{flexDirection:'row',}}>
                             <View style={{flex:0.4,}}>
                               <Image source={require('../assets/building.png')} style={{resizeMode:'contain'}}/>
                               <Text   style={{ color:'#000',fontWeight:'600',fontSize:18,marginTop:5}} numberOfLines={1}>Visits</Text>
                             </View>
                             <View style={{flex:0.6}}>
                                 <View style={{flex:1,alignItems:'flex-end',justifyContent:'flex-start'}}>
                                  <Text   style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>{`Y'Day`}
                                    <Text style={{ color:'#000',fontWeight:'700',fontSize:20,}}>  {this.state.visits.ydayD}/{this.state.visits.ydayN}</Text>
                                  </Text>
                                 </View>
                                 <View style={{flex:1,alignItems:'flex-end',justifyContent:'flex-end'}}>
                                  <Text   style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>{`Efficiency`}
                                    <Text style={{ color:'#000',fontWeight:'700',fontSize:20,}}>  {this.state.visits.visitEff}%</Text>
                                  </Text>
                                 </View>
                             </View>
                          </View>
                      </View>
                    }

                    {this.state.billCustomer!=null&&
                      <View style={[{marginTop:20,paddingHorizontal:15,paddingVertical:20,backgroundColor:'#fff',marginHorizontal:25,borderRadius:10}]}>
                          <View style={{flexDirection:'row',}}>
                             <View style={{flex:0.5,}}>
                               <Image source={require('../assets/list.png')} style={{resizeMode:'contain'}}/>
                               <Text   style={{ color:'#000',fontWeight:'600',fontSize:18,marginTop:5}} numberOfLines={1}>Billed Customers</Text>
                             </View>
                             <View style={{flex:0.5}}>
                                 <View style={{flex:1,alignItems:'flex-end',justifyContent:'flex-start'}}>
                                  <Text   style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>{`Y'Day`}
                                    <Text style={{ color:'#000',fontWeight:'700',fontSize:20,}}>  {this.state.billCustomer.yday}</Text>
                                  </Text>
                                 </View>
                                 <View style={{flex:1,alignItems:'flex-end',justifyContent:'flex-end'}}>
                                  <Text   style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>{`Bill Cut`}
                                    <Text style={{ color:'#000',fontWeight:'700',fontSize:20,}}>  {this.state.billCustomer.billCutEff}%</Text>
                                  </Text>
                                 </View>
                             </View>
                          </View>
                      </View>
                    }

                    {this.state.orderValue!=null&&
                      <View style={[{marginTop:20,paddingHorizontal:15,paddingVertical:20,backgroundColor:'#fff',marginHorizontal:25,borderRadius:10}]}>
                          <View style={{flexDirection:'row',}}>
                             <View style={{flex:0.4,}}>
                               <Image source={require('../assets/order.png')} style={{resizeMode:'contain'}}/>
                               <Text   style={{ color:'#000',fontWeight:'600',fontSize:18,marginTop:5}} numberOfLines={1}>Order Values</Text>
                             </View>
                             <View style={{flex:0.6}}>
                                 <View style={{flex:1,alignItems:'flex-end',justifyContent:'flex-start'}}>
                                  <Text   style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>{`Y'Day (Rs)`}
                                    <Text style={{ color:'#000',fontWeight:'700',fontSize:20,}}>  {this.state.orderValue.yday}</Text>
                                  </Text>
                                 </View>
                                 <View style={{flex:1,alignItems:'flex-end',justifyContent:'flex-end'}}>
                                  <Text   style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>{`MTD (Rs)`}
                                    <Text style={{ color:'#000',fontWeight:'700',fontSize:20,}}>  {this.state.orderValue.mtdValue}</Text>
                                  </Text>
                                 </View>
                             </View>
                          </View>
                      </View>
                    }

                    {this.state.newOutlet!=null&&
                      <View style={[{marginTop:20,paddingHorizontal:15,paddingVertical:20,backgroundColor:'#fff',marginHorizontal:25,borderRadius:10}]}>
                          <View style={{flexDirection:'row',}}>
                             <View style={{flex:0.4,}}>
                               <Image source={require('../assets/real.png')} style={{resizeMode:'contain'}}/>
                               <Text   style={{ color:'#000',fontWeight:'600',fontSize:18,marginTop:5}} numberOfLines={1}>New Outlets</Text>
                             </View>
                             <View style={{flex:0.6}}>
                                 <View style={{flex:1,alignItems:'flex-end',justifyContent:'flex-start'}}>
                                  <Text   style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>{`Y'Day`}
                                    <Text style={{ color:'#000',fontWeight:'700',fontSize:20,}}>  {this.state.newOutlet.yday}</Text>
                                  </Text>
                                 </View>
                                 <View style={{flex:1,alignItems:'flex-end',justifyContent:'flex-end'}}>
                                  <Text   style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>{`Retail Base`}
                                    <Text style={{ color:'#000',fontWeight:'700',fontSize:20,}}>  {this.state.newOutlet.retailBase}</Text>
                                  </Text>
                                 </View>
                             </View>
                          </View>
                      </View>
                    }

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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
