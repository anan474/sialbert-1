import React, {useContext} from 'react';
import { StyleSheet, Alert, Text, View, Image, FlatList, ActivityIndicator, TextInput, Pressable, ToastAndroid, SafeAreaView, TouchableOpacity, Modal, Dimensions, ImageBackground, Button } from "react-native";
import { useState, useEffect } from "react";

import { ScrollView } from "react-native-gesture-handler";
import { Asset } from 'expo-asset';
import { AntDesign } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CredentialsContext } from './../components/CredentialsContext';
const win = Dimensions.get("window");
import logo from "../assets/icon.png";
import Moment from 'moment';
import { Card, Badge } from 'react-native-paper';
// import { downloadToFolder } from 'expo-file-dl';
// import { Constants } from 'react-native-unimodules';
import ActivityIndicatorExample  from "../components/ActivityIndicatorExample";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import * as FileSystem from 'expo-file-system';
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from 'expo-media-library';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import * as yup from 'yup';

import Rent from "../assets/image/rent-active.png";

import {
  AndroidImportance,
  AndroidNotificationVisibility,
  NotificationChannel,
  NotificationChannelInput,
  NotificationContentInput,
} from "expo-notifications";
import { downloadToFolder } from "expo-file-dl";
import { eachWeekOfInterval } from 'date-fns/fp';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const channelId = "DownloadInfo";

