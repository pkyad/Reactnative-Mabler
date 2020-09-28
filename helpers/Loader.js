import React, { Component }  from 'react';
import {ActivityIndicator, Alert, ScrollView,View }   from 'react-native';
import settings from '../appSettings';
const themeColor = settings.themeColor

function Loader(){
  return(
    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
      <ActivityIndicator size={'large'} color={themeColor} />
    </View>
  )
}


export default Loader  
