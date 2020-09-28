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
import {Fontisto, FontAwesome,Entypo,SimpleLineIcons,MaterialCommunityIcons,Feather,Octicons,MaterialIcons,FontAwesome5,AntDesign } from '@expo/vector-icons';
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
       focusProducts:[]
      }
    }

getLastOrder=async()=>{
  var data = await HttpsClient.get(url + '/api/ERP/retailerLastOrder/?retailer='+this.state.retailerPk)
  if(data.type=='success'){
      console.log(data,'order');
      if(data.data.success){
        // this.setState({})
      }
  }else{
      return
  }
}

getCart=async()=>{
  var data = await HttpsClient.get(url + '/api/ERP/cartService/?retailer='+this.state.retailerPk)
  if(data.type=='success'){
      console.log(data,'cart');
      if(data.data.success){
        this.setState({cart:data.data.records})
      }
  }else{
      return
  }
}

getFocusItems=async()=>{
  var data = await HttpsClient.get(url + '/api/ERP/productsList/?focus=true')
  if(data.type=='success'){
      console.log(data,'cart');
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
  this.setState({searchText:text,})
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

 addCart=async()=>{
   var data = await HttpsClient.post(url + '/api/ERP/cartService/?retailer='+this.state.retailerPk)
   if(data.type=='success'){
       console.log(data,'cart');
       if(data.data.success){
         this.setState({cart:data.data.records})
       }
   }else{
       return
   }
 }

  render() {
    return (
      <View style={{flex:1,backgroundColor:'#e2e2e2'}}>
              <Headers navigation={this.props.navigation} name={this.state.retailer.name} screen={'RetailerOrder'}/>
              {this.state.loader&&
                <Loader />
              }
              {!this.state.loader&&
                <View style={{flex:1,paddingTop:0}}>
                  <ScrollView contentContainerStyle={{paddingBottom:100}}>

                  <FlatList style={{borderColor : '#fff' , borderWidth:2,margin:0,backgroundColor:'#fff',}}
                      data={this.state.cart}
                      keyExtractor={(item,index) => {
                        return index.toString();
                      }}
                      ListHeaderComponent={this.itemHeader}
                      nestedScrollEnabled={true}
                      renderItem={({item, index}) => (
                        <View style={{paddingVertical: 10,flex:1,backgroundColor:'#e2e2e2',flexDirection: 'row',borderRightWidth: 1,borderLeftWidth: 1,borderColor: '#000'}}>
                          <View style={{flex:0.4,alignItems: 'center',justifyContent: 'center'}}>
                            <Text  style={{ fontSize: 18,fontWeight: '400',color:'#000'}}></Text>
                          </View>
                          <View style={{flex:0.2,alignItems: 'center',justifyContent: 'center'}}>
                            <Text  style={{ fontSize: 18,fontWeight: '400',color:'#000'}}></Text>
                          </View>
                          <View style={{flex:0.2,alignItems: 'center',justifyContent: 'center'}}>
                            <Text  style={{ fontSize: 18,fontWeight: '400',color:'#000'}}></Text>
                          </View>
                          <View style={{flex:0.2,alignItems: 'center',justifyContent: 'center'}}>
                            <Text  style={{ fontSize: 18,fontWeight: '400',color:'#000'}}></Text>
                          </View>
                        </View>
                      )}
                    />

                  </ScrollView>

                  {this.state.showList&&
                    <View style={{position:'absolute',bottom:100,left:10,right:10,marginVertical:10,marginBottom:5,zIndex:99}}>
                     <View style={{zIndex:999,flex:1,flexDirection:'row',borderRadius:20,maxHeight:160,backgroundColor:'#fff',borderRadius:20,borderWidth:1,borderColor:'#e2e2e2'}}>
                     <FlatList
                         data={this.state.listItems}
                         extraData={this.state}
                         inverted={false}
                         scrollToEnd={true}
                         horizontal={false}
                         nestedScrollEnabled={true}
                         keyExtractor={(item, index) => index.toString()}
                         renderItem={({item, index})=>(
                           <TouchableOpacity onPress={()=>{this.setState({selectedItem:item,showOptions:true})}}  style={{minHeight:40,flexDirection:'row'}}>
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

                  <View style={{position:'absolute',bottom:0,right:0,left:0,height:100,}}>

                     <View style={{flexDirection:'row',borderRadius:20,height:40,}}>
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
                          <TouchableOpacity onPress={()=>{}} style={{flex:0.3,justifyContent:'center',alignItems:'flex-start',marginLeft:15}}>
                              <AntDesign name="plus" size={24} color="#fff" />
                          </TouchableOpacity>
                          <View style={{flex:0.4,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                              <FontAwesome name="rupee" size={24} color="#fff" />
                              <Text style={{ fontSize: 18,fontWeight: '700',color:'#fff',marginLeft:10}}>5300</Text>
                          </View>
                          <View style={{flex:0.3,justifyContent:'center',alignItems:'flex-end'}}>
                             <TouchableOpacity style={{paddingVertical:5,paddingHorizontal:15,backgroundColor:'#29900a',marginRight:10,borderRadius:15}}>
                                <Text style={{ fontSize: 16,fontWeight: '400',color:'#fff'}}>Confirm</Text>
                             </TouchableOpacity>
                          </View>
                      </View>
                  </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(RetailerOrder);
