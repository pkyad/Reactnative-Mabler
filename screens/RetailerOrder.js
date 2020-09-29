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
import { withNavigationFocus } from 'react-navigation';
import { FloatingAction } from "react-native-floating-action";


const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
const themeColor = settings.themeColor
const url = settings.url
const floatingActions = [
  {
    text: "Performance",
    icon: require("../assets/list.png"),
    name: "bt_accessibility",
    position: 1
  },
  {
    text: "Retailer's Details",
    icon: require("../assets/list.png"),
    name: "bt_language",
    position: 2
  },
  {
    text: "Feedback",
    icon: require("../assets/list.png"),
    name: "bt_room",
    position: 3
  },
];

class RetailerOrder extends React.Component {

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
       retailer:retailer,
       cart:[],
       searchText:'',
       showList:false,
       listItems:[],
       selectedItem:null,
       showOptions:false,
       focusProducts:[],
       totalAmount:0,
       lastOrder:null,
       cartSelected:{pk:undefined},
       cartQty:0,
       showZindex:true
      }
      willFocus = props.navigation.addListener(
     'willFocus',
       payload => {
         this.getLastOrder()
         this.getCart()
       }
      );
    }

getLastOrder=async()=>{
  var data = await HttpsClient.get(url + '/api/ERP/retailerLastOrder/?retailer='+this.state.retailerPk)
  if(data.type=='success'){
      console.log(data,'order');
      if(data.data.success){
        this.setState({lastOrder:data.data.records})
      }
  }else{
      return
  }
}

getCart=async()=>{
  var data = await HttpsClient.get(url + '/api/ERP/cartService/?retailer='+this.state.retailerPk)
  if(data.type=='success'){
      if(data.data.success){
        this.setState({cart:data.data.records,totalAmount:data.data.total==null?0:data.data.total})
      }
  }else{
      return
  }
}

