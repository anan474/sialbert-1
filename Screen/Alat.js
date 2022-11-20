import React, {useContext} from 'react';
import { StyleSheet, Alert, Text, View, Image, FlatList, TextInput, SafeAreaView, TouchableOpacity, Dimensions, ImageBackground, Button } from "react-native";
import { useState, useEffect } from "react";

import { ScrollView } from "react-native-gesture-handler";
import { Asset } from 'expo-asset';
import { AntDesign } from '@expo/vector-icons'
import ActivityIndicatorExample  from "../components/ActivityIndicatorExample";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from '../components/CredentialsContext';
import { StatusBar } from 'expo-status-bar';

import Notif from "../assets/image/notif.png";
import Cart from "../assets/image/cart.png";
import Search from "../assets/image/search_icon.png";
import illus from "../assets/image/illustrasi.png";
import FloatingTabBar from "../components/FloatingTabBar";
import More from "../assets/image/more.png";
import Icon from 'react-native-vector-icons/Ionicons';
import { CartContext } from './../components/CartContext';
import { useIsFocused } from '@react-navigation/native';

const win = Dimensions.get("window");

export default function MenuUtama({navigation}) {
  // const {nama, email} = route.params;
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [text, setText] = useState('');
  const [cari, setCari] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
  const {nama, email} = storedCredentials;
  const {items, setItems} = useContext(CartContext);
  const isFocused = useIsFocused();

  const handleLoadMore = () => {
      setPage(page+1)
    // {page: page+1},
    // data
  }

  useEffect(async() => {
    let isMounted = true
    setIsLoading(true);
    fetch('https://sialbert.000webhostapp.com/teknisi/equipments')
      .then((response) => response.json())
      .then((hasil) => {
        setData(hasil);
        setCari(hasil);
        setIsLoading(false);
      })
      // .finally(() => setLoading(false));
      .catch(error => { console.log; });
  }, [isFocused]);

  // useEffect(() => {
  //   setLoading(true);
  //   getEquipments();
  // }, []);

  const cariData = (text) => {
    const newData = cari.filter((item) => {
      const itemData = item.nama_alat.toLowerCase();
      const textData = text.toLowerCase();
      return itemData.indexOf(textData) > -1;
    });
    setData(newData);
    setText(text);
  };

  const ItemDivider = () =>{
    return(
      <View style={{ height:2, width: '100%', backgroundColor: "#C4C4C4", alignItems:'center', opacity:0.4 }}/>
    )
  }

  const renderFooter = () => {
    return (
      //Footer View with Load More button
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={data}
          //On Click of button load more data
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>Load More</Text>
          {isLoading ? (
            <ActivityIndicator
              color="white"
              style={{marginLeft: 8}} />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  };

  const listEquipments = ({item}) => {
    const photo ='https://sialbert.000webhostapp.com/' +item.foto + '/' +item.foto
    return (
      <>
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Detail', {alat: item}
            )}
          >
            <View style={{ flexDirection:'row', textAlign:'center', textAlignVertical: 'center'}}>
              <View style={{ flexDirection:'row', margin:16, textAlign:'center', textAlignVertical: 'center',justifyContent: 'center' }}>
                <Image source={{uri: photo}} style={styles.myequipmentImage} />
                <Text style={{ marginTop: '23%', textAlign:'center', justifyContent:'center', marginLeft:16 }}>{item.nama_alat}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </>
    );
  }
  // const getItemCount = (data) => 20

  // const getItem = (data, index) => ({
  //   key:index,
  //   id: Math.random().toString(12).substring(0),
  // })

  return (
    <>
      <View style={{ backgroundColor: '#FFFFFF' }}>
        <View style={styles.headerContainer}>
          <Icon name="notifications" size={28} color='#ffcd04'/>
          <Text style={styles.textHeader}>SI-ALBERT</Text>
          <TouchableOpacity style={{ padding: 5 }} onPress={() => {navigation.navigate('Cart')}}>
            <View style={{ position: 'absolute', height: 25, width: 25, borderRadius: 15, backgroundColor: 'green', right: 18, bottom: 18, alignItems: 'center', justifyContent: 'center', zIndex:2000 }}>
                <Text>{items.length}</Text>
            </View>
            <Icon name="ios-cart" size={28} color='black'/>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <View style={styles.textInput}>
            <Image style={styles.btnSearch} source={Search} />
            <TextInput
              onChangeText={(text) => cariData(text)}
              value={text}
              placeholder="Cari nama alat..."
            />
          </View>
          <SafeAreaView style={{ marginBottom: 150, justifyContent: 'center', flexDirection: "row", flex:1}}>
            {isLoading ?
              <View style={{
                justifyContent: 'center',
                textAlign: 'center',
                textAlignVertical: 'center',
                marginTop:0,
                textAlign: 'center',
                flex: 1,
                alignItems: 'center'
              }}>
                <ActivityIndicatorExample style={ styles.progress }/>
              </View> : (
              <FlatList
                data={data}
                vertical
                key={1}
                numColumns={1}
                nestedScrollEnabled
                // fadingEdgeLength={10}
                ItemSeparatorComponent={ItemDivider}
                keyExtractor={item=>item.id_alat}
                renderItem={listEquipments}
                onEndReached={renderFooter}
                onEndReachedThreshold={0.5}
                extraData={data}
                // getItemCount={getItemCount}
                // getItem={getItem}
              />
            )}
          </SafeAreaView>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  back: {
    backgroundColor: "#25185A",
  },
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    marginTop:-36,
    height: '100%'
  },
  perda: {
    // flex: 1,
    position: "absolute",
    bottom: 80,
    width: '100%',
  },
  illus: {
    width: "100%"
  },
  perdaText: {
    position:"absolute",
    marginTop: 105,
    margin: 8
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 24,
    height:108,
    paddingHorizontal: 29,
    backgroundColor: "#FAD603",
  },
  textHeader: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  greeting: {
    flexDirection: "row",
    marginTop: 24,
    marginStart: 24
  },
  greetingName: {
    fontSize: 20,
    marginTop: -4,
    fontWeight: "bold",
  },
  sectionHeading: {
    color: "#212121",
    fontSize: 16,
    fontFamily: "DMSans_700Bold",
  },
  moreNav: {
    color: "#8D8D8D",
    fontSize: 14,
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    fontFamily: "DMSans_400Regular",
  },
  sectionNavContainer: {
    flexDirection:'row'
  },
  myequipmentItem: {
    alignItems:'center',
    elevation: 16,
    borderRadius: 75,
    borderWidth: 1,
    margin:16,
    flexDirection:'row'
  },

  myequipmentImage: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderRadius: 75,
    margin:8
  },
  // myequipmentImage: {
  //   flex:1,
  //   width: '80%',
  //   height: '80%',
  //   borderWidth: 2,
  //   borderRadius: 20,
  //   resizeMode: 'contain',
  //   justifyContent: 'center',
  //   alignItems:'center'
  // },
  myequipmentName: {
    marginTop: 4,
    color: "#8D8D8D",
    fontSize: 14,
    margin: 8
  },
  mybookTitle: {
    width:65,
    color: "#212121",
  },
  textInput: {
    elevation: 12,
    flexDirection: "row",
    marginHorizontal: 16,
    backgroundColor: '#e9e9e9',
    padding: 10,
    marginVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderColor: '#ffcd04'
  },
  btnSearch: {
    width: 18,
    height: 18,
    marginEnd: 8,
    marginVertical: 8,
  }, 
  progress: {
    justifyContent: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop:0,
    textAlign: 'center',
    flex: 1,
    alignItems: 'center'
  },
  lainnya: {
    marginLeft:-90,
    marginTop:196
  },
  border2: {
    backgroundColor: "#C4C4C4",
    height: "2%",
    opacity: 0.4,
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: '#800000',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
});
