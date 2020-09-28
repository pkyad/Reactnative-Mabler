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
import {Fontisto, FontAwesome,Entypo,SimpleLineIcons,MaterialCommunityIcons,Feather,Octicons,MaterialIcons,FontAwesome5,EvilIcons } from '@expo/vector-icons';
import  Constants  from 'expo-constants';
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import * as actionTypes from '../actions/actionTypes';
import TabComponent  from '../navigationComponents/TabComponent.js';
import Headers  from '../helpers/Headers.js';
import settings from '../appSettings';
import HttpsClient from '../helpers/HttpsClient';
import moment from 'moment';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
const themeColor = settings.themeColor
const url = settings.url


class Visits extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    return {header:null}
  };

  constructor(props) {
    super(props);
    this.state={
        retailers:[],
        reatilerItems:[],
        retailersCount:0,
        visits:[],
        visitsCount:0,
        searchText:''
      }
    }

    getRetailer=async()=>{
      var data = await HttpsClient.get(url + '/api/ERP/retailerSearch/?search=')
      if(data.type=='success'){
        console.log(data);
          if(data.data.success){
            this.setState({retailers:data.data.records,reatilerItems:data.data.records,retailersCount:data.data.count})
          }
      }else{
          return
      }
    }
    searchRetailer=async(query)=>{
      this.setState({ searchText: query })
      if(query.length>0){
        var data = await HttpsClient.get(url + '/api/ERP/retailerSearch/?search='+query)
        if(data.type=='success'){
          console.log(data);
            if(data.data.success){
              this.setState({reatilerItems:data.data.records})
            }else{
              this.setState({reatilerItems:this.state.retailers})
            }
        }else{
            this.setState({reatilerItems:this.state.retailers})
        }
      }else{
        this.setState({reatilerItems:this.state.retailers})
      }
    }

    getVisits=async()=>{
      var data = await HttpsClient.get(url + '/api/ERP/frontlinerVisit/')
      if(data.type=='success'){
        console.log(data);
          if(data.data.success){
            this.setState({visits:data.data.records,visitsCount:data.data.count})
          }
      }else{
          return
      }
    }

   componentDidMount(){
      this.getRetailer()
      this.getVisits()
   }

  render() {
    return (
      <View style={{flex:1,backgroundColor:'#e2e2e2'}}>
          <Headers navigation={this.props.navigation} name={'My Visits'} screen={'Visits'}/>
          <View style={{flex:1,}}>
            <View style={{paddingVertical:15,paddingBottom:5}}>
                <Text style={{fontSize:18,color:'#000',fontWeight:'700',textAlign:'center'}}>{`Today's plan`} - {this.state.visitsCount} visits</Text>
                <Text style={{fontSize:16,color:'#000',fontWeight:'600',marginTop:5,textAlign:'center'}}>{moment(moment.utc(new Date()).toDate()).local().format('dddd')} , {moment(moment.utc(new Date()).toDate()).local().format('DD MMM YY')}</Text>
                <View style={[{marginTop:15,paddingVertical:10,backgroundColor:'#fff',marginHorizontal:25,borderRadius:10,paddingHorizontal:20}]}>
                    <View style={{flexDirection:'row',}}>
                       <View style={{flex:1,flexDirection:'row'}}>
                         <View style={{justifyContent:'center'}}>
                           <EvilIcons name="search" size={24} color="black" />
                         </View>
                         <TextInput style={{width:'100%',borderRadius:0,color:'grey',fontSize:16,marginLeft:5,height:'100%'}}
                             placeholder="Search for Retailer (All Stores)"
                             selectionColor={'grey'}
                             onChangeText={query => {this.searchRetailer(query); }}
                             value={this.state.searchText}
                          />
                       </View>
                    </View>
                </View>
            </View>
            <View style={{flex:1,}}>
              <ScrollView contentContainerStyle={{paddingBottom:75}}>

                  {this.state.reatilerItems.map((i,index)=>{
                    return(
                      <TouchableOpacity onPress={()=>{this.props.navigation.navigate('RetailerDetails',{item:i})}} style={[{marginTop:15,paddingVertical:15,backgroundColor:'#fff',marginHorizontal:25,borderRadius:10,paddingHorizontal:20}]}>
                          <View style={{flexDirection:'row',}}>
                             <View style={{flex:1}}>
                               <Text   style={{ color:'#000',fontWeight:'700',fontSize:16,}} numberOfLines={1}>{i.name}</Text>
                             </View>
                          </View>
                      </TouchableOpacity>
                    )
                  })}

              </ScrollView>
            </View>
          </View>
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

  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Visits);
