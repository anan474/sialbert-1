import React, {useContext} from 'react';
import { StyleSheet, Alert, Text, View, Image, FlatList, TextInput, Modal, ActivityIndicator, Pressable, ToastAndroid, SafeAreaView, TouchableOpacity, Dimensions, ImageBackground, Button } from "react-native";
import { useState, useEffect } from "react";

import { ScrollView } from "react-native-gesture-handler";
import { Asset } from 'expo-asset';
import { AntDesign } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons';
import { Card } from 'react-native-paper';
import Moment from 'moment';
import {Picker} from '@react-native-picker/picker';
// import { downloadToFolder } from 'expo-file-dl';
// import { Constants } from 'react-native-unimodules';
import ActivityIndicatorExample  from "../components/ActivityIndicatorExample";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from '../components/CredentialsContext';
import { StatusBar } from 'expo-status-bar';
import * as FileSystem from 'expo-file-system';
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from 'expo-media-library';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';

import Rent from "../assets/image/rent-active.png";

import {
  AndroidImportance,
  AndroidNotificationVisibility,
  NotificationChannel,
  NotificationChannelInput,
  NotificationContentInput,
} from "expo-notifications";
import { downloadToFolder } from "expo-file-dl";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const channelId = "DownloadInfo";

const win = Dimensions.get("window");

