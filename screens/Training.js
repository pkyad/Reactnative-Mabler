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
import HttpsClient from '../helpers/HttpsClient';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
const themeColor = settings.themeColor
const url = settings.url

class Training extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {header:null}
  };

  constructor(props) {
    super(props);

    this.state={
        user:props.user,
        loader:false,
        data:[],
      }
      willFocus = props.navigation.addListener(
     'willFocus',
       payload => {
         this.getMerchandise()
       }
      );
    }

    componentDidMount(){
      this.getMerchandise()
    }

    getMerchandise=async()=>{
      var data = await HttpsClient.get(url + '/api/ERP/merchandise/?company='+this.state.user.profile.empCompany)
      if(data.type=='success'){
            this.setState({data:data.data})
      }else{
          return
      }
    }

  renderHeader=()=>{
    var user = this.state.user
    var name = user.first_name
    var displayPicture = user.profile.displayPicture==null?'':user.profile.displayPicture

    return(
      <View style={{position:'absolute',top:Constants.statusBarHeight,height:55,left:0,width:'100%',zIndex:99}}>
      <View style={{flex:1,backgroundColor:themeColor,borderBottomLeftRadius:30,borderBottomRightRadius:30,}}>
          <View style={{flexDirection: 'row',flex:0.3,}}>
            <View style={{ flex: 0.2, flexDirection: 'row', justifyContent: 'center',alignItems: 'center', }}>
               <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Home')}} style={{paddingHorizontal: 15,paddingVertical:15,}}>
                 <MaterialIcons name={'arrow-back'} size={22} color={'#fff'}/>
               </TouchableOpacity>
            </View>
            <View style={{ flex: 0.6, flexDirection: 'row', justifyContent: 'center',alignItems: 'center', }}>
              <Text   style={{ color:'#fff',fontWeight:'700',fontSize:18,textAlign:'center',}} numberOfLines={1}>Training</Text>
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
          <Headers navigation={this.props.navigation} name={'Training'} screen={'Training'} notificationBack={'Training'}/>
          {this.state.loader&&
            <Loader />
          }
          {!this.state.loader&&
            <View style={{flex:1,paddingTop:Constants.statusBarHeight}}>
              <ScrollView contentContainerStyle={{paddingBottom:55,}}>
              <FlatList style={{borderColor : '#fff' , borderWidth:0,margin:0,backgroundColor:'#e2e2e2',zIndex:9,}}
                data={this.state.data}
                keyExtractor={(item,index) => {
                  return index.toString();
                }}
                nestedScrollEnabled={true}
                renderItem={({item, index}) =>{
                  console.log(item,'hsanlfjnjlk');
                  return (
                    <View style={{marginHorizontal:15,marginVertical:8,flex:1,backgroundColor:'#fff',borderWidth:0.5,borderColor:'#fff',borderRadius:10}}>
                        <View style={{width:'100%',height:150}}>
                          <Image source={{uri:item.image1}} style={{ width: '100%', height:150, borderTopLeftRadius: 10,borderTopRightRadius: 10,backgroundColor:'transparent' }}  />
                        </View>
                        <View style={{paddingVertical: 10,paddingHorizontal:15}}>
                            <Text style={{color:'#000',fontSize:18}}>{item.comment}
                            </Text>
                        </View>
                    </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(Training);
