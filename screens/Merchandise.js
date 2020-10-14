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
import * as Permissions from 'expo-permissions';
import * as  ImagePicker  from 'expo-image-picker';
import Modal from "react-native-modal";


const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
const themeColor = settings.themeColor
const SERVER_URL = settings.url


class Merchandise extends React.Component {

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
       images:[{uri:null}],
       openImageModal:false,
       comment:''
      }
    }


 componentDidMount(){

 }

 save = async()=>{
   var image1 = null
   var image2 = null
   var image3 = null
   this.state.images.forEach((i,idx)=>{
     if(i.uri!=null){
       if(idx==0){
         image1 = i
       }else if(idx==1){
         image2 = i
       }else{
         image3 = i
       }
     }
   })
   var sendData = {
     comment:this.state.comment,
     company:this.state.retailer.company,
     bodyType:'formData'
   }
   if(image1!=null){
     sendData.image1 = image1
   }
   if(image2!=null){
     sendData.image2 = image2
   }
   if(image3!=null){
     sendData.image3 = image3
   }
   console.log(sendData,'sendDatasendData');

   var data = await HttpsClient.post(SERVER_URL + '/api/ERP/merchandise/',sendData)
   console.log(data,'hjkkkkkkkkk');
   if(data.type=='success'){
     this.props.navigation.goBack()
   }else{
     return
   }
 }

 attachShow=async()=>{
  const { status, expires, permissions } = await Permissions.getAsync(
      Permissions.CAMERA_ROLL,
      Permissions.CAMERA
    );

    if(permissions.camera.status == 'granted'){
      if(permissions.cameraRoll.status == 'granted'){
        this.setState({openImageModal:true})
      }else{
        this.getCameraRollAsync()
      }
    }else{
      this.getCameraAsync()
    }
}

getCameraAsync=async()=> {

  const { status, permissions } = await Permissions.askAsync(Permissions.CAMERA);
  if (status === 'granted') {
    this.attachShow()
  } else {
    throw new Error('Camera permission not granted');
  }
}

getCameraRollAsync=async()=> {

  const { status, permissions } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (status === 'granted') {
  this.attachShow()
  } else {
  throw new Error('Gallery permission not granted');
  }
}

handlePhoto = async () => {
      let picture = await ImagePicker.launchCameraAsync({
          mediaTypes:ImagePicker.MediaTypeOptions.Images,
          quality: 0.1,
        });
      if(picture.cancelled == true){
        return
      }

      let filename = picture.uri.split('/').pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;

      const photo = {
      uri: picture.uri,
      type: type,
      name:filename,
      };
      var list = this.state.images
      this.setState({openImageModal:false})
      list.unshift(photo)
      this.setState({images:list})

}

_pickImage = async () => {

       let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true
       });

       let filename = result.uri.split('/').pop();
       let match = /\.(\w+)$/.exec(filename);
       var type = match ? `image/${match[1]}` : `image`;
       const photo = {
          uri: result.uri,
          type: type,
          name:filename,
       };
       var list = this.state.images
       this.setState({openImageModal:false})
       list.unshift(photo)
       this.setState({images:list})
  };

removeImage=(item,index)=>{
  var images = this.state.images
  images.splice(index,1)
  this.setState({images})
}

modalAttach =async (event) => {
        if(event == 'gallery') return this._pickImage();
        if(event == 'camera'){
            this.handlePhoto()
        }
    };

