import React, {useContext} from 'react';
import { StyleSheet, Text, View, Image, FlatList, Alert, Pressable, ActivityIndicator, SafeAreaView, TextInput, Modal, TouchableOpacity, Dimensions, ImageBackground, Button } from "react-native";
import { useState, useEffect } from "react";

import FloatingTabBar from "../components/FloatingTabBar";
import { ScrollView } from "react-native-gesture-handler";
import { Asset } from 'expo-asset';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card, Badge } from 'react-native-paper';
import Moment from 'moment';
import ActivityIndicatorExample  from "../components/ActivityIndicatorExample";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from './../components/CredentialsContext';
const win = Dimensions.get("window");
import logo from "../assets/icon.png";
import axios from 'axios';
import { Formik, form } from 'formik';
import * as yup from 'yup';
import { useIsFocused } from '@react-navigation/native';

export default function DetailOrder({ navigation, route }) {
  const {order} = route.params;
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const [data, setData] = useState([]);
  const [skr, setSkr] = useState({});
  const [payment, setPayment] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [page, setPage] = useState(1);
  const [text, setText] = useState('');
  const [alasan, setAlasan] = useState('');
  const [detail_order_id, setDetailOrderId] = useState();
  const [cari, setCari] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const isFocused = useIsFocused();

  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
  const alat = [...order.alat?.[0]]
  console.log('alat', alat)
  const total_hari = order.total_hari
  const total_jam = order.total_jam
  const harga_perhari = alat?.[0]?.harga_sewa_perhari * total_hari
  const harga_perjam = alat?.[0]?.harga_sewa_perjam * total_jam
  const sum = harga_perhari + harga_perjam
  const nama = alat?.[0]?.nama_alat
  const id_order=order.id
  const id_alat = order.id
  const total_harga_perhari = alat.reduce((total,item)=>{
    const harga_sewa_perhari = total_hari * item.harga_sewa_perhari
    return total + harga_sewa_perhari;
  },0)
  const total_harga_perjam= alat.reduce((total,item)=>{
    const harga_sewa_perjam = total_jam * item.harga_sewa_perjam
    return total + harga_sewa_perjam;
  },0)

  useEffect(async() => {
    setIsLoading(true);
    fetch('http://e565-180-242-214-45.ngrok.io/api/orders')
      .then((response) => response.json())
      .then((hasil) => {
        setData(hasil);
        setCari(hasil);
        setIsLoading(false);
      })
      // .finally(() => setLoading(false));
      .catch(error => { console.log; });

  }, [isFocused]);

  useEffect(async() => {
    setIsLoading(true);
    fetch('http://e565-180-242-214-45.ngrok.io/api/detail-orders')
      .then((response) => response.json())
      .then((hasil) => {
        setEquipments(hasil);
        setCari(hasil);
        setIsLoading(false);
      })
      // .finally(() => setLoading(false));
      .catch(error => { console.log; });

  }, [isFocused]);
  var idLocale=require('moment/locale/id');
  Moment.locale('id');
  var dtMulai = order.tanggal_mulai
  var dtSelesai = order.tanggal_selesai
  var order_id = order.id

  useEffect(async() => {
    setIsLoading(true);
    fetch(`http://e565-180-242-214-45.ngrok.io/api/cekPayments/${order_id}`)
      .then((response) => response.json())
      .then((hasil) => {
        setPayment(hasil);
        setIsLoading(false);
      })
      // .finally(() => setLoading(false));
      .catch(error => { console.log; });

  }, [isFocused]);

  console.log(payment.data)

  // const tes = [...payment.data]
  // console.log(tes.konfirmasi_pembayaran)

  const batalValidationSchema = yup.object().shape({
    alasan: yup
      .string()
      .required('Alasan wajib diisi!'),
  })

  const detail_id = order.id
  console.log(detail_id)

  const handleAjukanPembatalan = (detail_order_id) => {
    handleMessage(null);
    setAlasan(alasan)
    console.log(detail_order_id)

    if(alasan !== ''){
      axios({
        url:`http://e565-180-242-214-45.ngrok.io/api/pembatalan/${detail_order_id}`,
        method:"POST",
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
          Alert.alert("Berhasil", "Pembatalan Berhasil!", [
            {
              text:"OK",
              onPress: () => navigation.navigate('Pembatalan'),
            },
          ]);
        }
        else if (message == 'Masa penyewaan telah berakhir') {
          Alert.alert("Anda tidak dapat melakukan pembatalan.", "Masa penyewaan telah berakhir.");
        }
        else if (message == 'Kembalikan alat terlebih dahulu!') {
          Alert.alert("Tidak dapat melakukan pembatalan jika sedang memakai alat.", "Kembalikan alat terlebih dahulu untuk melakukan pembatalan dan mengajukan pegembalian dana!");
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

  useEffect(async() => {
    let isMounted = true
    fetch(`http://e565-180-242-214-45.ngrok.io/api/cekSkr/${id_order}`)
      .then((response) => response.json())
      .then((hasil) => {
        setSkr(hasil);
      })
      // .finally(() => setLoading(false));
      .catch(error => { console.log; });
  }, [isFocused]);

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

  console.log(skr)

  return (
    <SafeAreaView style={{ justifyContent: 'center', flexDirection: "row", flex:1,  backgroundColor: '#fff'}}>
      {isLoading &&
        <View style={{
          justifyContent: 'center',
          textAlign: 'center',
          textAlignVertical: 'center',
          textAlign: 'center',
          flex: 1,
          alignItems: 'center'
        }}>
          <ActivityIndicatorExample style={ styles.progress }/>
        </View>
      }
      {!isLoading &&
        <ScrollView style={{ paddingBottom:8}}>
          <SafeAreaView>
            <Card style={{ backgroundColor: '#fff', paddingBottom:32}}>
              <View style={{ flexDirection:'row', justifyContent: "space-between", height: 48, backgroundColor: '#25185A'}}>
                <Image style={styles.icon} source={logo} />
                <Text style={{ marginRight:16, textAlignVertical: 'center', fontWeight:'bold', color: '#ffffff' }}>Kode Pemesanan: {order.kode_pesanan}</Text>
              </View>
              <View style={{ padding:16 }}>
                {/* {payment.status == '1' &&
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
                } */}
                <Card style={styles.card}>
                  <View style={{ height: 48, textAlignVertical: 'center', backgroundColor: '#25185A', borderTopLeftRadius:15, borderTopRightRadius:15}}>
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
                  <View style={{ height: 48, textAlignVertical: 'center', backgroundColor: '#25185A', borderTopLeftRadius:15, borderTopRightRadius:15}}>
                    <Text style={{ marginLeft:16, marginTop:14, textAlignVertical: 'center', fontWeight:'bold', color: '#ffffff' }}>Detail Orderan</Text>
                  </View>
                  {alat.map((item)=>
                    <Card key={item.id_alat} {...item} style={styles.card3}>
                      {(() => {
                        const detail_order_id = item.id
                        console.log(detail_order_id)
                        console.log('harga', item.harga_sewa_perhari)
                        return(
                          <View>
                            <View style={{ flexDirection:'row', justifyContent: "space-between", paddingHorizontal:8}}>
                              <View style={{ flexDirection:'row' }}>
                                <Image source={{ uri:'https://sialbert.000webhostapp.com/'+item.foto +'/'+item.foto }} style={{ width:58, height:58, marginRight:8, marginTop: 8 }} />
                                <View style={{ justifyContent:'center', textAlignVertical:'center' }}>
                                  <Text>{item.nama_alat}</Text>
                                  <Text>x1</Text>
                                </View>
                              </View>
                            </View>
                            {order.total_hari > 0 ?
                              <View style={{ flexDirection:'row', marginHorizontal: 16, justifyContent:'space-between' }}>
                                <View style={{ flexDirection:'row' }}>
                                  <Text style={{ justifyContent:'center', textAlignVertical:'center' }}>Rp.{Number(item.harga_sewa_perhari).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-</Text>
                                  <Text style={{ justifyContent:'center', textAlignVertical:'center', fontWeight:'bold' }}> X</Text>
                                  <Text style={{ justifyContent:'center', textAlignVertical:'center' }}> {total_hari} Hari</Text>
                                </View>
                                <Text style={{ margin: 16 }}>Rp.{(item.harga_sewa_perhari * total_hari).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-</Text>
                              </View>:
                              <View style={{ flexDirection:'row', marginHorizontal: 16, justifyContent:'space-between' }}>
                                <View style={{ flexDirection:'row' }}>
                                  <Text style={{ justifyContent:'center', textAlignVertical:'center' }}>Rp.{item.harga_sewa_perjam.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-</Text>
                                  <Text style={{ justifyContent:'center', textAlignVertical:'center', fontWeight:'bold' }}> X</Text>
                                  <Text style={{ justifyContent:'center', textAlignVertical:'center' }}> {total_jam} Jam</Text>
                                </View>
                                <Text style={{ margin: 16 }}>Rp.{Number(item.harga_sewa_perjam * total_jam).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-</Text>
                              </View>
                            }
                          </View>
                        )
                      })()}
                    </Card>
                  )}
                  <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
                    <Text style={{ fontWeight:'bold', fontSize:16, fontWeight:'bold', margin:16 }}> Total :</Text>
                    {total_hari > 0 ?
                      <Text style={{ textAlign:'right', fontSize:16, fontWeight:'bold', margin:16 }}>Rp.{Number(total_harga_perhari).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-</Text>:
                      <Text style={{ textAlign:'right', fontSize:16, fontWeight:'bold', margin:16 }}>Rp.{Number(total_harga_perjam).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-</Text>
                    }
                  </View>
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
          </SafeAreaView>
        </ScrollView>
      }
    </SafeAreaView>
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
    marginBottom: 40,
    borderColor:'#2196F3',
    borderWidth:2
  },
  card3: {
    shadowOffset: {width:0, height:2},
    shadowOpacity: 0.5,
    width: '100%',
    borderColor:'#2196F3',
    borderWidth:1
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
