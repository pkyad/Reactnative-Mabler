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
import {Fontisto, FontAwesome,Entypo,SimpleLineIcons,MaterialCommunityIcons,Feather,Octicons,MaterialIcons,FontAwesome5,AntDesign,EvilIcons } from '@expo/vector-icons';
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


class OrderDetail extends React.Component {

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
       retailerPk:retailer.pk,
       retailer:retailer,
       cart:[],
       totalAmount:0
      }

    }

    createOrder=async()=>{
      if(this.state.cart.length>0){
        var sendData = {
          retailer:this.state.retailerPk,
        }
        this.setState({showOptions:false})
        var data = await HttpsClient.post(url + '/api/ERP/createSaleOrder/',sendData)
        if(data.type=='success'){
          console.log(data,'vickyyyyyyy');
            if(data.data.success){
              this.props.navigation.goBack()
            }
        }else{
            return
        }
      }else{
        return
      }
    }

  getCart=async()=>{
    var data = await HttpsClient.get(url + '/api/ERP/cartService/?retailer='+this.state.retailerPk)
    if(data.type=='success'){
        if(data.data.success){
          console.log(data);
          this.setState({cart:data.data.records,totalAmount:data.data.total==null?0:data.data.total})
        }
    }else{
        return
    }
  }

 componentDidMount(){
    this.getCart()
 }

 itemHeader=()=>{
    return (
      <View style={{paddingVertical: 8,flex:1,backgroundColor:'#fff',flexDirection: 'row'}}>
          <View style={{flex:0.4,alignItems: 'center',justifyContent: 'center'}}>
            <Text  style={{fontSize: 14,fontWeight: '600',color:'#000',textAlign:'center'}}>Product Name</Text>
          </View>
          <View style={{flex:0.2,alignItems: 'center',justifyContent: 'center'}}>
            <Text  style={{fontSize: 14,fontWeight: '600',color:'#000',textAlign:'center'}}>Rate</Text>
          </View>
          <View style={{flex:0.2,alignItems: 'center',justifyContent: 'center'}}>
            <Text  style={{fontSize: 14,fontWeight: '600',color:'#000',textAlign:'center'}}>Qty</Text>
          </View>
          <View style={{flex:0.2,alignItems: 'center',justifyContent: 'center'}}>
            <Text  style={{fontSize: 14,fontWeight: '600',color:'#000',textAlign:'center'}}>Subtotal</Text>
          </View>
      </View>
    )
 }

  render() {
    return (
      <View style={{flex:1,backgroundColor:'#e2e2e2',zIndex:9}}>
          <TouchableWithoutFeedback onPress={()=>{this.setState({showOptions:false})}}>
            <View style={{flex:1,}}>
              <Headers navigation={this.props.navigation} name={this.state.retailer.name} screen={'OrderDetail'} notificationBack={'PageFirst'}/>
              {this.state.loader&&
                <Loader />
              }
              {!this.state.loader&&
                <View style={{flex:1,paddingTop:0,zIndex:9}}>
                  <ScrollView contentContainerStyle={{paddingBottom:60,}}>


                  {this.state.cart!=null&&
                    <View>

                      <FlatList style={{borderColor : '#fff' , borderWidth:0,margin:0,backgroundColor:'#fff',zIndex:9}}
                        data={this.state.cart}
                        keyExtractor={(item,index) => {
                          return index.toString();
                        }}
                        ListHeaderComponent={this.itemHeader}
                        nestedScrollEnabled={true}
                        renderItem={({item, index}) => (
                          <View style={{paddingVertical: 10,flex:1,backgroundColor:item.reverse?'#ffe6e6':'#e6ffe6',flexDirection: 'row',}}>
                            <View style={{flex:0.4,alignItems: 'center',justifyContent: 'center'}}>
                              <Text  style={{ fontSize: 16,fontWeight: '400',color:'#000',marginLeft:3}} >{item.product.name}</Text>
                            </View>
                            <View style={{flex:0.2,alignItems: 'center',justifyContent: 'center'}}>
                              <Text  style={{ fontSize: 16,fontWeight: '400',color:'#000'}}>{item.product.ptr}</Text>
                            </View>
                            <View style={{flex:0.2,alignItems: 'center',justifyContent: 'center'}}>
                              <Text  style={{ fontSize: 16,fontWeight: '400',color:'#000'}}>{item.qty}</Text>
                            </View>
                            <View style={{flex:0.2,alignItems: 'center',justifyContent: 'center'}}>
                              <Text  style={{ fontSize: 16,fontWeight: '400',color:'#000',}}>{item.total}</Text>
                            </View>
                          </View>
                        )}
                      />
                    </View>
                  }

                  </ScrollView>

                  <View style={{position:'absolute',bottom:0,right:0,left:0,height:60,}}>
                      <View style={{height:60,flexDirection:'row',backgroundColor:'#404040',borderTopRightRadius:15,borderTopLeftRadius:15}}>
                          <View style={{flex:0.4,alignItems:'center',justifyContent:'flex-start',flexDirection:'row',marginLeft:15}}>
                              <FontAwesome name="rupee" size={24} color="#fff" />
                              <Text style={{ fontSize: 18,fontWeight: '700',color:'#fff',marginLeft:10}}>{this.state.totalAmount}</Text>
                          </View>
                          <View style={{flex:0.6,justifyContent:'flex-end',alignItems:'center',flexDirection:'row'}}>
                             <TouchableOpacity onPress={()=>{this.props.navigation.goBack()}} style={{paddingVertical:5,paddingHorizontal:15,backgroundColor:'#000',marginRight:10,borderRadius:15}}>
                                <Text style={{ fontSize: 16,fontWeight: '400',color:'#fff'}}>Modify Order</Text>
                             </TouchableOpacity>
                             <TouchableOpacity onPress={()=>{this.createOrder()}} style={{paddingVertical:5,paddingHorizontal:15,backgroundColor:'#29900a',marginRight:10,borderRadius:15}}>
                                <Text style={{ fontSize: 16,fontWeight: '400',color:'#fff'}}>Confirm</Text>
                             </TouchableOpacity>
                          </View>
                      </View>
                  </View>
                </View>

              }
            </View>
          </TouchableWithoutFeedback>
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail);

// {
//   <View style={{flexDirection:'row',paddingVertical:10,paddingHorizontal:15}}>
//    <View style={{flex:1,alignItems:'flex-start'}}>
//       <Text  style={{ fontSize: 18,fontWeight: '600',color:'#000'}}>Order No  {this.state.orderDetail.pk}</Text>
//    </View>
//    <View style={{flex:1,alignItems:'flex-end'}}>
//       <Text  style={{ fontSize: 16,fontWeight: '600',color:'#000'}}>{moment(moment.utc(this.state.orderDetail.created).toDate()).local().format('DD-MM-YYYY')}</Text>
//    </View>
// </View>
// }
