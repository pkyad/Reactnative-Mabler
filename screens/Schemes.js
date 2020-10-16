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
  ToastAndroid,RefreshControl,TouchableWithoutFeedback,TouchableNativeFeedback,} from 'react-native';
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


class Schemes extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {header:null}
  };

  constructor(props) {
    super(props);
    var retailer = this.props.navigation.getParam('item',null)
    var product = this.props.navigation.getParam('product',null)
    this.state={
       loader:false,
       user:props.user,
       schemes:[],
       visit:null,
       retailerPk:retailer.pk,
       retailer:retailer,
       product:product,
      }
    }

getSchemes=async()=>{

  var serverUrl = url + '/api/ERP/scheme/?company='+this.state.retailer.company
  if(this.state.product!=null){
    serverUrl =  url + '/api/ERP/scheme/?company='+this.state.retailer.company+'&product='+this.state.product.product.pk
  }
  var data = await HttpsClient.get(serverUrl)
  if(data.type=='success'){
    console.log(data.data);
    this.setState({schemes:data.data})
  }else{
      return
  }
}

 componentDidMount(){
    this.getSchemes()
 }



  render() {
    return (
      <View style={{flex:1,backgroundColor:'#e2e2e2'}}>
              <Headers navigation={this.props.navigation} name={this.state.retailer.name} screen={'RetailerDetails'} notificationBack={'PageFirst'}/>
              {this.state.loader&&
                <Loader />
              }
              {!this.state.loader&&
                <View style={{flex:1,paddingTop:0}}>
                  <View style={{padding:15,}}>
                      <Text style={{fontSize:20,color:'#000',fontWeight:'700',}}>SCHEMES</Text>
                  </View>

              <ScrollView contentContainerStyle={{}}>

                      <FlatList style={{borderWidth:0,margin:0,backgroundColor:'#e2e2e2',marginVertical: 0,paddingBottom:0,paddingHorizontal:0,paddingVertical:10}}
                      contentContainerStyle={{paddingBottom:20}}
                      data={this.state.schemes}
                      keyExtractor={(item,index) => {
                        return index.toString();
                      }}
                      horizontal={false}
                      extraData={this.state.schemes}
                      nestedScrollEnabled={true}
                      renderItem={({item, index}) =>{
                        console.log(index);
                        return(
                          <TouchableWithoutFeedback  onPress={()=>{}}>
                            <View style={{paddingVertical:10,paddingHorizontal:15,marginHorizontal:15,backgroundColor:'#fff',borderRadius:10}}>
                                  <View style={{width:'100%',}}>
                                     <View style={{flexDirection:'row',}}>
                                        <View style={{flex:0.5,alignItems:'flex-start'}}>
                                          <Text  style={{ color:'#000',fontWeight:'600',fontSize:18,textAlign:'center',}} numberOfLines={1}></Text>
                                        </View>
                                        <View style={{flex:0.5,alignItems:'flex-end'}}>
                                          <Text  style={{ color:'#f00',fontWeight:'600',fontSize:13,textAlign:'center',}} numberOfLines={1}>Till  {moment(moment.utc(item.endDate).toDate()).local().format('DD MMMM YYYY')}</Text>
                                        </View>
                                     </View>
                                     <View style={{paddingVertical:8}}>
                                        <Text  style={{ color:'#f00',fontWeight:'600',fontSize:15,}} >{item.title}</Text>
                                     </View>
                                     <View style={{}}>
                                        <Text  style={{ color:'#000',fontWeight:'600',fontSize:16,}} >{item.description}</Text>
                                     </View>
                                  </View>
                            </View>
                          </TouchableWithoutFeedback>
                      )
                    }}
                  />
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

export default connect(mapStateToProps, mapDispatchToProps)(Schemes);
