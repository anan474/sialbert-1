import React, {useContext} from 'react';
import { StyleSheet, Alert, Text, View, Image, FlatList, TextInput, SafeAreaView, ActivityIndicator, TouchableOpacity, Dimensions, ImageBackground, Button } from "react-native";
import { useState, useEffect } from "react";

import { ScrollView } from "react-native-gesture-handler";
import { Asset } from 'expo-asset';
import { AntDesign } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons';
import { Card } from 'react-native-paper';
import Moment from 'moment';
import ActivityIndicatorExample  from "../components/ActivityIndicatorExample";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from '../components/CredentialsContext';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';

import Rent from "../assets/image/rent-active.png";

const win = Dimensions.get("window");

export default function MenuUtama({navigation}) {
  // const {nama, email} = route.params;
  const [data, setData] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [page, setPage] = useState(1);
  const [text, setText] = useState('');
  const [cari, setCari] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
  const {nama, email, id, token} = storedCredentials;
  const [refreshing, setRefreshing] = useState(true);
  const isFocused = useIsFocused();


  useEffect(async() => {
    let isMounted = true
    setIsLoading(true);
    fetch(`http://e565-180-242-214-45.ngrok.io/api/reschedules/${id}`,
    {
      method: "GET",
      headers: {
        //  'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+token,
      }})
      .then((response) => response.json())
      .then((hasil) => {
        setData(hasil);
        setCari(hasil);
        setIsLoading(false);
      })
      // .finally(() => setLoading(false));
      .catch(error => { console.log; });
  }, [isFocused]);

  const listOrders = ({item}) => {
    const alat = [...item.alat]
    // const sum = total.reduce(
    //   (tot, jumlah) => tot +jumlah,
    //   inisialValue
    // )
    var idLocale=require('moment/locale/id');
    Moment.locale('id');
    var dt = item.created_at
    console.log('nama alat', alat?.[0]?.[0].alat.nama_alat)
    return (
      <>
        <ScrollView>
          <TouchableOpacity
            onPress={() => navigation.navigate('Detail Reschedule', {reschedule: item})}
          >
            <View style={{ flexDirection:'row', textAlign:'center', textAlignVertical: 'center'}}>
              <View style={{ flexDirection:'row', margin:8, textAlign:'center', textAlignVertical: 'center',justifyContent: 'center' }}>
                {/* <Image source={{uri: item.foto}} style={styles.myequipmentImage} /> */}
                <Card style={styles.card}>
                  <View style={{ margin:16, flexDirection:'row', justifyContent: "space-between"}}>
                    <View style={{ flexDirection: 'row' }}>
                      <Image source={Rent} style={{ width:24, height:24, marginRight:8 }} />
                      <Text style={{ fontWeight:'bold'}}>Nama Kegiatan: {item.nama_kegiatan}</Text>
                      {/* <Text style={{ fontWeight:'bold'}}>Nama Kegiatan: {item.nama_kegiatan}</Text> */}
                    </View>
                  </View>
                  <View style={styles.border2}/>
                  <View style={{ margin:16 }}>
                    <View style={{ flexDirection:'row', justifyContent: "space-between" }}>
                      <View>
                        <Image source={{ uri:'https://sialbert.000webhostapp.com/'+alat?.[0]?.[0].alat.foto +'/' +alat?.[0]?.[0].alat.foto }} style={{ width:58, height:58, marginRight:8 }} />
                        <Text style={{ fontWeight:'bold', marginBottom:4 }}>{alat?.[0]?.[0].alat.nama_alat}</Text>
                      </View>
                    </View>
                      <View>
                        <View>
                          <Text style={{ fontWeight:'bold', marginBottom:8, fontSize:16, marginTop:16 }}>Waktu Awal:</Text>
                          <Text style={{ opacity: 0.4, fontSize:12 }}>Tanggal Mulai</Text>
                          <Text style={{ fontWeight:'bold', marginBottom:8, fontSize:12 }}>{Moment(item.tanggal_mulai).format('dddd, DD MMMM YYYY')} {Moment(item.tanggal_mulai).format('H:mm')}</Text>
                          <Text style={{ opacity: 0.4, fontSize:12 }}>Tanggal Selesai</Text>
                          <Text style={{ fontWeight:'bold', marginBottom:4, fontSize:12 }}>{Moment(item.tanggal_selesai).format('dddd, DD MMMM YYYY')} {Moment(item.tanggal_selesai).format('H:mm')}</Text>
                        </View>
                        <View>
                          <Text style={{ fontWeight:'bold', marginBottom:8, fontSize:16, marginTop:16 }}>Waktu Reschedule:</Text>
                          <Text style={{ opacity: 0.4, fontSize:12 }}>Tanggal Mulai</Text>
                          <Text style={{ fontWeight:'bold', marginBottom:8, fontSize:12 }}>{Moment(alat?.[0]?.[0].detail_order.waktu_mulai).format('dddd, DD MMMM YYYY')} {Moment(alat?.[0]?.[0].detail_order.waktu_mulai).format('H:mm')}</Text>
                          <Text style={{ opacity: 0.4, fontSize:12 }}>Tanggal Selesai</Text>
                          <Text style={{ fontWeight:'bold', marginBottom:4, fontSize:12 }}>{Moment(alat?.[0]?.[0].detail_order.waktu_selesai).format('dddd, DD MMMM YYYY')} {Moment(alat?.[0]?.[0].detail_order.waktu_selesai).format('H:mm')}</Text>
                        </View>
                      </View>
                    </View>
                  <View style={styles.border2}/>
                  <Text style={{ textAlign:'center', margin: 4, color: "#C4C4C4"}}>Lihat Detail</Text>
                  <View style={styles.border2}/>
                  {/* <View style={{ flexDirection:'row', margin:4 }}>
                    <TouchableOpacity>
                      <View style={styles.btn}>
                        <Text style={styles.buttonTitle}>Download Bukti Bayar</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <View style={styles.btn}>
                        <Text style={styles.buttonTitle}>Download Perjanjian Sewa</Text>
                      </View>
                    </TouchableOpacity>
                  </View> */}
                  {/* <Text>{item.alat}</Text> */}
                  {/* {alat.map((item)=>
                    <Card key={item.id} {...item} >
                    <Text>{item.alat}</Text>
                    </Card>
                  )} */}
                    {/* <View>
                      <FlatList
                        data={equipments}
                        horizontal
                        key={1}
                        numColumns={1}
                        nestedScrollEnabled
                        // fadingEdgeLength={10}
                        keyExtractor={item=>item.id}
                        // {item.id === item.order_id

                        // }
                        renderItem={listEquipments}
                        onEndReachedThreshold={0.5}
                        // getItemCount={getItemCount}
                        // getItem={getItem}
                      />
                    </View> */}
                </Card>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </>
    );
  }

  return (
    <>
    <View style={{ backgroundColor: '#fff' }}>
      <View style={{ height: '100%', paddingBottom: 48, margin: 16, }}>
      <View style={{ height: 48, textAlignVertical: 'center', backgroundColor: '#ffcd04', borderTopLeftRadius:15, borderTopRightRadius:15}}>
        <Text style={{ marginLeft:16, marginTop:14, textAlignVertical: 'center', fontWeight:'bold', color: '#ffffff' }}>Riwayat Perubahan Jadwal</Text>
      </View>
      {refreshing ? <ActivityIndicator /> : null}
        <View style={styles.container}>
          <SafeAreaView style={{ marginBottom: 64, justifyContent: 'center', flexDirection: "row", flex:1}}>
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
              <View>
                {data.length <= 0 &&
                  <View style={{ margin: 16 }}>
                      <Text>Anda belum pernah melakukan perubahan jadwal</Text>
                  </View>
                }
                {data.length > 0 &&
                  <View>
                    <FlatList
                      style={{ margin:0 }}
                      data={data}
                      vertical
                      key={1}
                      numColumns={1}
                      nestedScrollEnabled
                      // fadingEdgeLength={10}
                      keyExtractor={item=>item.id}
                      renderItem={listOrders}
                      onEndReachedThreshold={0.5}
                      extraData={data}
                      // getItemCount={getItemCount}
                      // getItem={getItem}
                    />
                  </View>
                }
              </View>
            )}
          </SafeAreaView>
        </View>
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
    borderColor: '#364878'
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
  border1: {
    backgroundColor: "#C4C4C4",
    height: "1%",
    opacity: 0.4,
    marginTop:8
  },
  border2: {
    backgroundColor: "#C4C4C4",
    height: "1%",
    opacity: 0.4,
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  btn: {
    margin:4,
    backgroundColor: '#ffcd04',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    textAlign: 'center',
    padding:8
  },
  buttonTitle: {
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 0,
    color: '#FFFFFF',
    fontWeight: '600',
    lineHeight: 22,
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
  card: {
    shadowOffset: {width:0, height:2},
    shadowOpacity: 0.5,
    width: '100%',
    height: 430,
    borderColor:'#2196F3',
    borderWidth:2
  }
});
