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

const { UIManager } = NativeModules;

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
       showArray:[{show:false},{show:false},{show:false},{show:false}]
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

 changeIndex=(idx)=>{
   var arr = this.state.showArray
   if(arr[idx].show){
     arr[idx].show = false
     LayoutAnimation.easeInEaseOut();
     this.setState({showArray:arr})
   }else{
     arr.forEach((i,index)=>{
       i.show = true
       if(index!=idx){
         console.log(i);
         i.show = false
       }
     })
     LayoutAnimation.easeInEaseOut();
     this.setState({showArray:arr})
   }
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
                    <TouchableWithoutFeedback style={{}} onPress={()=>this.changeIndex(0)}>
                      <View style={[{marginTop:30,backgroundColor:'#fff',marginHorizontal:25,borderRadius:10}]}>
                          <View style={{flexDirection:'row',paddingVertical:20,paddingHorizontal:15,}}>
                             <View style={{flex:0.4,}}>
                               <Image source={require('../assets/building.png')} style={{resizeMode:'contain'}}/>
                               <Text   style={{ color:'#000',fontWeight:'600',fontSize:18,marginTop:5}} numberOfLines={1}>Visits</Text>
                             </View>
                             <View style={{flex:0.6}}>
                                 <View style={{flex:1,alignItems:'flex-end',justifyContent:'flex-start'}}>
                                    <Text style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>{`Y'Day`}
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
                          {this.state.showArray[0].show&&
                            <View style={{}}>
                              <View style={{flexDirection:'row',paddingVertical:5,backgroundColor:'rgba(50, 96, 168,0.3)',paddingHorizontal:10}}>
                                 <View style={{flex:0.8,}}>
                                   <Text   style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>{`Total Outlets (no's)`}</Text>
                                 </View>
                                 <View style={{flex:0.2,alignItems:'flex-end'}}>
                                    <Text style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>80</Text>
                                 </View>
                              </View>
                              <View style={{flexDirection:'row',paddingVertical:5,paddingHorizontal:10}}>
                                 <View style={{flex:0.8,}}>
                                   <Text   style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>{`Visit as per beat plan (no's)`}</Text>
                                 </View>
                                 <View style={{flex:0.2,alignItems:'flex-end'}}>
                                    <Text style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>24</Text>
                                 </View>
                              </View>
                              <View style={{flexDirection:'row',paddingVertical:5,backgroundColor:'rgba(50, 96, 168,0.3)',paddingHorizontal:10}}>
                                 <View style={{flex:0.8,}}>
                                   <Text   style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>{`Outlets visited in beat plan Y'Day (no's)`}</Text>
                                 </View>
                                 <View style={{flex:0.2,alignItems:'flex-end'}}>
                                    <Text style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>32</Text>
                                 </View>
                              </View>
                              <View style={{flexDirection:'row',paddingVertical:5,paddingHorizontal:10}}>
                                 <View style={{flex:0.8,}}>
                                   <Text   style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>{`Total retailers visited (no's)`}</Text>
                                 </View>
                                 <View style={{flex:0.2,alignItems:'flex-end'}}>
                                    <Text style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>34</Text>
                                 </View>
                              </View>
                              <View style={{flexDirection:'row',paddingVertical:5,backgroundColor:'rgba(50, 96, 168,0.3)',paddingHorizontal:10}}>
                                 <View style={{flex:0.8,}}>
                                   <Text   style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>{`Visit efficiency Y'Day`}</Text>
                                 </View>
                                 <View style={{flex:0.2,alignItems:'flex-end'}}>
                                    <Text style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>94%</Text>
                                 </View>
                              </View>
                              <View style={{flexDirection:'row',paddingVertical:5,paddingHorizontal:10}}>
                                 <View style={{flex:0.8,}}>
                                   <Text   style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>{`Visit efficiency MTD`}</Text>
                                 </View>
                                 <View style={{flex:0.2,alignItems:'flex-end'}}>
                                    <Text style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>96%</Text>
                                 </View>
                              </View>
                              <View style={{flexDirection:'row',paddingVertical:5,backgroundColor:'rgba(50, 96, 168,0.3)',paddingHorizontal:10,borderBottomLeftRadius:10,borderBottomRightRadius:10}}>
                                 <View style={{flex:0.8,}}>
                                   <Text   style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>{`Reatailers not yet visited (no's)`}</Text>
                                 </View>
                                 <View style={{flex:0.2,alignItems:'flex-end'}}>
                                    <Text style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>7</Text>
                                 </View>
                              </View>
                            </View>
                          }
                      </View>
                      </TouchableWithoutFeedback>
                    }

                    {this.state.billCustomer!=null&&
                    <TouchableWithoutFeedback style={{}} onPress={()=>this.changeIndex(1)}>
                      <View style={[{marginTop:20,backgroundColor:'#fff',marginHorizontal:25,borderRadius:10}]}>
                          <View style={{flexDirection:'row',paddingVertical:20,paddingHorizontal:15,}}>
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
                          {this.state.showArray[1].show&&
                          <View style={{}}>
                            <View style={{flexDirection:'row',paddingVertical:5,backgroundColor:'rgba(50, 96, 168,0.3)',paddingHorizontal:10}}>
                               <View style={{flex:0.4,}} />
                               <View style={{flex:0.3,alignItems:'center'}}>
                                  <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>Yesterday</Text>
                               </View>
                               <View style={{flex:0.15,alignItems:'center'}}>
                                  <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>MTD</Text>
                               </View>
                               <View style={{flex:0.15,alignItems:'center'}}>
                                  <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>LMTD</Text>
                               </View>
                            </View>
                            <View style={{flexDirection:'row',paddingVertical:5,paddingHorizontal:10}}>
                                <View style={{flex:0.4,}} >
                                    <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>Outlets visited</Text>
                                </View>
                                <View style={{flex:0.3,alignItems:'center'}}>
                                   <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>32</Text>
                                </View>
                                <View style={{flex:0.15,alignItems:'center'}}>
                                   <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>165</Text>
                                </View>
                                <View style={{flex:0.15,alignItems:'center'}}>
                                   <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>190</Text>
                                </View>
                            </View>
                            <View style={{flexDirection:'row',paddingVertical:5,backgroundColor:'rgba(50, 96, 168,0.3)',paddingHorizontal:10}}>
                                <View style={{flex:0.4,}} >
                                    <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>Bills Cut</Text>
                                </View>
                                <View style={{flex:0.3,alignItems:'center'}}>
                                   <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>14</Text>
                                </View>
                                <View style={{flex:0.15,alignItems:'center'}}>
                                   <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>83</Text>
                                </View>
                                <View style={{flex:0.15,alignItems:'center'}}>
                                   <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>98</Text>
                                </View>
                            </View>
                            <View style={{flexDirection:'row',paddingVertical:5,paddingHorizontal:10}}>
                                <View style={{flex:0.4,}} >
                                    <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>Bills Cut % </Text>
                                </View>
                                <View style={{flex:0.3,alignItems:'center'}}>
                                   <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>44%</Text>
                                </View>
                                <View style={{flex:0.15,alignItems:'center'}}>
                                   <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>50%</Text>
                                </View>
                                <View style={{flex:0.15,alignItems:'center'}}>
                                   <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>52%</Text>
                                </View>
                            </View>

                          </View>
                        }
                      </View>
                    </TouchableWithoutFeedback>
                    }

                    {this.state.orderValue!=null&&
                     <TouchableWithoutFeedback style={{}} onPress={()=>this.changeIndex(2)}>
                      <View style={[{marginTop:20,backgroundColor:'#fff',marginHorizontal:25,borderRadius:10}]}>
                          <View style={{flexDirection:'row',paddingHorizontal:15,paddingVertical:20,}}>
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
                          {this.state.showArray[2].show&&
                          <View style={{}}>
                            <View style={{flexDirection:'row',paddingVertical:5,backgroundColor:'rgba(50, 96, 168,0.3)',paddingHorizontal:10}}>
                               <View style={{flex:0.25,}} />
                               <View style={{flex:0.25,alignItems:'center'}}>
                                  <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>Order Value</Text>
                               </View>
                               <View style={{flex:0.25,alignItems:'center'}}>
                                  <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>Yesterday</Text>
                               </View>
                               <View style={{flex:0.25,alignItems:'center'}}>
                                  <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>&#8377; 23,000</Text>
                               </View>
                            </View>
                            <View style={{flexDirection:'row',paddingVertical:5,paddingHorizontal:10}}>
                                <View style={{flex:0.25,}} >
                                    <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}></Text>
                                </View>
                                <View style={{flex:0.25,alignItems:'center'}}>
                                   <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}></Text>
                                </View>
                                <View style={{flex:0.25,alignItems:'center'}}>
                                   <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>MTD</Text>
                                </View>
                                <View style={{flex:0.25,alignItems:'center'}}>
                                   <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>&#8377; 345000</Text>
                                </View>
                            </View>
                            <View style={{flexDirection:'row',paddingVertical:5,paddingHorizontal:10,backgroundColor:'rgba(50, 96, 168,0.3)'}}>
                                <View style={{flex:0.25,}} >
                                    <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}></Text>
                                </View>
                                <View style={{flex:0.25,alignItems:'center'}}>
                                   <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}></Text>
                                </View>
                                <View style={{flex:0.25,alignItems:'center'}}>
                                   <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>LMTD</Text>
                                </View>
                                <View style={{flex:0.25,alignItems:'center'}}>
                                   <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>&#8377; 356000</Text>
                                </View>
                            </View>
                            <View style={{flexDirection:'row',paddingVertical:5,paddingHorizontal:10}}>
                                <View style={{flex:0.25,}} >
                                    <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}></Text>
                                </View>
                                <View style={{flex:0.25,alignItems:'center'}}>
                                   <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>Growth %</Text>
                                </View>
                                <View style={{flex:0.25,alignItems:'center'}}>
                                   <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>MTD</Text>
                                </View>
                                <View style={{flex:0.25,alignItems:'center'}}>
                                   <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>-3%</Text>
                                </View>
                            </View>
                            <View style={{flexDirection:'row',paddingVertical:5,paddingHorizontal:10,backgroundColor:'rgba(50, 96, 168,0.3)'}}>
                                <View style={{flex:0.25,}} >
                                    <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>Target</Text>
                                </View>
                                <View style={{flex:0.25,alignItems:'center'}}>
                                   <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}></Text>
                                </View>
                                <View style={{flex:0.25,alignItems:'center'}}>
                                   <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>MTD</Text>
                                </View>
                                <View style={{flex:0.25,alignItems:'center'}}>
                                   <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>&#8377; 450000</Text>
                                </View>
                            </View>
                            <View style={{flexDirection:'row',paddingVertical:5,paddingHorizontal:10}}>
                                <View style={{flex:0.25,}} >
                                    <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}></Text>
                                </View>
                                <View style={{flex:0.25,alignItems:'center'}}>
                                   <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>Ach %</Text>
                                </View>
                                <View style={{flex:0.25,alignItems:'center'}}>
                                   <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>MTD</Text>
                                </View>
                                <View style={{flex:0.25,alignItems:'center'}}>
                                   <Text style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>77%</Text>
                                </View>
                            </View>


                          </View>
                        }
                      </View>
                      </TouchableWithoutFeedback>
                    }

                    {this.state.newOutlet!=null&&
                     <TouchableWithoutFeedback style={{}} onPress={()=>this.changeIndex(3)}>
                      <View style={[{marginTop:20,backgroundColor:'#fff',marginHorizontal:25,borderRadius:10}]}>
                          <View style={{flexDirection:'row',paddingHorizontal:15,paddingVertical:20,}}>
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
                        {this.state.showArray[3].show&&
                          <View style={{}}>
                            <View style={{flexDirection:'row',paddingVertical:5,backgroundColor:'rgba(50, 96, 168,0.3)',paddingHorizontal:10}}>
                               <View style={{flex:0.8,}}>
                                 <Text   style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>{`Month Opening`}</Text>
                               </View>
                               <View style={{flex:0.2,alignItems:'flex-end'}}>
                                  <Text style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>69</Text>
                               </View>
                            </View>
                            <View style={{flexDirection:'row',paddingVertical:5,paddingHorizontal:10}}>
                               <View style={{flex:0.8,}}>
                                 <Text   style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>{`MTD Base`}</Text>
                               </View>
                               <View style={{flex:0.2,alignItems:'flex-end'}}>
                                  <Text style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>72</Text>
                               </View>
                            </View>
                            <View style={{flexDirection:'row',paddingVertical:5,backgroundColor:'rgba(50, 96, 168,0.3)',paddingHorizontal:10}}>
                               <View style={{flex:0.8,}}>
                                 <Text   style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>{`New Outlets`}</Text>
                               </View>
                               <View style={{flex:0.2,alignItems:'flex-end'}}>
                                  <Text style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>3</Text>
                               </View>
                            </View>
                            <View style={{flexDirection:'row',paddingVertical:5,paddingHorizontal:10}}>
                               <View style={{flex:0.8,}}>
                                 <Text   style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>{`New Outlets LM`}</Text>
                               </View>
                               <View style={{flex:0.2,alignItems:'flex-end'}}>
                                  <Text style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>4</Text>
                               </View>
                            </View>
                            <View style={{flexDirection:'row',paddingVertical:5,backgroundColor:'rgba(50, 96, 168,0.3)',paddingHorizontal:10,borderBottomLeftRadius:10,borderBottomRightRadius:10}}>
                               <View style={{flex:0.8,}}>
                                 <Text   style={{ color:'#000',fontWeight:'600',fontSize:14,}} numberOfLines={1}>{`Target TM`}</Text>
                               </View>
                               <View style={{flex:0.2,alignItems:'flex-end'}}>
                                  <Text style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>75</Text>
                               </View>
                            </View>
                          </View>
                        }
                      </View>
                    </TouchableWithoutFeedback>
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