renderModal=()=>{
  return(
          <Modal
              isVisible={this.state.openImageModal}
              hasBackdrop={true}
              style={[styles.modalView1,{position:'absolute',bottom:-20,left:0,}]}
              onBackdropPress={()=>{this.setState({photoshoot:false});}} >
              <View style={{paddingVertical:width*0.01,}}>
                  <View style={{flexDirection:'row',height:width*0.25,justifyContent:'space-between',
                                borderWidth:0,backgroundColor:'transparent',borderRadius:0,paddingTop:width*0.05}}>
                        <TouchableOpacity
                                style={{alignItems:'center',justifyContent:'center',backgroundColor:'#fff',paddingHorizontal:4,
                                        paddingVertical:6,borderWidth:0,borderRadius:0}}
                                onPress={()=>{this.modalAttach('gallery')}}>
                                <FontAwesome
                                    name="folder"
                                    size={width*0.16}
                                    style={{marginRight:5,color:themeColor,
                                            textAlign: 'center',marginLeft:width*0.1}} />
                                    <Text   style={{fontSize:16,color:themeColor,textAlign:'center',marginLeft:width*0.1}}>Gallary</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                                style={{flexDirection: 'column',alignItems: 'center',
                                        justifyContent: 'center',backgroundColor:'#fff',
                                        paddingHorizontal:4,paddingVertical:6,borderWidth:0,borderRadius:0,}}
                                onPress={()=>{this.modalAttach('camera')}}>
                                <FontAwesome
                                    name="camera"
                                    size={width*0.14}
                                    style={{marginRight:5,color:themeColor,textAlign: 'center',
                                            marginRight:width*0.1}}
                                    />
                                <Text   style={{fontSize:16,color:themeColor,textAlign:'center',marginRight:width*0.1}}>camera</Text>
                        </TouchableOpacity>
                  </View>
             </View>
        </Modal>
  )
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

                  <ScrollView contentContainerStyle={{paddingBottom:0}}>

                  <View style={{marginVertical:20}}>
                      <View style={{marginHorizontal: 15,}}>
                        <Text style={{fontSize:18,fontWeight:'700',color:'#000',marginVertical:10}}>Add Images</Text>
                        <FlatList style={{margin:0,backgroundColor:'#e2e2e2',marginBottom: 10 , borderRadius:10,width:width-30}}
                        data={this.state.images}
                        showsVerticalScrollIndicator={false}
                        numColumns={3}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item,index) => {
                          return index.toString();
                        }}
                        nestedScrollEnabled={true}
                        renderItem={({item, index}) => (
                          <View style={{}}>
                          {item.uri!=null&&
                            <TouchableOpacity style={{borderRadius:10,backgroundColor:'transparent',marginLeft:10}} onPress={(index)=>this.removeImage(item,index)}>
                              <Image
                              source={{uri:item.uri}}
                              style={{ width: width*0.154, height:width*0.154, borderRadius: 10,marginLeft:index%3==0?0:width*0.03,marginTop:width*0.02,backgroundColor:'transparent' }}
                              />
                              <View style={{position: 'absolute',top:0,right:-10,width:20,height:20,backgroundColor: '#fa4616',alignItems: 'center',justifyContent: 'center',borderRadius:10}}>
                                <FontAwesome  name="close" size={15} color="#fff" />
                              </View>
                            </TouchableOpacity>
                          }
                          {this.state.images.length<4&&item.uri==null&&
                          <TouchableOpacity style={{borderRadius:10,marginLeft:10}} onPress={()=>{this.attachShow()}}>
                            <View style={{ width: width*0.154, height:width*0.154, borderRadius: 10,marginLeft:index%3==0?0:width*0.03,marginTop:width*0.02,backgroundColor: '#fff',alignItems: 'center',justifyContent: 'center',borderRadius:10}}>
                              <FontAwesome  name="plus" size={15} color="#000" />
                            </View>
                          </TouchableOpacity>
                        }
                         </View>
                        )}
                        />
                    </View>
                </View>

                <View style={{marginBottom:20,marginHorizontal: 15,}}>
                  <Text style={{fontSize:18,fontWeight:'700',color:'#000',marginVertical:10}}>Add Comment</Text>
                  <TextInput style={{backgroundColor:'#fff',marginTop:5,paddingVertical:5,paddingHorizontal:15,fontSize:16,borderWidth:1,borderColor:'#e2e2e2',borderRadius:0,textAlignVertical:'top'}}
                           onChangeText={(comment) => this.setState({comment})}
                           multiline={true}
                           numberOfLines={5}
                           value={this.state.comment}>
                  </TextInput>
                </View>


                    <View style={{marginTop:20,flex:1,alignItems:'center',justifyContent:'center'}}>
                       <TouchableOpacity style={{backgroundColor:themeColor,borderRadius:20,paddingVertical:8,paddingHorizontal:20,marginVertical:15}} onPress={()=>{this.save()}}>
                          <Text style={{fontSize:16,color:'#fff',fontWeight:'700'}}>Save</Text>
                       </TouchableOpacity>
                    </View>


                  </ScrollView>
                  {this.renderModal()}
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
  modalView1:{
     backgroundColor: '#fff',
     marginHorizontal: 0 ,
     borderTopLeftRadius:5,
     borderTopRightRadius:5,
     justifyContent: 'flex-end',
     width:width
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

export default connect(mapStateToProps, mapDispatchToProps)(Merchandise);
