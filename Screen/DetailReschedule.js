import React, {useContext} from 'react';
import { StyleSheet, Text, View, Image, FlatList, TextInput, TouchableOpacity, Dimensions, ImageBackground, Button } from "react-native";
import { useState, useEffect } from "react";

import FloatingTabBar from "../components/FloatingTabBar";
import { ScrollView } from "react-native-gesture-handler";
import { Asset } from 'expo-asset';
import { AntDesign } from '@expo/vector-icons';
import { Card } from 'react-native-paper';
import Moment from 'moment';
import ActivityIndicatorExample  from "../components/ActivityIndicatorExample";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from '../components/CredentialsContext';
const win = Dimensions.get("window");
import logo from "../assets/icon.png";
import { useIsFocused } from '@react-navigation/native';

export default function DetaiReschedule({ navigation, route }) {
  const {reschedule} = route.params
  const [data, setData] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [page, setPage] = useState(1);
  const [text, setText] = useState('');
  const [cari, setCari] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();

  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
  const alat = reschedule.alat?.[0]
  console.log('reschedule',alat)
  // const total_harga = alat.reduce((total,item)=>{
  //   const harga_sewa_perhari = item.jumlah_hari_refund * item.harga_sewa_perhari
  //   const harga_sewa_perjam = item.jumlah_jam_refund * item.harga_sewa_perjam
  //   const total_biaya = harga_sewa_perhari+harga_sewa_perjam
  //   return total + total_biaya;
  // },0)

  useEffect(async() => {
    setIsLoading(true);
    fetch('http://9b5e-2001-448a-6060-519e-7cb8-8f1b-d608-4dc2.ngrok.io/api/reschedules')
      .then((response) => response.json())
      .then((hasil) => {
        setData(hasil);
        setCari(hasil);
        setIsLoading(false);
      })
      // .finally(() => setLoading(false));
      .catch(error => { console.log; });

  }, [isFocused]);

  var idLocale=require('moment/locale/id');
  Moment.locale('id');
  var dtMulai = reschedule.tanggal_mulai
  var dtSelesai = reschedule.tanggal_selesai

  return (
    <ScrollView style={{ padding:8, backgroundColor: '#fff' }}>
      <Card style={{ backgroundColor: '#fff' }}>
        <View style={{ flexDirection:'row', justifyContent: "space-between", height: 48, backgroundColor: '#25185A'}}>
          <Image style={styles.icon} source={logo} />
          <Text style={{ marginRight:16, textAlignVertical: 'center', fontWeight:'bold', color: '#ffffff' }}>Kode Pemesanan: {reschedule.kode_pesanan}</Text>
        </View>
        <View style={{ padding:16 }}>
          <Card style={styles.card}>
            <View style={{ height: 48, textAlignVertical: 'center', backgroundColor: '#25185A', borderTopLeftRadius:13, borderTopRightRadius:13}}>
              <Text style={{ marginLeft:16, marginTop:14, textAlignVertical: 'center', fontWeight:'bold', color: '#ffffff' }}>Detail Rescehdule</Text>
            </View>
            {alat.map((item, idx)=>
              <>
                <Card key={item.detail_order.id} {...item} >
                  <View style={{ marginHorizontal:16 }}>
                    <View style={{ flexDirection:'row', justifyContent: "space-between" }}>
                      <View>
                        <Image source={{ uri:'https://sialbert.000webhostapp.com/'+item.alat.foto +'/' +item.alat.foto }} style={{ width:58, height:58, marginRight:8 }} />
                        <Text style={{ fontWeight:'bold', marginBottom:4 }}>{item.alat.nama_alat}</Text>
                        {(() => {
                          if(alat?.[0]?.ket_persetujuan_kepala_uptd === 'setuju'){
                            return(
                              <View style={{ borderWidth:2, borderRadius:8, borderColor: '#11CF00', alignItems:'center', padding:2}}>
                                <Text style={{ textAlign:'right', color:'#11CF00', alignItems: 'flex-end', justifyContent: 'flex-end', alignContent: 'flex-end'}}>Pengajuan telah disetujui</Text>
                              </View>
                            )
                          }
                          if(item.ket_persetujuan_kepala_uptd !== 'tolak' && item.ket_verif_admin !== 'tolak'){
                            if(item.ket_persetujuan_kepala_uptd === 'belum' && item.ket_verif_admin === 'verif'){
                              return(
                                <View style={{ borderWidth:2, borderRadius:8, borderColor: '#FAD603', alignItems:'center', padding:2}}>
                                  <Text style={{ textAlign:'right', color:'#FAD603', alignItems: 'flex-end', justifyContent: 'flex-end', alignContent: 'flex-end'}}>Menunggu persetujuan</Text>
                                </View>
                              )
                            }
                            else if(item.ket_persetujuan_kepala_uptd === 'belum' && item.ket_verif_admin === 'belum'){
                              return(
                                <View style={{ borderWidth:2, borderRadius:8, borderColor: '#FAD603', alignItems:'center', padding:2}}>
                                  <Text style={{ textAlign:'right', color:'#FAD603', alignItems: 'flex-end', justifyContent: 'flex-end', alignContent: 'flex-end'}}>Menunggu verifikasi</Text>
                                </View>
                              )
                            }
                          }
                          if(item.ket_verif_admin === 'tolak' || item.ket_persetujuan_kepala_uptd === 'tolak'){
                            return(
                              <View style={{ borderWidth:2, borderRadius:8, borderColor: '#FB1313', alignItems:'center', padding:2}}>
                                <Text style={{ textAlign:'right', color:'#FB1313', alignItems: 'flex-end', justifyContent: 'flex-end', alignContent: 'flex-end'}}>Pengajuan Ditolak</Text>
                              </View>
                            )
                          }
                          return null;
                        })()}
                      </View>
                    </View>
                    <View>
                      <View>
                        <Text style={{ fontWeight:'bold', marginBottom:8, fontSize:16, marginTop:16 }}>Waktu Awal:</Text>
                        <Text style={{ opacity: 0.4, fontSize:12 }}>Tanggal Mulai</Text>
                        <Text style={{ fontWeight:'bold', marginBottom:8, fontSize:12 }}>{Moment(reschedule.tanggal_mulai).format('dddd, DD MMMM YYYY')} {Moment(reschedule.tanggal_mulai).format('H:mm')}</Text>
                        <Text style={{ opacity: 0.4, fontSize:12 }}>Tanggal Selesai</Text>
                        <Text style={{ fontWeight:'bold', marginBottom:4, fontSize:12 }}>{Moment(reschedule.tanggal_selesai).format('dddd, DD MMMM YYYY')} {Moment(reschedule.tanggal_selesai).format('H:mm')}</Text>
                      </View>
                      <View>
                        <Text style={{ fontWeight:'bold', marginBottom:8, fontSize:16, marginTop:16 }}>Waktu Reschedule:</Text>
                        <Text style={{ opacity: 0.4, fontSize:12 }}>Tanggal Mulai</Text>
                        <Text style={{ fontWeight:'bold', marginBottom:8, fontSize:12 }}>{Moment(item.detail_order.waktu_mulai ).format('dddd, DD MMMM YYYY')} {Moment(item.detail_order.waktu_mulai).format('H:mm')}</Text>
                        <Text style={{ opacity: 0.4, fontSize:12 }}>Tanggal Selesai</Text>
                        <Text style={{ fontWeight:'bold', marginBottom:4, fontSize:12 }}>{Moment(item.detail_order.waktu_selesai).format('dddd, DD MMMM YYYY')} {Moment(item.detail_order.waktu_selesai).format('H:mm')}</Text>
                      </View>
                    </View>
                  </View>
                </Card>
                <View style={styles.border2}/>
              </>
            )}
          </Card>
        </View>
      </Card>
    </ScrollView>
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
    bottom: 170,
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
    justifyContent:'space-between',
    margin: 8,
    width:75,
    justifyContent: 'center',
    borderRadius: 75,
    alignItems:'center',
  },
  myequipmentItem: {
    alignItems:'center',
    elevation: 16,
    width: 75,
    borderRadius: 75,
    borderWidth: 1,
    height: 75,
  },

  myequipmentImage: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 75,
  },
  border2: {
    backgroundColor: "#C4C4C4",
    height: 2,
    opacity: 0.4,
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
  },
  mybookTitle: {
    width:65,
    color: "#212121",
  },
  textInput: {
    elevation: 12,
    flexDirection: "row",
    marginHorizontal: 16,
    backgroundColor: '#fff',
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
  card: {
    shadowOffset: {width:0, height:2},
    shadowOpacity: 0.5,
    width: '100%',
    borderTopLeftRadius:15,
    borderTopRightRadius:15,
    marginTop:16,
    borderColor:'#2196F3',
    borderWidth:2,
    marginBottom:40
  },
  card2: {
    shadowOffset: {width:0, height:2},
    shadowOpacity: 0.5,
    width: '100%',
    borderTopLeftRadius:15,
    borderTopRightRadius:15,
    marginTop:16,
    borderColor:'#2196F3',
    borderWidth:2,
  },
  icon: {
    width: 32,
    height:32,
    marginLeft:16,
    marginTop:8,
  }
});