export default function DetailOrder({ navigation, route }) {
  // const {nama, email} = route.params;
  const {order} = route.params;
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const [data, setData] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [alats, setAlats] = useState([]);
  const [page, setPage] = useState(1);
  const [text, setText] = useState('');
  const [cari, setCari] = useState([]);
  const [skr, setSkr] = useState({});
  const [payment, setPayment] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [alasan, setAlasan] = useState('');
  const [detail_order_id, setDetailOrderId] = useState();

  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
  const {nama, email, id, token} = storedCredentials;
  const isFocused = useIsFocused();
  const alat = [...order.alat]
  const equipment = [order?.equipment]
  var dtMulai = order.tanggal_mulai
  var dtSelesai = order.tanggal_selesai
  var order_id = order.id
  const total_hari = order.total_hari
  const total_jam = order.total_jam
  var category_order_id = order.category_order_id
  console.log(category_order_id)
  const handleMessage = (message, type = 'failed') => {
    setMessage(message);
    setMessageType(type);
  }
  const openSettingModal = (detail_order_id) => {
    setDetailOrderId(detail_order_id);
    setModalVisible(!modalVisible);
  }

  const letHide = () => {
    if (visible === true) {
      setVisible(false)
    } else {
      setVisible(true)
    }
  }

  const doYourTask = () => {
    setIsDisabled(true);
  }
  // const [downloadProgress, setDownloadProgress] = useState(0);

  const id_order=order.id
  useEffect(async() => {
    let isMounted = true
    setIsLoading(true);
    const url = 'http://e565-180-242-214-45.ngrok.io/api/detail-orders/'+id_order
    fetch(url,
    {
      method: "GET",
      headers: {
        //  'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+token,
      }})
    // fetch('http://e565-180-242-214-45.ngrok.io/api/detail-orders/'+id_order)
      .then((response) => response.json())
      .then((hasil) => {
        setData(hasil);
        setCari(hasil);
        setIsLoading(false);
      })
      // .finally(() => setLoading(false));
      .catch(error => { console.log; });
  }, []);
  // const detail = [...order.data]
  const p = [...order.alat]
  // const ek= data?.[0]?.detail
  // const tes = [...data?.[0]?.detail]
  const detail=order.alat
  const a = order?.[0]?.alat
  console.log('aaa', a)
  console.log('detail', order)
  console.log('p', p)
  const tes=detail

  const total_harga_perhari = detail.reduce((total,item)=>{
    const harga_sewa_perhari = total_hari * item?.[0].alat.harga_sewa_perhari
    return total + harga_sewa_perhari;
  },0)
  const total_harga_perjam = detail.reduce((total,item)=>{
    const harga_sewa_perjam = total_jam * item?.[0].alat.harga_sewa_perjam
    return total + harga_sewa_perjam;
  },0)

  useEffect(async() => {
    setIsLoading(true);
    const url = 'http://e565-180-242-214-45.ngrok.io/api/cekPayments/'+order.id;
    fetch(url,
      {
        method: "GET",
        headers: {
          //  'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+token,
        }})
      .then((response) => response.json())
      .then((hasil) => {
        setPayment(hasil);
        setIsLoading(false);
      })
      // .finally(() => setLoading(false));
      .catch(error => { console.log; });

  }, [isFocused]);

  const cekSkr = (credentials) => {
    setIsLoading(true);
    const url = `http://e565-180-242-214-45.ngrok.io/api/cekSkr/${id_order}`;
    handleMessage(null);

    axios
      .get(url,
        {
          method: "GET",
          headers: {
            //  'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+token,
          }
        }, credentials)
      .then((response) => {
        const result = response.data;
        const { message, success, status, data } = result;
        // console.log(response.data);

        if (success == false) {
          // navigation.navigate('MenuUtama');
          // navigation.navigate('MenuUtama');
          // persistLogin({ ...data[0] }, message, status);
          Alert.alert("Surat Ketetapan Retribusi (SKR) belum terbit!", "Lakukan pembayaran jika SKR telah terbit!", [
            {
              text:"OK",
              onPress: () => {},
            },
          ]);
          setIsLoading(false);
        }
        else if (success == true) {
          if(total_hari >0){
            navigation.navigate('Pembayaran', {id_order: id_order, skr: data.skr, dateSkr: data.created_at, total_harga: total_harga_perhari})
          }
          else{
            navigation.navigate('Pembayaran', {id_order: id_order, skr: data.skr, dateSkr: data.created_at, total_harga: total_harga_perjam})
          }
        }
    })

    .catch((error)=> {
      console.error('error', error);
    });
  };

  const batalValidationSchema = yup.object().shape({
    alasan: yup
      .string()
      .required('Alasan wajib diisi!'),
  })

  const handleAjukanPembatalan = (detail_order_id) => {
    handleMessage(null);
    setAlasan(alasan)

    if(alasan !== ''){
      axios({
        url:`http://e565-180-242-214-45.ngrok.io/api/pembatalan/${detail_order_id}`,
        method:"POST",
        headers: {
          //  'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+token,
        },
        data:
        {
          alasan:alasan,
        },
      })
      .then((response) => {
        const result = response.data;
        const { message, status, success } = result;
        if (message == 'Pengajuan Pembatalan Berhasil!') {
          // navigation.navigate('MenuUtama', {...data[0]});
          axios({
            url:`https://sialbert.000webhostapp.com/teknisi/order/update/${detail_order_id}`,
            method:"POST",
            data:
            {
              pembatalan:1,
            },
          })
          .then((response) => {
            const result = response.data;
            const { message, status, success } = result;
            if (status == 200) {
              // navigation.navigate('MenuUtama', {...data[0]});
              Alert.alert("Berhasil", "Pembatalan Berhasil!", [
                {
                  text:"OK",
                  onPress: () => navigation.navigate('Pembatalan'),
                },
              ]);
              setVisible(false);
              setIsDisabled(false);
            }
            else if (message == 'Masa penyewaan telah berakhir') {
              Alert.alert("Anda tidak dapat melakukan pembatalan.", "Masa penyewaan telah berakhir.");
              setVisible(false);
              setIsDisabled(false);
            }
            else if (message == 'Alat Telah Dipakai!') {
              Alert.alert("Tidak dapat melakukan pembatalan jika telah memakai alat.");
              setVisible(false);
              setIsDisabled(false);
            }
          })
          .catch((error)=> {
            handleMessage("Tidak ada koneksi internet!");
            console.error('error', error);
            console.log(error.response)
          });
        }
        else if (message == 'Masa penyewaan telah berakhir') {
          Alert.alert("Anda tidak dapat melakukan pembatalan.", "Masa penyewaan telah berakhir.");
          setVisible(false);
          setIsDisabled(false);
        }
        else if (message == 'Alat Telah Dipakai!') {
          Alert.alert("Tidak dapat melakukan pembatalan jika telah memakai alat.");
          setVisible(false);
          setIsDisabled(false);
        }
      })
      .catch((error)=> {
        handleMessage("Tidak ada koneksi internet!");
        console.error('error', error);
        console.log(error.response)
      });
    }else{
      Alert.alert('Harap isi kolom alasan!', "Kolom alasan tidak boleh kosong!");
    }
  }

  // const total_harga_perhari = tes.reduce((total,item)=>{
  //   const harga_sewa_perhari = total_hari * item.alat?.[0].harga_sewa_perhari
  //   return total + harga_sewa_perhari;
  // },0)

  // const total_harga_perjam = tes.reduce((total,item)=>{
  //   const harga_sewa_perjam = total_hari * item.alat?.[0].harga_sewa_perjam
  //   return total + harga_sewa_perjam;
  // },0)

    // const total_harga_perhari = detail.reduce((total,item)=>{
    //   const harga_sewa_perhari = total_hari * item?.[0]?.harga_sewa_perhari
    //   return total + harga_sewa_perhari;
    // },0)
    // const total_harga_perjam= detail.reduce((total,item)=>{
    //   const harga_sewa_perjam = total_jam * item?.[0]?.harga_sewa_perjam
    //   return total + harga_sewa_perjam;
    // },0)

    // if(total_hari >0){
    //   var total_harga= total_harga_perhari
    // }else{
    //   var total_harga= total_harga_perjam
    // }
  // const listOrders = ({item}) => {
  //   const inisialValue = 0
  //   var i;
  //   const nama_alat=item.nama_alat
  //   var idLocale=require('moment/locale/id');
  //   Moment.locale('id');
  //   console.log(item.alat?.[0].nama_alat)
  //   var detail_order_id=item.id
  //   console.log('detail order id', item.id)

  //   return (
  //     <>
  //       <ScrollView>
  //         <View style={{ flex: 1 }}>
  //           <Card key={item.alat?.[0].id_alat} {...item} style={styles.card3}>
  //             <View style={{ flexDirection:'row', justifyContent: "space-between", paddingHorizontal:8}}>
  //               <View style={{ flexDirection:'row' }}>
  //                 <Image source={{ uri:'https://sialbert.000webhostapp.com/'+item.alat?.[0].foto +'/' +item.alat?.[0].foto }} style={{ width:58, height:58, marginRight:8, marginTop: 8 }} />
  //                 <View style={{ justifyContent:'center', textAlignVertical:'center' }}>
  //                   <Text>{item.alat?.[0].nama_alat}</Text>
  //                   <Text>x1</Text>
  //                 </View>
  //               </View>
  //             </View>
  //             {order.total_hari > 0 ?
  //               <View style={{ flexDirection:'row', marginHorizontal: 16, justifyContent:'space-between' }}>
  //                 <View style={{ flexDirection:'row' }}>
  //                   {category_order_id == '1' &&
  //                     <Text style={{ justifyContent:'center', textAlignVertical:'center' }}>Rp.{item.alat?.[0].harga_sewa_perhari},-</Text>
  //                   }
  //                   <Text style={{ justifyContent:'center', textAlignVertical:'center', fontWeight:'bold' }}> X</Text>
  //                   <Text style={{ justifyContent:'center', textAlignVertical:'center' }}> {total_hari} Hari</Text>
  //                 </View>
  //                 {category_order_id == '1' &&
  //                   <Text style={{ margin: 16 }}>Rp.{(item.alat?.[0].harga_sewa_perhari * total_hari)},-</Text>
  //                 }
  //               </View>:
  //               <View style={{ flexDirection:'row', marginHorizontal: 16, justifyContent:'space-between' }}>
  //                 <View style={{ flexDirection:'row' }}>
  //                   {category_order_id == '1' &&
  //                     <Text style={{ justifyContent:'center', textAlignVertical:'center' }}>Rp.{item.alat?.[0].harga_sewa_perjam},-</Text>
  //                   }
  //                   <Text style={{ justifyContent:'center', textAlignVertical:'center', fontWeight:'bold' }}> X</Text>
  //                   <Text style={{ justifyContent:'center', textAlignVertical:'center' }}> {total_jam} Jam</Text>
  //                 </View>
  //                 {category_order_id == '1' &&
  //                   <Text style={{ margin: 16 }}>Rp.{(item.alat?.[0].harga_sewa_perjam * total_jam)},-</Text>
  //                 }
  //               </View>
  //             }
  //             <View style={styles.border2}/>
  //             <View style={{ paddingHorizontal:16, width: '100%' }}>
  //               <TouchableOpacity
  //                 onPress={() => navigation.navigate('Pengajuan Perubahan Jadwal', {dtMulai: dtMulai, dtSelesai: dtSelesai, reschedule: item, order_id: order.id})}
  //               >
  //                 <View>
  //                   <View style={{flexDirection:'row', justifyContent: "space-between"}}>
  //                     <Text>Ajukan Perubahan Jadwal</Text>
  //                     <MaterialCommunityIcons name="arrow-right" size={24} color='#FAD603'/>
  //                   </View>
  //                 </View>
  //               </TouchableOpacity>
  //             </View>
  //             <View style={styles.border2}/>
  //             <View style={{ paddingHorizontal:16, width: '100%' }}>
  //               <TouchableOpacity
  //                 onPress={() => openSettingModal(detail_order_id)}
  //               >
  //                 <View>
  //                   <View style={{flexDirection:'row', justifyContent: "space-between"}}>
  //                     <Text>Ajukan Pembatalan</Text>
  //                     <MaterialCommunityIcons name="arrow-right" size={24} color='#FAD603'/>
  //                   </View>
  //                 </View>
  //               </TouchableOpacity>
  //             </View>
  //           </Card>
  //         </View>
  //       </ScrollView>
  //     </>
  //   );
  // }

  return (
    <>
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
          <ScrollView style={{ paddingBottom:8}}>
            <Card style={{ backgroundColor: '#fff', paddingBottom:32}}>
              <View style={{ flexDirection:'row', justifyContent: "space-between", height: 48, backgroundColor: '#25185A'}}>
                <Image style={styles.icon} source={logo} />
                <Text style={{ marginRight:16, textAlignVertical: 'center', fontWeight:'bold', color: '#ffffff' }}>Kode Pemesanan: {order.kode_pesanan}</Text>
              </View>
              <View style={{ padding:16 }}>
                {category_order_id == '1' &&
                  <View>
                    {payment.status == '1' &&
                      <Badge style={{ backgroundColor:'#ffcd04' }}>{payment.message}</Badge>
                    }
                    {payment.status == '2' &&
                      <Badge style={{ backgroundColor:'green' }}>{payment.message}</Badge>
                    }
                    {payment.status == '3' &&
                      <Badge>{payment.message}</Badge>
                    }
                    {payment.status == '4' &&
                      <Badge>{payment.message}</Badge>
                    }
                  </View>
                }
                <Card style={styles.card}>
                  <View style={{ height: 48, textAlignVertical: 'center', backgroundColor: '#25185A', borderTopLeftRadius:13, borderTopRightRadius:13}}>
                    <Text style={{ marginLeft:16, marginTop:14, textAlignVertical: 'center', fontWeight:'bold', color: '#ffffff' }}>Jangka Waktu Penyewaan</Text>
                  </View>
                  <View style={{ flexDirection:'row', justifyContent: "space-between", padding:8}}>
                    <Text>Tanggal Mulai:</Text>
                    <Text>{Moment(dtMulai).format('dddd, DD MMMM YYYY HH:mm')}</Text>
                  </View>
                  <View style={{ flexDirection:'row', justifyContent: "space-between", padding:8}}>
                    <Text>Tanggal Selesai:</Text>
                    <Text>{Moment(dtSelesai).format('dddd, DD MMMM YYYY HH:mm')}</Text>
                  </View>
                  {order.total_hari > 0 ?
                    <View style={{ flexDirection:'row', justifyContent: "space-between", padding:8}}>
                      <Text>Total Hari:</Text>
                      <Text>{order.total_hari} Hari</Text>
                    </View>:
                    <View style={{ flexDirection:'row', justifyContent: "space-between", padding:8}}>
                      <Text>Total Jam:</Text>
                      <Text>{order.total_jam} Jam</Text>
                    </View>
                  }
                </Card>
                <Card style={styles.card2}>
                  <View style={{ height: 48, textAlignVertical: 'center', backgroundColor: '#25185A', borderTopLeftRadius:13, borderTopRightRadius:13}}>
                    <Text style={{ marginLeft:16, marginTop:14, textAlignVertical: 'center', fontWeight:'bold', color: '#ffffff' }}>Detail Orderan</Text>
                  </View>
                  {detail.map((item)=>
                    <Card key={item?.[0].detail_order.id} {...item} style={styles.card3}>
                      {(() => {
                        const harga_sewa_perhari = item.alat?.[0].harga_sewa_perhari
                        const detail_order_id = item?.[0].detail_order.id
                        return(
                          <View>
                            <View style={{ flexDirection:'row', justifyContent: "space-between", paddingHorizontal:8}}>
                              <View style={{ flexDirection:'row' }}>
                                <Image source={{ uri:'https://sialbert.000webhostapp.com/'+item?.[0].alat.foto +'/' +item?.[0].alat.foto }} style={{ width:58, height:58, marginRight:8, marginTop: 8 }} />
                                <View style={{ justifyContent:'center', textAlignVertical:'center' }}>
                                  <Text>{item?.[0].alat.nama_alat}</Text>
                                  <Text>{item?.[0].detail_order.id}</Text>
                                  {/* <Text>{item?.[0].detail_order.id}</Text> */}
                                </View>
                              </View>
                            </View>
                            {order.total_hari > 0 ?
                              <View style={{ flexDirection:'row', marginHorizontal: 16, justifyContent:'space-between' }}>
                                <View style={{ flexDirection:'row' }}>
                                  {category_order_id == '1' &&
                                    <Text style={{ justifyContent:'center', textAlignVertical:'center' }}>Rp.{Number(item?.[0].alat.harga_sewa_perhari).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-</Text>
                                  }
                                  <Text style={{ justifyContent:'center', textAlignVertical:'center', fontWeight:'bold' }}> X</Text>
                                  <Text style={{ justifyContent:'center', textAlignVertical:'center' }}> {total_hari} Hari</Text>
                                </View>
                                {category_order_id == '1' &&
                                  <Text style={{ margin: 16 }}>Rp.{Number(item?.[0].alat.harga_sewa_perhari * total_hari).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-</Text>
                                }
                              </View>:
                              <View style={{ flexDirection:'row', marginHorizontal: 16, justifyContent:'space-between' }}>
                                <View style={{ flexDirection:'row' }}>
                                  {category_order_id == '1' &&
                                    <Text style={{ justifyContent:'center', textAlignVertical:'center' }}>Rp.{Number(item?.[0].alat.harga_sewa_perjam).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-</Text>
                                  }
                                  <Text style={{ justifyContent:'center', textAlignVertical:'center', fontWeight:'bold' }}> X</Text>
                                  <Text style={{ justifyContent:'center', textAlignVertical:'center' }}> {total_jam} Jam</Text>
                                </View>
                                {category_order_id == '1' &&
                                  <Text style={{ margin: 16 }}>Rp.{Number(item?.[0].alat.harga_sewa_perjam * total_jam).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-</Text>
                                }
                              </View>
                            }
                            <View style={styles.border2}/>
                            <View style={{ paddingHorizontal:16, width: '100%' }}>
                              <TouchableOpacity
                                onPress={() => navigation.navigate('Pengajuan Perubahan Jadwal', {dtMulai: dtMulai, dtSelesai: dtSelesai, reschedule: item, order_id: order.id, kode_pesanan: order.kode_pesanan})}
                              >
                                <View>
                                  <View style={{flexDirection:'row', justifyContent: "space-between"}}>
                                    <Text>Ajukan Perubahan Jadwal</Text>
                                    <MaterialCommunityIcons name="arrow-right" size={24} color='#FAD603'/>
                                  </View>
                                </View>
                              </TouchableOpacity>
                            </View>
                            <View style={styles.border2}/>
                            <View style={{ paddingHorizontal:16, width: '100%' }}>
                              <TouchableOpacity
                                onPress={() => openSettingModal(detail_order_id)}
                              >
                                <View>
                                  <View style={{flexDirection:'row', justifyContent: "space-between"}}>
                                    <Text>Batalkan</Text>
                                    <MaterialCommunityIcons name="arrow-right" size={24} color='#FAD603'/>
                                  </View>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        )
                      })()}
                    </Card>
                  )}
                  {category_order_id == '1' &&
                    <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
                      <Text style={{ fontWeight:'bold', fontSize:16, fontWeight:'bold', margin:16 }}> Total :</Text>
                      {total_hari > 0 ?
                        <Text style={{ textAlign:'right', fontSize:16, fontWeight:'bold', margin:16 }}>Rp.{total_harga_perhari.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-</Text>:
                        <Text style={{ textAlign:'right', fontSize:16, fontWeight:'bold', margin:16 }}>Rp.{total_harga_perjam.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-</Text>
                      }
                      {/* <Text style={{ textAlign:'right', fontSize:16, fontWeight:'bold', margin:16 }}>Rp.{total_harga_perhari.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-</Text> */}
                    </View>
                  }
                  {category_order_id == '1' &&
                    <View>
                      {payment.status == '3' &&
                        <TouchableOpacity style={{ marginHorizontal: 16 }}
                        // onPress={() => navigation.navigate('Pembayaran', {id_order: id_order})}>
                        onPress={cekSkr}>
                          <View style={styles.btnLanjut}>
                            <Text style={styles.buttonTitle}>Lanjutkan Pembayaran</Text>
                          </View>
                        </TouchableOpacity>
                      }
                      {payment.status == '4' &&
                        <TouchableOpacity style={{ marginHorizontal: 16 }}
                        // onPress={() => navigation.navigate('Pembayaran', {id_order: id_order})}>
                        onPress={cekSkr}>
                          <View style={styles.btnLanjut}>
                            <Text style={styles.buttonTitle}>Lanjutkan Pembayaran</Text>
                          </View>
                        </TouchableOpacity>
                      }
                    </View>
                  }
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                      // Alert.alert("Modal has been closed.");
                      setModalVisible(!modalVisible);
                    }}
                  >
                    <View style={styles.centeredView}>
                      <View style={styles.modalView}>
                      <View style={{ width: '100%' }}>
                        <TextInput
                          autoCapitalize="none"
                          autoCorrect={false}
                          returnKeyType="next"
                          placeholder="Alasan"
                          style={styles.textInput}
                          onChangeText={setAlasan}
                          value={alasan}
                          editable={true}
                        />
                        <TouchableOpacity onPress={(e) =>
                          {
                            letHide(e),
                            doYourTask(e),
                            handleAjukanPembatalan(detail_order_id, e)
                          }
                        }
                        disabled={isDisabled}>
                          <View style={styles.btn}>
                            {visible == true &&
                              <ActivityIndicator
                                size="large"
                                color="#00B8D4"
                                animating={visible}
                              />
                            }
                            {visible == false &&
                              <Text style={styles.textStyle}>KIRIM</Text>
                            }
                          </View>
                        </TouchableOpacity>
                        <Pressable
                          style={[styles.button, styles.buttonClose]}
                          onPress={() => setModalVisible(!modalVisible)}
                        >
                          <Text style={styles.textStyle}>BATALKAN</Text>
                        </Pressable>
                      </View>
                      </View>
                    </View>
                  </Modal>
                </Card>
              </View>
            </Card>
          </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  // back: {
  //   backgroundColor: "#25185A",
  // },
  // container: {
  //   backgroundColor: "#fff",
  //   borderTopLeftRadius: 50,
  //   borderTopRightRadius: 50,
  //   // marginTop:-36,
  // },
  button: {
    alignItems: 'center',
    backgroundColor: '#ffcd04',
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonTitle: {
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 0,
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
  },
  illus: {
    width: "100%"
  },
  perdaText: {
    position:"absolute",
    marginTop: 105,
    margin: 8
  },

  // headerContainer: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   paddingBottom: 24,
  //   height:108,
  //   paddingHorizontal: 29,
  //   backgroundColor: "#FAD603",
  // },
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
    height: "1%",
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
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 16,
    borderRadius: 20,
    borderColor: '#ffcd04',
    borderWidth: 1
  },
  btnSearch: {
    width: 18,
    height: 18,
    marginEnd: 8,
    marginVertical: 8,
  },
  card: {
    shadowOffset: {width:0, height:2},
    shadowOpacity: 0.5,
    width: '100%',
    borderTopLeftRadius:15,
    borderTopRightRadius:15,
    marginTop:16,
    borderColor:'#2196F3',
    borderWidth:2
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
    marginBottom:48
  },
  card3: {
    shadowOffset: {width:0, height:2},
    shadowOpacity: 0.5,
    width: '100%',
    borderColor:'#2196F3',
    borderWidth:1,
  },
  icon: {
    width: 32,
    height:32,
    marginLeft:16,
    marginTop:8,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 8,
    width: '80%',
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "red",
    marginTop: 4
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  btn: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  btnLanjut: {
    backgroundColor: '#25185A',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    textAlign: 'center',
    marginTop:16,
    marginBottom:8,
    padding:8,
  },
});