getFocusItems=async()=>{
  var data = await HttpsClient.get(url + '/api/ERP/productsList/?focus=true')
  if(data.type=='success'){
      this.setState({listItems:data.data,focusProducts:data.data})
      if(data.data.length>0){
        this.setState({showList:true})
      }
  }else{
      return
  }
}

 componentDidMount(){
    this.getLastOrder()
    this.getCart()
    this.getFocusItems()
 }

 search=async(text)=>{
  this.setState({showOptions:false,searchText:text,})
  if(text.length>0){
    var data = await HttpsClient.get(url + '/api/ERP/productsList/?name__icontains='+text)
    if(data.type=='success'){
        this.setState({listItems:data.data,showList:true})
    }else{
      this.setState({listItems:this.state.focusProducts})
        return
    }
  }else{
    this.setState({listItems: this.state.focusProducts,})
    return
  }
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
            <Text  style={{fontSize: 14,fontWeight: '600',color:'#000',textAlign:'center'}}>Stock</Text>
          </View>
          <View style={{flex:0.2,alignItems: 'center',justifyContent: 'center'}}>
            <Text  style={{fontSize: 14,fontWeight: '600',color:'#000',textAlign:'center'}}>Qty</Text>
          </View>
      </View>
    )
 }

 addCart=async(reverse)=>{
   var sendData = {
     retailer:this.state.retailerPk,
     product:this.state.selectedItem.pk,
     qty:1
   }
   if(reverse){
     sendData.reverse = true
   }
   this.setState({showOptions:false})
   var data = await HttpsClient.post(url + '/api/ERP/cartService/',sendData)
   if(data.type=='success'){
       if(data.data.success){
         this.getCart()
       }
   }else{
       return
   }
 }

 cartQuantity=async()=>{
   var sendData = {
     retailer:this.state.retailerPk,
     product:this.state.cartSelected.product.pk,
     qty:this.state.cartQty,
     reverse:this.state.cartSelected.reverse
   }
   var data = await HttpsClient.post(url + '/api/ERP/cartService/',sendData)
   console.log(data,'tcf');
   if(data.type=='success'){
       if(data.data.success){
         this.setState({cartSelected:{qty:undefined,cartQty:0}})
         this.getCart()
       }
   }else{
       return
   }
 }

 createOrder=()=>{
   if(this.state.cart.length>0){
      this.props.navigation.navigate('OrderDetail',{item:this.state.retailer})
   }else{
     return
   }
 }


 renderLastOrder=()=>{
   if(this.state.lastOrder==null){
     return null
   }else{
     var order = this.state.lastOrder
     return(
       <View style={{flexDirection:'row',margin:15,}}>
         <View style={{flex:0.28,backgroundColor:'#fff',padding:10,marginHorizontal:3,borderRadius:10}}>
           <View style={{flex:1,borderBottomWidth:1,borderColor:'grey',alignItems:'center',justifyContent:'center'}}>
               <Text style={{textAlign:'center',fontSize:14,color:'#000',marginBottom:2,}}>Last Visit</Text>
           </View>
           <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
               <Text style={{textAlign:'center',fontSize:14,color:'#000'}}>{moment(moment.utc(order.created).toDate()).local().format('DD MMM')}</Text>
           </View>
         </View>
         <View style={{flex:0.28,backgroundColor:'#fff',padding:10,marginHorizontal:3,borderRadius:10}}>
           <View style={{flex:1,borderBottomWidth:1,borderColor:'grey',alignItems:'center',justifyContent:'center',}}>
               <Text style={{textAlign:'center',fontSize:14,color:'#000',marginBottom:2,}}>Last Order</Text>
           </View>
           <View style={{flex:1,alignItems:'center',justifyContent:'center',}}>
               <Text style={{textAlign:'center',fontSize:14,color:'#000'}}>{moment(moment.utc(order.created).toDate()).local().format('DD MMM')}</Text>
           </View>
         </View>
         <View style={{flex:0.44,backgroundColor:'#fff',padding:10,marginHorizontal:3,borderRadius:10}}>
           <View style={{flex:1,borderBottomWidth:1,borderColor:'grey',alignItems:'center',justifyContent:'center',}}>
               <Text style={{textAlign:'center',fontSize:14,color:'#000',marginBottom:2,}}>Last Order Value</Text>
           </View>
           <View style={{flex:1,alignItems:'center',justifyContent:'center',}}>
               <Text style={{textAlign:'center',fontSize:14,color:'#000'}}>{order.total}</Text>
           </View>
         </View>
       </View>
     )
   }
 }

 changeQty=(item)=>{
   this.setState({cartSelected:item,cartQty:item.qty})

 }

  render() {
    return (
      <View style={[{flex:1,backgroundColor:'#e2e2e2',}]}>
          <TouchableWithoutFeedback onPress={()=>{this.setState({showOptions:false})}}>
            <View style={{flex:1,}}>
              <Headers navigation={this.props.navigation} name={this.state.retailer.name} screen={'RetailerOrder'}/>
              {this.state.loader&&
                <Loader />
              }
              {!this.state.loader&&
                <View style={[{flex:1,paddingTop:0,}]}>
                  <ScrollView contentContainerStyle={{paddingBottom:230,}}>

                  {this.renderLastOrder()}

                  {this.state.cart.length>0&&
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
                            <Text  style={{ fontSize: 16,fontWeight: '400',color:'#000',marginLeft:3}} >{item.product.name}{item.reverse}</Text>
                          </View>
                          <View style={{flex:0.2,alignItems: 'center',justifyContent: 'center'}}>
                            <Text  style={{ fontSize: 16,fontWeight: '400',color:'#000'}}>{item.total}</Text>
                          </View>
                          <View style={{flex:0.2,alignItems: 'center',justifyContent: 'center'}}>
                            <Text  style={{ fontSize: 16,fontWeight: '400',color:'#000'}}>{item.stock}</Text>
                          </View>
                          <View style={{flex:0.2,alignItems: 'center',justifyContent: 'center'}}>
                            {this.state.cartSelected.pk==item.pk&&
                              <TextInput style={{width:'70%',borderRadius:0,color:'#000',fontSize:16,height:30,backgroundColor:'#fff',textAlign:'center'}}
                                  onChangeText={query => {this.setState({cartQty:query}) }}
                                  autoFocus={true}
                                  onBlur={()=>{this.cartQuantity()}}
                                  value={this.state.cartQty.toString()}
                                  keyboardType={'numeric'}
                               />
                            }
                            {this.state.cartSelected.pk!=item.pk&&
                               <TouchableOpacity onPress={()=>{this.changeQty(item)}} style={{width:'70%',borderRadius:0,height:30,backgroundColor:'#fff',alignItems: 'center',justifyContent: 'center'}}>
                                  <Text  style={{ fontSize: 16,fontWeight: '400',color:'#000'}}>{item.qty}</Text>
                               </TouchableOpacity>
                            }

                          </View>
                        </View>
                      )}
                    />
                  }

                  </ScrollView>

                  {this.state.showOptions&&
                    <View style={{position:'absolute',right:10,bottom:163,zIndex:9999,width:width*0.3}}>

                     <View style={[styles.shadow,{flex:1,backgroundColor:'#fff',}]} >
                        <TouchableOpacity onPress={()=>{this.addCart(false)}}  style={{height:40,alignItems:'center',justifyContent:'center',borderBottomWidth:1,borderColor:'grey'}}>
                           <Text style={{color:themeColor,}} >Add</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{this.addCart(true)}} style={{height:40,alignItems:'center',justifyContent:'center',borderBottomWidth:1,borderColor:'grey'}}>
                           <Text style={{color:'red',}} >Return</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{}} style={{height:40,alignItems:'center',justifyContent:'center'}}>
                           <Text style={{color:'#000',}} >Details</Text>
                        </TouchableOpacity>
                     </View>

                  </View>
                }

                  {this.state.showList&&
                    <View style={{position:'absolute',bottom:103,left:10,right:10,marginVertical:10,marginBottom:3,zIndex:99}}>

                     <View style={{zIndex:999,flex:1,flexDirection:'row',borderRadius:20,maxHeight:120,backgroundColor:'#fff',borderRadius:20,borderWidth:1,borderColor:'#e2e2e2'}}>
                     <FlatList
                         data={this.state.listItems}
                         extraData={this.state}
                         inverted={false}
                         scrollToEnd={true}
                         horizontal={false}
                         nestedScrollEnabled={true}
                         keyExtractor={(item, index) => index.toString()}
                         renderItem={({item, index})=>(
                           <TouchableOpacity onPress={()=>{if(this.state.showOptions){this.setState({showOptions:false,})}else{this.setState({selectedItem:item,showOptions:true})}}}  style={{minHeight:40,flexDirection:'row'}}>
                              <View style={{flex:0.25,justifyContent:'center',alignItems:'center'}}>
                                 <Text style={{ fontSize: 14,fontWeight: '600',color:'grey',}}>{item.sku}</Text>
                              </View>
                              <View style={{flex:0.55,justifyContent:'center'}}>
                                 <Text style={{ fontSize: 14,fontWeight: '600',color:'#000',}} numberOfLines={1}>{item.name}</Text>
                              </View>
                              <View style={{flex:0.2,justifyContent:'center',alignItems:'center'}}>
                                 <Text style={{ fontSize: 14,fontWeight: '600',color:'#000',}}>&#8377; {item.ptr}</Text>
                              </View>
                            </TouchableOpacity>
                         )}
                         />
                      </View>
                    </View>
                    }

                  <View style={{position:'absolute',bottom:0,right:0,left:0,height:103,}}>

                     <View style={{flexDirection:'row',borderRadius:20,height:40,marginBottom:3}}>
                         <View style={{flex:1,alignItems:'flex-start',justifyContent:'center',backgroundColor:'#fff',marginHorizontal:10,borderRadius:15}} >
                           <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',}}>
                             <View style={{marginLeft:15}}>
                               <FontAwesome name={'search'} color={'grey'} size={20} />
                             </View>
                             <TextInput
                               placeholder={'Search more products here'}
                               ref={input => { this.inputRef = input }}
                               style={{ height: 40,marginLeft:10,flex:1 }}
                               onChangeText={text => {this.search(text)}}
                               value={this.state.searchText}
                             />
                           </View>
                         </View>
                     </View>
                      <View style={{height:60,flexDirection:'row',backgroundColor:'#404040',borderTopRightRadius:15,borderTopLeftRadius:15}}>
                         <View style={{flex:0.3,zIndex:99999}}>
                          <FloatingAction
                              distanceToEdge={{vertical:10,horizontal:15}}
                              showBackground={false}
                              color={'#404040'}
                              zIndex={9999999}
                              buttonSize={40}
                              position={'left'}
                              actions={floatingActions}
                              onOpen={()=>{this.setState({showList:false,showOptions:false,setZindex:0})}}
                              onClose={()=>{this.setState({setZindex:99})}}
                              onPressItem={name => {
                                console.log(`selected button: ${name}`);
                              }}
                            />
                          </View>

                          <View style={{flex:0.4,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                              <FontAwesome name="rupee" size={24} color="#fff" />
                              <Text style={{ fontSize: 18,fontWeight: '700',color:'#fff',marginLeft:10}}>{this.state.totalAmount}</Text>
                          </View>
                          <View style={{flex:0.3,justifyContent:'center',alignItems:'flex-end'}}>
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
  showZindex:{
    zIndex:99
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(RetailerOrder);

// <TouchableOpacity onPress={()=>{}} style={{flex:0.3,justifyContent:'center',alignItems:'flex-start',marginLeft:15}}>
//     <AntDesign name="plus" size={24} color="#fff" />
// </TouchableOpacity>