export default function MenuUtama({navigation}) {
  // const {nama, email} = route.params;
  const [data, setData] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [alats, setAlats] = useState([]);
  const [page, setPage] = useState(1);
  const [text, setText] = useState('');
  const [cari, setCari] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const [order_id, setOrderId] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [lainnya, setLainnya] = useState('');
  const [nama_di_rekening, setNamaDiRekening] = useState('');
  const [noRek, setNoRek] = useState('');

  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
  const {nama, email, id, token} = storedCredentials;

  // const [downloadProgress, setDownloadProgress] = useState(0);
  const [document, setDocument] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState("0%");
  const [selectedValue, setFieldValue] = useState('1');
  const isFocused = useIsFocused();

  async function setNotificationChannel() {
    const loadingChannel = await Notifications.getNotificationChannelAsync(
      channelId
    );

    // if we didn't find a notification channel set how we like it, then we create one
    if (loadingChannel == null) {
      const channelOptions = {
        name: channelId,
        importance: AndroidImportance.HIGH,
        lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
        sound: "default",
        vibrationPattern: [250],
        enableVibrate: true,
      };
      await Notifications.setNotificationChannelAsync(
        channelId,
        channelOptions
      );
    }
  }

  useEffect(async () => {
    let isMounted = true
    await MediaLibrary.requestPermissionsAsync();
    await Notifications.requestPermissionsAsync();
    setNotificationChannel();
  }, [isFocused]);

  const downloadProgressUpdater = ({
    totalBytesWritten,
    totalBytesExpectedToWrite,
  }) => {
    const pctg = 100 * (totalBytesWritten / totalBytesExpectedToWrite);
    setDownloadProgress(`${pctg.toFixed(0)}%`);
  };

  useEffect(async() => {
    let isMounted = true
    setIsLoading(true);
    fetch(`http://e565-180-242-214-45.ngrok.io/api/riwayat-pembatalan/${id}`,
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

  const handleAjukanRefund = (order_id) => {
    handleMessage(null);
    setVisible(true)
    setIsDisabled(true);
    if(selectedValue != 'Pilih' && nama_di_rekening != ''){
      if(selectedValue != 'Bank Lainnya'){
        axios({
          url:`http://e565-180-242-214-45.ngrok.io/api/refunds/${order_id}`,
          method:"POST",
          headers: {
            //  'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+token,
          },
          data:
          {
            order_id:order_id,
            tenant_id: id,
            metode_refund: selectedValue,
            no_rekening: noRek,
            nama_penerima: nama_di_rekening,
            // detail_order_id: item?.[0].detail_order.id,
            ket_verif_admin: 'belum',
            ket_persetujuan_kepala_uptd: 'belum',
            ket_persetujuan_kepala_dinas: 'belum',
            refund_bendahara: 0,
            bukti_refund:'',
          },
        })
        .then((response) => {
          const result = response.data;
          const { pesan, success, status } = result;
          console.log(response.data);
          if(pesan == 'Pengajuan Refund Berhasil!'){
            const alat=item.alat
            console.log('tes', item)
            // alat.map((item)=> {
            //   axios({
            //     url:`http://e565-180-242-214-45.ngrok.io/api/detail-refunds/${item?.[0].detail_order.id}`,
            //     method:"POST",
            //     headers: {
            //       //  'Accept': 'application/json',
            //         'Content-Type': 'application/json',
            //         'Authorization': 'Bearer '+token,
            //     },
            //     data:
            //     {
            //       order_id:order_id,
            //       detail_order_id: item?.[0].detail_order.id,
            //     },
            //   })
            //   .then((response) => {
            //     const result = response.data;
            //     const { message, success, status } = result;
            //     console.log(response.data);
            //     setVisible(false)
            //     setIsDisabled(false);
            //     setModalVisible(!modalVisible)
            //   })
            //   .catch((error)=> {
            //     // console.error('error', error);
            //     console.log(error.response)
            //     handleMessage("Gagal!");
            //   });
            // })
            Alert.alert("Berhasil", "Pengajuan Refund Berhasil!", [
              {
                text:"OK",
                onPress: () => navigation.navigate('Pembatalan'),
              },
            ]);
          }
          else if(pesan == 'Anda telah mengajukan pengembalian Dana!'){
            Alert.alert("Tidak dapat mengajukan pengembalian dana!", "Anda telah mengajukan pengembalian dana untuk pesanan ini.");
          }
          setVisible(false)
          setIsDisabled(false);
          setModalVisible(!modalVisible)
        })
        .catch((error)=> {
          // console.error('error', error);
          console.log(error.response)
          handleMessage("Gagal!");
        });
      } else {
        axios({
          url:`http://e565-180-242-214-45.ngrok.io/api/refunds/${order_id}`,
          method:"POST",
          headers: {
            //  'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+token,
          },
          data:
          {
            order_id:order_id,
            tenant_id: id,
            metode_refund: lainnya,
            no_rekening: noRek,
            nama_penerima: nama_di_rekening,
            // detail_order_id: item?.[0].detail_order.id,
            ket_verif_admin: 'belum',
            ket_persetujuan_kepala_uptd: 'belum',
            ket_persetujuan_kepala_dinas: 'belum',
            refund_bendahara: 0,
            bukti_refund:'',
          },
        })
        .then((response) => {
          const result = response.data;
          const { pesan, success, status } = result;
          console.log(response.data);
          const alat=item.alat
          console.log(alat)
          if(pesan == 'Pengajuan Refund Berhasil!'){
            // alat.map((item)=> {
            //   axios({
            //     url:`http://e565-180-242-214-45.ngrok.io/api/detail-refunds/${item?.[0].detail_order.id}`,
            //     method:"POST",
            //     headers: {
            //       //  'Accept': 'application/json',
            //         'Content-Type': 'application/json',
            //         'Authorization': 'Bearer '+token,
            //     },
            //     data:
            //     {
            //       order_id:order_id,
            //       detail_order_id: item?.[0].detail_order.id,
            //     },
            //   })
            //   .then((response) => {
            //     const result = response.data;
            //     const { message, success, status } = result;
            //     console.log(response.data);
            //     setVisible(false)
            //     setIsDisabled(false);
            //     setModalVisible(!modalVisible)
            //   })
            //   .catch((error)=> {
            //     // console.error('error', error);
            //     console.log(error.response)
            //     handleMessage("Gagal!");
            //   });
            // })
            Alert.alert("Berhasil", "Pengajuan Refund Berhasil!", [
              {
                text:"OK",
                onPress: () => navigation.navigate('Pembatalan'),
              },
            ]);
          }
          else if(pesan == 'Anda telah mengajukan pengembalian Dana!'){
            Alert.alert("Tidak dapat mengajukan pengembalian dana!", "Anda telah mengajukan pengembalian dana untuk pesanan ini.");
          }
          setVisible(false)
          setIsDisabled(false);
          setModalVisible(!modalVisible)
        })
        .catch((error)=> {
          // console.error('error', error);
          console.log(error.response)
          handleMessage("Gagal!");
        });
      }
    }else{
      if(selectedValue == 'Pilih'){
        Alert.alert('Harap isi metode pembayaran!')
        setVisible(false)
        setIsDisabled(false);
      }
      if(nama_di_rekening == ''){
        Alert.alert('Harap isi nama di rekening!')
        setVisible(false)
        setIsDisabled(false);
      }
      if(noRek == ''){
        Alert.alert('Harap isi nomor rekening!')
        setVisible(false)
        setIsDisabled(false);
      }
    }
  };

  const handleMessage = (message, type = 'failed') => {
    setMessage(message);
    setMessageType(type);
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

  // useEffect(async() => {
  //   let isMounted = true
  //   setIsLoading(true);
  //   fetch('http://e565-180-242-214-45.ngrok.io/api/detail-orders')
  //     .then((response) => response.json())
  //     .then((hasil) => {
  //       setEquipments(hasil);
  //       setCari(hasil);
  //       setIsLoading(false);
  //     })
  //     // .finally(() => setLoading(false));
  //     .catch(error => { console.log; });
  // }, [isFocused]);

  const openSettingModal = (order_id) => {
    setOrderId(order_id);
    setModalVisible(!modalVisible);
  }

  const listOrders = ({item}) => {
    const alat = item.alat
    const inisialValue = 0
    var i;
    const total_hari = item.total_hari
    const total_jam = item.total_jam
    const count = item.total_alat
    const sum = harga_perhari + harga_perjam
    const order_id = item.id
    // const nama_alat=alat?.[0]?.[0].alat.nama_alat
    // console.log('alat',alat?.[0].alat?.[0].nama_alat)
    const nama_alat=alat?.[0]?.[0].alat.nama_alat
    const harga_perhari = alat?.[0]?.[0].alat.harga_sewa_perhari * total_hari
    const harga_perjam = alat?.[0]?.[0].alat.harga_sewa_perjam * total_jam
    // const harga_perjam = alat?.[0]?.[0]?.alat?.[0].harga_sewa_perjam * total_jam
    const eq=alat
    console.log('eq', eq)
    const total_harga_perhari = alat.reduce((total,item)=>{
      const harga_sewa_perhari = total_hari * item?.[0].alat.harga_sewa_perhari
      return total + harga_sewa_perhari;
    },0)
    const total_harga_perjam = alat.reduce((total,item)=>{
      const harga_sewa_perjam = total_jam * item?.[0].alat.harga_sewa_perjam
      return total + harga_sewa_perjam;
    },0)
    const id_alat=alat?.[0]?.equipment_id
    // console.log(id_alat)
    // useEffect(() => {
    //   let isMounted = true
    //   setIsLoading(true);
    //   fetch('https://sialbert.000webhostapp.com/teknisi/equipments/show/' +id_alat)
    //     .then((response) => response.json())
    //     .then((hasil) => {
    //       setData(hasil);
    //       setIsLoading(false);
    //     })
    //     // .finally(() => setLoading(false));
    //     .catch(error => { console.log; });
    // }, [isFocused]);
    var idLocale=require('moment/locale/id');
    Moment.locale('id');
    var dt = item.created_at
    var id_order =item.id
    var nama_instansi =item.nama_instansi


    return (
      <>
        <ScrollView>
          <TouchableOpacity
            onPress={() => navigation.navigate('Detail Pembatalan', {order: item})}
          >
            <View style={{ flexDirection:'row', textAlign:'center', textAlignVertical: 'center'}}>
              <View style={{ flexDirection:'row', margin:16, textAlign:'center', textAlignVertical: 'center',justifyContent: 'center' }}>
                {/* <Image source={{uri: item.foto}} style={styles.myequipmentImage} /> */}
                {item.status_bayar == 'telah_dibayar' ?
                  <Card style={styles.card}>
                    {(() => {
                      const order_id = item.id
                      console.log('order_id', order_id)
                      return (
                        <View>
                          <View style={{ margin:16, flexDirection:'row', justifyContent: "space-between"}}>
                            <View style={{ flexDirection: 'row' }}>
                              <Image source={Rent} style={{ width:24, height:24, marginRight:8 }} />
                              <Text style={{ fontWeight:'bold'}}>{Moment(dt).format('DD MMMM YYYY')}</Text>
                            </View>
                            {/* {(() => {
                            if(item.ket_persetujuan_kepala_dinas === 'setuju'){
                              return(
                                <View style={{ borderWidth:2, borderRadius:8, borderColor: '#11CF00', alignItems:'center', padding:2}}>
                                  <Text style={{ textAlign:'right', color:'#11CF00', alignItems: 'flex-end', justifyContent: 'flex-end', alignContent: 'flex-end'}}>Pengajuan telah disetujui</Text>
                                </View>
                              )
                            }
                            if(item.ket_persetujuan_kepala_uptd !== 'tolak' && item.ket_verif_admin !== 'tolak'){
                              if((item.ket_persetujuan_kepala_dinas === 'belum' || item.ket_persetujuan_kepala_uptd === 'belum') && item.ket_verif_admin === 'verif'){
                                return(
                                  <View style={{ borderWidth:2, borderRadius:8, borderColor: '#FAD603', alignItems:'center', padding:2}}>
                                    <Text style={{ textAlign:'right', color:'#FAD603', alignItems: 'flex-end', justifyContent: 'flex-end', alignContent: 'flex-end'}}>Menunggu persetujuan</Text>
                                  </View>
                                )
                              }
                              else if((item.ket_persetujuan_kepala_dinas === 'belum' || item.ket_persetujuan_kepala_uptd === 'belum') && item.ket_verif_admin === 'belum'){
                                return(
                                  <View style={{ borderWidth:2, borderRadius:8, borderColor: '#FAD603', alignItems:'center', padding:2}}>
                                    <Text style={{ textAlign:'right', color:'#FAD603', alignItems: 'flex-end', justifyContent: 'flex-end', alignContent: 'flex-end'}}>Menunggu verifikasi</Text>
                                  </View>
                                )
                              }
                            }
                            if(item.ket_verif_admin === 'tolak' || item.ket_persetujuan_kepala_uptd === 'tolak' || item.ket_persetujuan_kepala_dinas === 'tolak'){
                              return(
                                <View style={{ borderWidth:2, borderRadius:8, borderColor: '#FB1313', alignItems:'center', padding:2}}>
                                  <Text style={{ textAlign:'right', color:'#FB1313', alignItems: 'flex-end', justifyContent: 'flex-end', alignContent: 'flex-end'}}>Pengajuan Ditolak</Text>
                                </View>
                              )
                            }
                            return null;
                            })()} */}
                          </View>
                          <View style={styles.border2}/>
                          <View style={{ margin:16 }}>
                            <Text>{item.nama_kegiatan}</Text>
                            {/* <Text>nama alat{alat?.[0]?.[0].alat.nama_alat}</Text> */}
                            <View style={{ flexDirection:'row', justifyContent: "space-between" }}>
                              <Image source={{ uri:'https://sialbert.000webhostapp.com/'+alat?.[0]?.[0].alat.foto + '/' +alat?.[0]?.[0].alat.foto }} style={{ width:58, height:58, marginRight:8 }} />
                              <View>
                                <Text>{item.alat?.[0]?.[0].alat.nama_alat}</Text>
                                {item.total_hari > 0 ?
                                  <Text style={{ fontWeight:'bold' }}>Rp.{Number(alat?.[0]?.[0].alat.harga_sewa_perhari).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-</Text>:
                                  <Text style={{ fontWeight:'bold' }}>Rp.{Number(alat?.[0]?.[0].alat.harga_sewa_perjam).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-</Text>
                                }
                                {item.total_hari > 0 ?
                                  <Text>x{item.total_hari} hari</Text>:
                                  <Text>x{item.total_hari} jam</Text>
                                }
                                {item.total_hari > 0 ?
                                  <Text style={{ fontWeight:'bold' }}>Rp.{Number(alat?.[0]?.[0].alat.harga_sewa_perhari *item.total_hari).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-</Text>:
                                  <Text style={{ fontWeight:'bold' }}>Rp.{Number(alat?.[0]?.[0].alat.harga_sewa_perjam *item.total_jam).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-</Text>
                                }
                              </View>
                            </View>
                            <View style={styles.border2}/>
                            <View style={{ flexDirection:'row', justifyContent: "space-between" }}>
                              <Text>{count} Alat</Text>
                              <View style={{ flexDirection: 'row', marginTop:4 }}>
                                <Text>Total Pesanan:</Text>
                                {item.total_hari > 0 ?
                                  <Text style={{ marginLeft:8 , fontWeight:'bold'}}>Rp.{total_harga_perhari.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-</Text>:
                                  <Text style={{ marginLeft:8 , fontWeight:'bold'}}>Rp.{total_harga_perhari.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-</Text>
                                }
                              </View>
                              {/* {alat &&
                                alat.map((item, idx) => {
                                  const harga_sewa_perhari = total_hari * item.harga_sewa_perhari
                                  const harga_sewa_perjam = total_jam * item.harga_sewa_perjam
                                  const total = harga_sewa_perjam + harga_sewa_perhari
                                  return(
                                    <View key={idx}>
                                      <Text>{total}</Text>
                                    </View>
                                  )
                                })
                              } */}
                            </View>
                          </View>
                          <View style={styles.border2}/>
                          <Text style={{ textAlign:'center', margin: 4, color: "#C4C4C4"}}>Lihat Detail</Text>
                          <View style={styles.border2}/>
                          <View style={{ flexDirection:'row', margin:4 }}>
                            <TouchableOpacity
                              // onPress={(e) =>
                              //   {
                              //     onPress={() => openSettingModal(detail_order_id)}
                              //     handleAjukanRefund(e, order_id)
                              //   }
                              // }
                              onPress={() => openSettingModal(order_id)}>
                              <View style={styles.button}>
                                <Text style={styles.buttonTitle}>Ajukan Pengembalian Dana</Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                      </View>
                      )
                    })()}
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
                          <View style={{ margin: 8, backgroundColor: '#ffcd04', borderRadius: 20, borderColor: '#ffcd04', borderWidth:2 }}>
                            <Picker
                              style={styles.pickerCustomeStyle}
                              mode='dropdown'
                              style={{ color: 'white'}}
                              // value={rekening}
                              selectedValue={selectedValue}
                              onValueChange={(itemValue, itemIndex) =>
                                setFieldValue(itemValue)
                              }
                              >
                              <Picker.Item label="--Pilih Bank--" value="Pilih" key={1}/>
                              <Picker.Item label="Bank Kalbar" value="Bank Kalbar" key={2}/>
                              <Picker.Item label="Bank BCA" value="Bank BCA" key={3}/>
                              <Picker.Item label="Bank Mandiri" value="Bank Mandiri" key={4}/>
                              <Picker.Item label="Bank BNI" value="Bank BNI" key={5}/>
                              <Picker.Item label="Bank BRI" value="Bank BRI" key={6}/>
                              <Picker.Item label="Bank Syariah Indonesia (BSI)" value="Bank Syariah Indonesia (BSI)" key={7}/>
                              <Picker.Item label="Bank Permata" value="Bank Permata" key={8}/>
                              <Picker.Item label="Bank lainnya" value="Bank Lainnya" key={9}/>
                            </Picker>
                          </View>
                          {selectedValue == 'Bank Lainnya' &&
                            <TextInput
                              autoCapitalize="none"
                              autoCorrect={false}
                              returnKeyType="next"
                              placeholder="Isi nama Bank"
                              style={styles.textInput}
                              onChangeText={setLainnya}
                              value={lainnya}
                              editable={true}
                            />
                          }
                          <TextInput
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="next"
                            keyboardType='number-pad'
                            placeholder="Nomor Rekening"
                            style={styles.textInput}
                            onChangeText={setNoRek}
                            value={noRek}
                            editable={true}
                          />
                          <TextInput
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="next"
                            placeholder="Nama di rekening"
                            style={styles.textInput}
                            onChangeText={setNamaDiRekening}
                            value={nama_di_rekening}
                            editable={true}
                          />
                          <TouchableOpacity onPress={() => handleAjukanRefund(order_id)}
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
                  </Card>:
                  <Card style={styles.card2}>
                    {(() => {
                      const order_id = item.id
                      console.log(order_id)
                      return (
                        <View>
                          <View style={{ margin:16, flexDirection:'row', justifyContent: "space-between"}}>
                            <View style={{ flexDirection: 'row' }}>
                              <Image source={Rent} style={{ width:24, height:24, marginRight:8 }} />
                              <Text style={{ fontWeight:'bold'}}>{Moment(dt).format('DD MMMM YYYY')}</Text>
                            </View>
                            {/* {(() => {
                            if(item.ket_persetujuan_kepala_dinas === 'setuju'){
                              return(
                                <View style={{ borderWidth:2, borderRadius:8, borderColor: '#11CF00', alignItems:'center', padding:2}}>
                                  <Text style={{ textAlign:'right', color:'#11CF00', alignItems: 'flex-end', justifyContent: 'flex-end', alignContent: 'flex-end'}}>Pengajuan telah disetujui</Text>
                                </View>
                              )
                            }
                            if(item.ket_persetujuan_kepala_uptd !== 'tolak' && item.ket_verif_admin !== 'tolak'){
                              if((item.ket_persetujuan_kepala_dinas === 'belum' || item.ket_persetujuan_kepala_uptd === 'belum') && item.ket_verif_admin === 'verif'){
                                return(
                                  <View style={{ borderWidth:2, borderRadius:8, borderColor: '#FAD603', alignItems:'center', padding:2}}>
                                    <Text style={{ textAlign:'right', color:'#FAD603', alignItems: 'flex-end', justifyContent: 'flex-end', alignContent: 'flex-end'}}>Menunggu persetujuan</Text>
                                  </View>
                                )
                              }
                              else if((item.ket_persetujuan_kepala_dinas === 'belum' || item.ket_persetujuan_kepala_uptd === 'belum') && item.ket_verif_admin === 'belum'){
                                return(
                                  <View style={{ borderWidth:2, borderRadius:8, borderColor: '#FAD603', alignItems:'center', padding:2}}>
                                    <Text style={{ textAlign:'right', color:'#FAD603', alignItems: 'flex-end', justifyContent: 'flex-end', alignContent: 'flex-end'}}>Menunggu verifikasi</Text>
                                  </View>
                                )
                              }
                            }
                            if(item.ket_verif_admin === 'tolak' || item.ket_persetujuan_kepala_uptd === 'tolak' || item.ket_persetujuan_kepala_dinas === 'tolak'){
                              return(
                                <View style={{ borderWidth:2, borderRadius:8, borderColor: '#FB1313', alignItems:'center', padding:2}}>
                                  <Text style={{ textAlign:'right', color:'#FB1313', alignItems: 'flex-end', justifyContent: 'flex-end', alignContent: 'flex-end'}}>Pengajuan Ditolak</Text>
                                </View>
                              )
                            }
                            return null;
                            })()} */}
                          </View>
                          <View style={styles.border2}/>
                          <View style={{ margin:16 }}>
                            <Text>{item.nama_kegiatan}</Text>
                            <View style={{ flexDirection:'row', justifyContent: "space-between" }}>
                              <Image source={{ uri:'https://sialbert.000webhostapp.com/'+alat?.[0]?.[0].alat.foto + '/' +alat?.[0]?.[0].alat.foto }} style={{ width:58, height:58, marginRight:8 }} />
                              <View>
                                <Text>{alat?.[0]?.[0].alat.nama_alat}</Text>
                                {item.total_hari > 0 ?
                                  <Text style={{ fontWeight:'bold' }}>Rp.{Number(alat?.[0]?.[0].alat.harga_sewa_perhari).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-</Text>:
                                  <Text style={{ fontWeight:'bold' }}>Rp.{Number(alat?.[0]?.[0].alat.harga_sewa_perjam).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-</Text>
                                }
                                {item.total_hari > 0 ?
                                  <Text>x{item.total_hari} hari</Text>:
                                  <Text>x{item.total_hari} jam</Text>
                                }
                                {item.total_hari > 0 ?
                                  <Text style={{ fontWeight:'bold' }}>Rp.{Number(alat?.[0]?.[0].alat.harga_sewa_perhari *item.total_hari).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-</Text>:
                                  <Text style={{ fontWeight:'bold' }}>Rp.{Number(alat?.[0]?.[0].alat.harga_sewa_perjam *item.total_jam).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-</Text>
                                }
                              </View>
                            </View>
                            <View style={styles.border2}/>
                            <View style={{ flexDirection:'row', justifyContent: "space-between" }}>
                              <Text>{count} Alat</Text>
                              <View style={{ flexDirection: 'row', marginTop:4 }}>
                                <Text>Total Pesanan:</Text>
                                {item.total_hari > 0 ?
                                  <Text style={{ marginLeft:8 , fontWeight:'bold'}}>Rp.{total_harga_perhari.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-</Text>:
                                  <Text style={{ marginLeft:8 , fontWeight:'bold'}}>Rp.{total_harga_perhari.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-</Text>
                                }
                              </View>
                              {/* {alat &&
                                alat.map((item, idx) => {
                                  const harga_sewa_perhari = total_hari * item.harga_sewa_perhari
                                  const harga_sewa_perjam = total_jam * item.harga_sewa_perjam
                                  const total = harga_sewa_perjam + harga_sewa_perhari
                                  return(
                                    <View key={idx}>
                                      <Text>{total}</Text>
                                    </View>
                                  )
                                })
                              } */}
                            </View>
                          </View>
                          <View style={styles.border2}/>
                          <Text style={{ textAlign:'center', margin: 4, color: "#C4C4C4"}}>Lihat Detail</Text>
                          <View style={styles.border2}/>
                      </View>
                      )
                    })()}
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
                          <View style={{ margin: 8, backgroundColor: '#ffcd04', borderRadius: 20, borderColor: '#ffcd04', borderWidth:2 }}>
                            <Picker
                              style={styles.pickerCustomeStyle}
                              mode='dropdown'
                              style={{ color: 'white'}}
                              // value={rekening}
                              selectedValue={selectedValue}
                              onValueChange={(itemValue, itemIndex) =>
                                setFieldValue(itemValue)
                              }
                              >
                              <Picker.Item label="--Pilih Bank--" value="Pilih" key={1}/>
                              <Picker.Item label="Bank Kalbar" value="Bank Kalbar" key={2}/>
                              <Picker.Item label="Bank BCA" value="Bank BCA" key={3}/>
                              <Picker.Item label="Bank Mandiri" value="Bank Mandiri" key={4}/>
                              <Picker.Item label="Bank BNI" value="Bank BNI" key={5}/>
                              <Picker.Item label="Bank BRI" value="Bank BRI" key={6}/>
                              <Picker.Item label="Bank Syariah Indonesia (BSI)" value="Bank Syariah Indonesia (BSI)" key={7}/>
                              <Picker.Item label="Bank Permata" value="Bank Permata" key={8}/>
                              <Picker.Item label="Bank lainnya" value="Bank Lainnya" key={9}/>
                            </Picker>
                          </View>
                          {selectedValue == 'Bank Lainnya' &&
                            <TextInput
                              autoCapitalize="none"
                              autoCorrect={false}
                              returnKeyType="next"
                              placeholder="Isi nama Bank"
                              style={styles.textInput}
                              onChangeText={setLainnya}
                              value={lainnya}
                              editable={true}
                            />
                          }
                          <TextInput
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="next"
                            keyboardType='number-pad'
                            placeholder="Nomor Rekening"
                            style={styles.textInput}
                            onChangeText={setNoRek}
                            value={noRek}
                            editable={true}
                          />
                          <TextInput
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="next"
                            placeholder="Nama di rekening"
                            style={styles.textInput}
                            onChangeText={setNamaDiRekening}
                            value={nama_di_rekening}
                            editable={true}
                          />
                          <TouchableOpacity onPress={() => handleAjukanRefund(order_id)}
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
                }
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
        <View style={{ height: '100%', paddingBottom: 48, margin: 16 }}>
          <View style={{ height: 48, textAlignVertical: 'center', backgroundColor: '#ffcd04', borderTopLeftRadius:15, borderTopRightRadius:15}}>
            <Text style={{ marginLeft:16, marginTop:14, textAlignVertical: 'center', fontWeight:'bold', color: '#ffffff' }}>Riwayat Pembatalan</Text>
          </View>
          <StatusBar style="auto" />
          <View style={{ borderLeftColor:'blue' }}>
            <View style={styles.container}>
              <View style={{ justifyContent: 'center', flexDirection: "row", flex:1}}>
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
                          <Text>Anda belum pernah melakukan pembatalan</Text>
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
              </View>
            </View>
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
    height: '100%',
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
    backgroundColor: '#2196F3',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    textAlign: 'center',
    padding:8,
    textAlign:'center'
  },
  buttonClose: {
    backgroundColor: "red",
    marginTop: 4
  },
  buttonTitle: {
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 0,
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
    shadowOpacity: 1,
    width: '100%',
    height: 320,
    borderColor:'#2196F3',
    borderWidth:2,
    marginVertical: 8
  },
  card2: {
    shadowOffset: {width:0, height:2},
    shadowOpacity: 1,
    width: '100%',
    height: 260,
    borderColor:'#2196F3',
    borderWidth:2,
    marginVertical: 8
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
  button: {
    backgroundColor: '#ffcd04',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    textAlign: 'center',
    marginTop:4,
    marginBottom:8,
    padding:8,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
});
