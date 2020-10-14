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
import moment from 'moment';


const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
const themeColor = settings.themeColor
const url = settings.url


class ReatilerDetails extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {header:null}
  };

  constructor(props) {
    super(props);
    var retailer = this.props.navigation.getParam('item',null)
    this.state={
       loader:false,
       user:props.user,
       orderValues:null,
       visit:null,
       retailerPk:retailer.pk,
       retailer:retailer
      }
    }

getDetails=async()=>{
  var data = await HttpsClient.get(url + '/api/ERP/retailerDetail/?retailer='+this.state.retailerPk)
  if(data.type=='success'){
      console.log(data,'dbsahg');
      if(data.data.success){
        this.setState({orderValues:data.data.records.data.orderValues,visit:data.data.records.data.visit})
      }
  }else{
      return
  }
}

 componentDidMount(){
    this.getDetails()
 }



  render() {
    return (
      <View style={{flex:1,backgroundColor:'#e2e2e2'}}>
              <Headers navigation={this.props.navigation} name={this.state.retailer.name} screen={'RetailerDetails'}/>
              {this.state.loader&&
                <Loader />
              }
              {!this.state.loader&&
                <View style={{flex:1,paddingTop:0}}>
                  <View style={{paddingVertical:15,paddingBottom:5}}>
                      <Text style={{fontSize:20,color:'#000',fontWeight:'700',textAlign:'center'}}>Dashboard</Text>
                      <Text style={{fontSize:16,color:'#000',fontWeight:'600',marginTop:5,textAlign:'center'}}>{moment(moment.utc(new Date()).toDate()).local().format('dddd')} , {moment(moment.utc(new Date()).toDate()).local().format('DD MMM YY')}</Text>
                  </View>
                  <ScrollView contentContainerStyle={{paddingBottom:0}}>

                    {this.state.visit!=null&&
                      <View style={[{marginTop:30,paddingHorizontal:15,paddingVertical:20,backgroundColor:'#fff',marginHorizontal:25,borderRadius:10}]}>
                          <View style={{flexDirection:'row',}}>
                             <View style={{flex:0.4,}}>
                               <Image source={require('../assets/building.png')} style={{resizeMode:'contain'}}/>
                               <Text   style={{ color:'#000',fontWeight:'600',fontSize:18,marginTop:5}} numberOfLines={1}>Visits</Text>
                             </View>
                             <View style={{flex:0.6}}>
                                 <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:5}}>
                                   <Text   style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>Last Visit</Text>
                                   <Text style={{ color:'#000',fontWeight:'600',fontSize:16,}}>  :  {this.state.visit.lastVisit}</Text>
                                 </View>
                                 <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:5}}>
                                   <Text   style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>{`MTD Visits (No's)`}</Text>
                                   <Text style={{ color:'#000',fontWeight:'600',fontSize:16,}}>  :  {this.state.visit.mtdN}</Text>
                                 </View>
                                 <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:5}}>
                                   <Text   style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>{`Total Bills (No's)`}</Text>
                                   <Text style={{ color:'#000',fontWeight:'600',fontSize:16,}}>  :  {this.state.visit.totalBillN}</Text>
                                 </View>
                                 <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:5}}>
                                   <Text   style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>Visit Efficiency</Text>
                                   <Text style={{ color:'#000',fontWeight:'600',fontSize:16,}}>  :  {this.state.visit.visitEff}</Text>
                                 </View>
                             </View>
                          </View>
                      </View>
                    }



                    {this.state.orderValues!=null&&
                      <View style={[{marginTop:20,paddingHorizontal:15,paddingVertical:20,backgroundColor:'#fff',marginHorizontal:25,borderRadius:10}]}>
                          <View style={{flexDirection:'row',}}>
                             <View style={{flex:0.4,}}>
                               <Image source={require('../assets/order.png')} style={{resizeMode:'contain'}}/>
                               <Text   style={{ color:'#000',fontWeight:'600',fontSize:18,marginTop:5}} numberOfLines={1}>Order Values</Text>
                             </View>
                             <View style={{flex:0.6}}>
                                <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                                  <Text   style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>Last Bill</Text>
                                  <Text style={{ color:'#000',fontWeight:'600',fontSize:16,}}>  :  {this.state.orderValues.lastBill}</Text>
                                </View>
                                <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:5}}>
                                  <Text   style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>{`MTD Value`}</Text>
                                  <Text style={{ color:'#000',fontWeight:'600',fontSize:16,}}>  :  {this.state.orderValues.mtdV}</Text>
                                </View>
                                <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:5}}>
                                  <Text   style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>{`Target`}</Text>
                                  <Text style={{ color:'#000',fontWeight:'600',fontSize:16,}}>  :  {this.state.orderValues.target}</Text>
                                </View>
                                <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:5}}>
                                  <Text   style={{ color:'#000',fontWeight:'600',fontSize:16,}} numberOfLines={1}>% Acheived</Text>
                                  <Text style={{ color:'#000',fontWeight:'600',fontSize:16,}}>  :  {this.state.orderValues.acheived}</Text>
                                </View>
                             </View>
                          </View>
                      </View>
                    }

                    <View style={{marginTop:50,flex:1,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                       <TouchableOpacity style={{backgroundColor:themeColor,borderRadius:20,paddingVertical:8,paddingHorizontal:20,marginVertical:15}} onPress={()=>{this.props.navigation.navigate('Merchandise',{item:this.state.retailer})}}>
                          <Text style={{fontSize:16,color:'#fff',fontWeight:'700'}}>Merchandise</Text>
                       </TouchableOpacity>
                       <TouchableOpacity style={{backgroundColor:themeColor,borderRadius:20,paddingVertical:8,paddingHorizontal:20,marginVertical:15,marginLeft:15}} onPress={()=>{this.props.navigation.navigate('RetailerOrder',{item:this.state.retailer})}}>
                          <Text style={{fontSize:16,color:'#fff',fontWeight:'700'}}>Continue</Text>
                       </TouchableOpacity>
                    </View>


                  </ScrollView>
                </View>
              }
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

export default connect(mapStateToProps, mapDispatchToProps)(ReatilerDetails);
