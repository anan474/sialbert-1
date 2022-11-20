import React, {useContext} from 'react';
import { StyleSheet, Text, View, Image, Platform, SafeAreaView, Alert, ActivityIndicator, TextInput, TouchableOpacity, Dimensions, ImageBackground, Button } from "react-native";
import { useState, useEffect } from "react";

import { ScrollView } from "react-native-gesture-handler";
import { Asset } from 'expo-asset';
import { AntDesign } from '@expo/vector-icons'
import ActivityIndicatorExample  from "../../components/ActivityIndicatorExample";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from '../../components/CredentialsContext';
import { Formik, useFormik, Form } from 'formik';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
// import Step1 from "./forms/FormFirstStep";
// import Step2 from "./forms/FormSecondStep";
import AnimatedMultistep from "react-native-animated-multistep";
import ScrollViewIndicator from 'react-native-scroll-indicator';
import {Picker} from '@react-native-picker/picker';
import { CartContext } from '../../components/CartContext';
import uuid from 'react-native-uuid';

import Add from "../../assets/image/plus.png";

// import { FormSuccess } from "./forms/FormSuccess";
import * as yup from 'yup';
import { makeStyles } from "@material-ui/core/styles";
import Moment from 'moment';
import { Card } from 'react-native-paper';
import axios from 'axios';
import FormData from 'form-data';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

const win = Dimensions.get("window");

const html = `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  </head>
  <body style="text-align: center;">
    <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
      Hello Expo!
    </h1>
    <img
      src="https://d30j33t1r58ioz.cloudfront.net/static/guides/sdk.png"
      style="width: 90vw;" />
  </body>
</html>
`;

export default function FormulirOrder({navigation, route}) {
  const {value} = route.params;
  const [data, setData] = useState([]);
  const [text, setText] = useState('');
  const [cari, setCari] = useState([]);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRange, setRange] = useState({});
  const [date1, setDate] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [mode2, setMode2] = useState('date');
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [currentDate, setCurrentDate] = useState();
  const [ktp, setKtp] = useState(null);
  const [aktaN, setAktaNotaris] = useState(null);
  const [suratP, setSuratPengantar] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState();
  const [selectedValue, setFieldValue] = useState('1');
  const {items, setItems, itemCount, setItemCount} = useContext(CartContext);

  const print = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html,
      printerUrl: selectedPrinter?.url, // iOS only
    });
  }

  const printToFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({
      html
    });
    console.log('File has been saved to:', uri);
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  }

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // iOS only
    setSelectedPrinter(printer);
  }


  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
  const {nama, email, id, token} = storedCredentials;

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

  var idLocale=require('moment/locale/id');
  Moment.locale('id');

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date1;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const onChange2 = (event, selectedDate) => {
    const currentDate = selectedDate || date2;
    setShow2(Platform.OS === 'ios');
    setDate2(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showMode2 = (currentMode2) => {
    setShow2(true);
    setMode2(currentMode2);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };
  const showDatepicker2 = () => {
    showMode2('date');
  };

  const showTimepicker2 = () => {
    showMode2('time');
  };

  const category_order_id =value.category_order_id
  const tMulai = Moment(date1)
  const tSelesai = Moment(date2)
  const dayDiff = tSelesai.diff(tMulai, 'days');
  const hoursDiff = tSelesai.diff(tMulai, 'hours');
  const minuteDiff = tSelesai.diff(tMulai, 'minutes');
  // console.log(tMulai)
  // console.log(dayDiff)

  const tanggalMulai = Moment(date1).format('YYYY-MM-DD HH:mm:ss')
  const tanggalSelesai = Moment(date2).format('YYYY-MM-DD HH:mm:ss')
  const tgl_mulai= Moment(date1).format('YYYY-MM-DD')
  const tgl_selesai= Moment(date2).format('YYYY-MM-DD')

  const date = new Date();

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const pickKtp = async () => {
    // No permissions request is necessary for launching the image library
    let response = await DocumentPicker.getDocumentAsync({
      type: ['image/*','application/pdf'],
    });

    console.log(response);

    if (!response.cancelled) {
      setKtp(response.uri);
    }
  };

  const pickAktaNotaris = async () => {
    // No permissions request is necessary for launching the image library
    let response = await DocumentPicker.getDocumentAsync({
      type: ['image/*','application/pdf'],
    });

    console.log(response);

    if (!response.cancelled) {
      setAktaNotaris(response.uri);
    }
  };

  const pickSuratPengantar = async () => {
    // No permissions request is necessary for launching the image library
    let response = await DocumentPicker.getDocumentAsync({
      type: ['image/*','application/pdf'],
    });

    console.log(response);

    if (!response.cancelled) {
      setSuratPengantar(response.uri);
    }
  };

  const createFormData = (akta_notaris, body = {}) => {
    const datasAktaNotaris = new FormData();

    datasAktaNotaris.append('akta_notaris', {
      name: akta_notaris.fileName,
      type: akta_notaris.type,
      uri: Platform.OS === 'ios' ? akta_notaris.uri.replace('file://', '') : akta_notaris.uri,
    });

    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });

    return datasAktaNotaris;
  };

  const handleAjukanSewa = (credentials, isSubmitting) => {
    handleMessage(null);

    // if(hoursDiff > 0){
    if (ktp != null) {
      axios({
        url:`http://e565-180-242-214-45.ngrok.io/api/orders/post/${id}`,
        method:"POST",
        headers: {
          //  'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+token,
        },
        data:
        {
          category_order_id:value.category_order_id,
          nama_kegiatan: value.nama_kegiatan,
          tenant_id:value.tenant_id,
          nama_instansi: value.nama_instansi,
          jabatan:value.jabatan,
          alamat_instansi:value.alamat_instansi,
          tanggal_mulai:tanggalMulai,
          tanggal_selesai: tanggalSelesai,
        },
      })
      .then((response) => {
        const result = response.data;
        const { message, success, status, order_id } = result;
        console.log(data)
        axios({
          url:'https://sialbert.000webhostapp.com/teknisi/api/order/create',
          method:"POST",
          data:
          {
            id_orderan:order_id.kode_pesanan,
            id_penyewa:value.tenant_id,
            tgl_sewa:tgl_mulai,
            tgl_masuk: tgl_selesai,
            nama_perusahaan: value.nama_instansi,
            alamat_perusahaan:value.alamat_instansi,
            nama_kegiatan: value.nama_kegiatan,
            alamat_kegiatan: value.alamat_kegiatan,
          },
        })
        .then((response) => {
          // const result = response.data;
          // const { message, success, status, data } = result;
          console.log('response', response.data);
        })
        .catch((error)=> {
          // console.error('error', error);
          console.log(error.response)
          handleMessage("Tidak ada koneksi internet!");
        });
        console.log(response.data);
        const datasKtp = new FormData();
        datasKtp.append('ktp', {
          name: 'ktp.jpg',
          type: 'image/jpeg',
          uri:  ktp,
        });

        if (ktp != null) {
          axios({
            url:`http://e565-180-242-214-45.ngrok.io/api/orders/post/ktp/${id}`,
            method:"POST",
            headers: {
              //  'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+token,
            },
            data: datasKtp
          })
          .then((response) => {
            console.log(response.data);
            const result = response.data;
            const { message, success, status, hasil } = result;
            items.map((item)=> {
              axios({
                url:`http://e565-180-242-214-45.ngrok.io/api/detail-orders/post/${id}`,
                method:"POST",
                headers: {
                  //  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer '+token,
                },
                data:
                {
                  order_id:hasil,
                  equipment_id: item.product.id_alat,
                },
              })
              .then((response) => {
                const result = response.data;
                const { message, success, status, details } = result;
                console.log('details',details.id)
                axios({
                  url:'https://sialbert.000webhostapp.com/teknisi/equipments/detailOrder',
                  method:"POST",
                  data:
                  {
                    id_orderan:order_id.kode_pesanan,
                    detail_order_id: details.id,
                    id_alat:item.product.id_alat,
                    jumlah_hari:dayDiff,
                    jumlah_jam: hoursDiff,
                  },
                })
                .then((response) => {
                  // const result = response.data;
                  // const { message, success, status, data } = result;
                  console.log('response', response.data);
                })
                .catch((error)=> {
                  // console.error('error', error);
                  console.log(error.response)
                  handleMessage("Tidak ada koneksi internet!");
                });
                console.log(response.data);
              })
              .catch((error)=> {
                // console.error('error', error);
                console.log(error.response)
                handleMessage("Gagal!");
              });
            })
            console.log('hasil', hasil)
            Alert.alert("Berhasil", "Pengajuan Pemesanan Berhasil!", [
              {
                text:"OK",
                onPress: () => navigation.navigate('pdfFormulirOrder', {order_id: hasil}),
              },
            ]);
            console.log(response.data);
          })
          .catch((error)=> {
            // console.error('error', error);
            console.log(error.response)
            handleMessage("Format KTP haru dalam bentuk jpg, jpeg, png, pdf!");
          });
        } else {
          alert('KTP tidak boleh kosong!');
        }

        const datasAktaNotaris = new FormData();

        datasAktaNotaris.append('akta_notaris', {
          name: 'akta_notaris.jpg',
          type: 'image/jpeg',
          uri:  aktaN,
        });

        if (category_order_id == '1') {
          axios({
            url:`http://e565-180-242-214-45.ngrok.io/api/orders/post/aktaNotaris/${id}`,
            method:"POST",
            headers: {
              //  'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+token,
            },
            data: datasAktaNotaris
          })
          .then((response) => {
            console.log(response.data);
          })
          .catch((error)=> {
            // console.error('error', error);
            console.log(error.response)
            handleMessage("Format Akta Notaris haru dalam bentuk jpg, jpeg, png, pdf!");
          });
        }

        const datasSuratPengantar = new FormData();
        datasSuratPengantar.append('surat_ket', {
          name: 'surat_ket.jpg',
          type: 'image/jpeg',
          uri:  suratP,
        });

        if (category_order_id == '3' || category_order_id == '4') {
          if(aktaN != null){
            axios({
              url:`http://e565-180-242-214-45.ngrok.io/api/orders/post/suratPengantar/${id}`,
              method:"POST",
              headers: {
                //  'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+token,
              },
              data: datasSuratPengantar
            })
            .then((response) => {
              console.log(response.data);
            })
            .catch((error)=> {
              // console.error('error', error);
              console.log(error.response)
              handleMessage("Format Surat Pengantar dari RT/RW/Lurah harus dalam bentuk jpg, jpeg, png, pdf!");
            });
          } else {
            alert('Surat Pengantar tidak boleh kosong!');
          }
        }
        console.log(response.data);
      })
      .catch((error)=> {
        // console.error('error', error);
        console.log(error.response)
        handleMessage("Tidak ada koneksi internet!");
      });
    } else {
      alert('KTP tidak boleh kosong!');
      setVisible(false);
      setIsDisabled(false);
    }
    // }
    // else {
    //   // alert('Jangka waktu penyewaan tidak boleh 0. Harap masukkan jangka waktu penyewaan!');
    //   // setVisible(false);
    //   // setIsDisabled(false);
    // }
  };

  const handleMessage = (message, type = 'failed') => {
    setMessage(message);
    setMessageType(type);
  }

  return (
    <ScrollView style={{ backgroundColor: '#fff'}}>
      <View style={{ justifyContent:'center', alignItems:'center' }}>
        <Text style={{ fontWeight: 'bold', margin: 16 }}>Isi Formulir Pengajuan</Text>
      </View>
      <Formik
        // enableReinitialize={true}
        initialValues={{
          category_order_id:value.category_order_id,
          nama_kegiatan: value.nama_kegiatan,
          alamat_kegiatan: value.alamat_kegiatan,
          tenant_id:value.tenant_id,
          nama_instansi: value.nama_instansi,
          jabatan:value.jabatan,
          alamat_instansi:value.alamat_instansi,
          tanggal_mulai:tanggalMulai,
          tanggal_selesai: tanggalSelesai
        }}
        // initialValues={data}
        onSubmit={(values, {setSubmitting})  => {
          handleAjukanSewa(values, setSubmitting);
          console.log(values)
        }}
        // onSubmit={async (values) => alert(JSON.stringify(values, null, 2))}
      >
        {({ handleChange, handleBlur, handleSubmit, touched, values, isSubmitting, errors }) => (
          <View style={styles.root}>
            <View style={{ margin:16, flexDirection: 'row', justifyContent:'space-between' }}>
              <View style={{justifyContent:'center', alignItems:'center' }}>
                <View style={{ borderColor:'#C4C4C4', backgroundColor:'#C4C4C4', borderWidth:1, height:24, width: 24, borderRadius:20 }}>
                  <Text style={{textAlign: 'center' }}>1</Text>
                </View>
                <Text style={{textAlign: 'center', alignContent:'center', alignItems:'center', textAlignVertical:'center' }}>Step 1</Text>
              </View>
              <View style={{ backgroundColor: '#ffcd04', width: '25%', marginTop:24, height: 1}}/>
              <View style={{ justifyContent:'center', alignItems:'center' }}>
                <View style={{ borderColor:'#ffcd04', backgroundColor:'#ffcd04', borderWidth:1, height:24, width: 24, borderRadius:20 }}>
                  <Text style={{textAlign: 'center' }}>2</Text>
                </View>
                <Text style={{textAlign: 'center' }}>Step 2</Text>
              </View>
              <View style={{ backgroundColor: '#ffcd04', width: '25%', marginTop:24, height: 1}}/>
              <View style={{ justifyContent:'center', alignItems:'center' }}>
                  <View style={{ borderColor:'#C4C4C4', backgroundColor:'#C4C4C4', borderWidth:1, height:24, width: 24, borderRadius:20 }}>
                    <Text style={{textAlign: 'center' }}>3</Text>
                  </View>
                  <Text style={{textAlign: 'center' }}>Step 3</Text>
              </View>
            </View>
            <View>
                <View style={{ padding: 16 }}>
                  <Card style={styles.card}>
                    <View style={{ height: 48, textAlignVertical: 'center', backgroundColor: '#25185A', borderTopLeftRadius:15, borderTopRightRadius:15}}>
                      <Text style={{ marginLeft:16, marginTop:14, textAlignVertical: 'center', fontWeight:'bold', color: '#ffffff' }}>Jangka Waktu Penyewaan</Text>
                    </View>
                    {/* <Picker
                      style={styles.pickerCustomeStyle}
                      mode='dropdown'
                      style={{ color: 'white'}}
                      value={values.category_order_id}
                      selectedValue={selectedValue}
                      onValueChange={(itemValue, itemIndex) =>
                        setFieldValue(itemValue)
                      }
                      >
                      <Picker.Item label="Perhari" value="1" key={1}/>
                      <Picker.Item label="Perjam" value="2" key={2}/>
                    </Picker> */}
                    <View style={styles.container}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16 }}>
                        <View>
                            <Text style={{ fontWeight:"bold", textAlign:"center", marginBottom:4 }}>Tanggal Mulai</Text>
                            <View style={styles.pickedDateContainer}>
                                <Text style={styles.pickedDate}>{Moment(date1).format('DD MMMM YYYY')}</Text>
                            </View>
                            <TouchableOpacity onPress={showDatepicker}>
                                <View style={styles.pickButton}>
                                    <Text style={styles.buttonTitle}>Atur Tanggal Ambil!</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.pickedTimeContainer}>
                                <Text style={styles.pickedDate}>{Moment(date1).format('HH:mm')}</Text>
                            </View>
                            <TouchableOpacity onPress={showTimepicker}>
                                <View style={styles.pickButton}>
                                    <Text style={styles.buttonTitle}>Atur Jam Ambil!</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text style={{ fontWeight:"bold", alignItems:'center', textAlign:"center", marginBottom:4 }}>Tanggal Selesai</Text>
                            <View style={styles.pickedDateContainer}>
                                <Text style={styles.pickedDate}>{Moment(date2).format('DD MMMM YYYY')}</Text>
                            </View>
                            <TouchableOpacity onPress={showDatepicker2}>
                                <View style={styles.pickButton}>
                                    <Text style={styles.buttonTitle}>Atur Tanggal Kembali!</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.pickedTimeContainer}>
                                <Text style={styles.pickedDate}>{Moment(date2).format('HH:mm')}</Text>
                            </View>
                            <TouchableOpacity onPress={showTimepicker2}>
                                <View style={styles.pickButton}>
                                    <Text style={styles.buttonTitle}>Atur Jam Kembali!</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {show && (
                        <DateTimePicker
                        testID="dateTimePicker"
                        value={date1}
                        mode={mode}
                        is24Hour={true}
                        onChange={onChange}
                        minimumDate={new Date()}
                        locale='id'
                        />
                    )}
                    {show2 && (
                        <DateTimePicker
                        testID="dateTimePicker2"
                        value={date2}
                        mode={mode2}
                        is24Hour={true}
                        onChange={onChange2}
                        minimumDate={date1}
                        locale='id'
                        />
                    )}
                    </View>
                    {(dayDiff >=1) &&
                      <Text style={{ margin: 16, fontWeight:'bold' }}> Total Hari : {dayDiff} hari</Text>
                    }
                    {(dayDiff < 1 && hoursDiff>=1) &&
                      <Text style={{ margin: 16, fontWeight:'bold' }}> Total Jam : {hoursDiff} jam</Text>
                    }
                    {(dayDiff < 1 && hoursDiff < 1 && minuteDiff != 0) &&
                      <Text style={{ margin: 16, fontWeight:'bold' }}> Total Jam : 1 jam</Text>
                    }
                  </Card>
                </View>
            </View>
            <View>
                {/* <View style={styles.form}>
                  <Text style={{ marginLeft:24, marginTop:16 }}>Metode Pembayaran :</Text>
                  <TextInput
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="next"
                      placeholder="Nama"
                      style={styles.textInput}
                      onChangeText={handleChange('metode_pembayaran')}
                      onBlur={handleBlur('metode_pembayaran')}
                      editable={true}
                  />
                  {(errors.metode_pembayaran && touched.metode_pembayaran) &&
                    <Text style={{ fontSize: 10, color: 'red', marginLeft:24 }}>{errors.metode_pembayaran}</Text>
                  }
                </View> */}
              <TouchableOpacity onPress={pickKtp}>
                <View style={{ margin: 16, height: 120, backgroundColor: '#fff', padding: 4, borderRadius: 20, borderColor: '#6C6B6B', borderWidth:2 }}>
                    <View style={{height: '100%', width: '100%', flexDirection:'row', justifyContent:'center', alignItems:'center', flex:1}}>
                      <Image source={Add} style={{ width: 45, height: 45 }}/>
                      {/* {ktp &&
                      <Text>{ktp, datasKtp}</Text>
                      } */}
                      <View style={{ width:'80%' }}>
                        <Text style={{ fontSize:18, fontWeight: 'bold', marginLeft: 16 }}>Kartu Tanda Penduduk (KTP)</Text>
                        <Text style={{ marginLeft: 16, fontSize: 14, fontWeight: 'bold' }}>Tap disini pilih file dari perangkat Anda</Text>
                        <Text style={{ marginLeft: 16, fontSize:11 }}>Pastikan format file dalam bentuk png/jpg/jpeg/pdf !</Text>
                      </View>
                    </View>
                </View>
              </TouchableOpacity>
              {category_order_id == '1' &&
                <TouchableOpacity onPress={pickAktaNotaris}>
                  <View style={{ margin: 16, height: 120, backgroundColor: '#fff', padding: 4, borderRadius: 20, borderColor: '#6C6B6B', borderWidth:2 }}>
                      <View style={{height: '100%', width: '100%', flexDirection:'row', justifyContent:'center', alignItems:'center', flex:1}}>
                        <Image source={Add} style={{ width: 45, height: 45 }}/>
                        <View style={{ width:'80%' }}>
                          <Text style={{ fontSize:18, fontWeight: 'bold', marginLeft: 16 }}>Akta Notaris (Opsional)</Text>
                          <Text style={{ marginLeft: 16, fontSize: 14, fontWeight: 'bold' }}>Tap disini pilih file dari perangkat Anda</Text>
                          <Text style={{ marginLeft: 16, fontSize:11 }}>Pastikan format file dalam bentuk png/jpg/jpeg/pdf !</Text>
                        </View>
                      </View>
                  </View>
                </TouchableOpacity>
              }
              {category_order_id == '3' &&
                <TouchableOpacity onPress={pickSuratPengantar}>
                  <View style={{ margin: 16, height: 120, backgroundColor: '#fff', padding: 4, borderRadius: 20, borderColor: '#6C6B6B', borderWidth:2 }}>
                      <View style={{height: '100%', width: '100%', flexDirection:'row', justifyContent:'center', alignItems:'center', flex:1}}>
                        <Image source={Add} style={{ width: 45, height: 45 }}/>
                        <View  style={{ width:'80%' }}>
                          <Text style={{ fontSize:16, fontWeight: 'bold', marginLeft: 16}}>Surat Pengantar dari RT/RW/Lurah/Dinas Terkait (Opsional)</Text>
                          <Text style={{ marginLeft: 16, fontSize: 14, fontWeight: 'bold' }}>Tap disini pilih file dari perangkat Anda</Text>
                          <Text style={{ marginLeft: 16, fontSize:11 }}>Pastikan format file dalam bentuk png/jpg/jpeg/pdf !</Text>
                        </View>
                      </View>
                  </View>
                </TouchableOpacity>
              }
              {category_order_id == '4' &&
                <TouchableOpacity onPress={pickSuratPengantar}>
                  <View style={{ margin: 16, height: 120, backgroundColor: '#fff', padding: 4, borderRadius: 20, borderColor: '#6C6B6B', borderWidth:2 }}>
                      <View style={{height: '100%', width: '100%', flexDirection:'row', justifyContent:'center', alignItems:'center', flex:1}}>
                        <Image source={Add} style={{ width: 45, height: 45 }}/>
                        <View  style={{ width:'80%' }}>
                          <Text style={{ fontSize:16, fontWeight: 'bold', marginLeft: 16}}>Surat Pengantar dari RT/RW/Lurah/Dinas Terkait (Opsional)</Text>
                          <Text style={{ marginLeft: 16, fontSize: 14, fontWeight: 'bold' }}>Tap disini pilih file dari perangkat Anda</Text>
                          <Text style={{ marginLeft: 16, fontSize:11 }}>Pastikan format file dalam bentuk png/jpg/jpeg/pdf !</Text>
                        </View>
                      </View>
                  </View>
                </TouchableOpacity>
              }
              <View>
            </View>
            {/* {!isSubmitting &&
            <View>
                <TouchableOpacity onPress={handleSubmit}>
                <View style={styles.button}>
                    <Text style={styles.buttonTitle}>LANJUTKAN</Text>
                </View>
                </TouchableOpacity>
            </View>
            }
            {isSubmitting &&
                <View style={styles.button}>
                <ActivityIndicatorExample/>
                </View>
            } */}
            <View style={{ flexDirection: 'row' }}>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onChangeText={handleChange('category_order_id')}
                editable={false}
                type="hidden"
              />
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onChangeText={handleChange('nama_kegiatan')}
                editable={false}
                type="hidden"
              />
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onChangeText={handleChange('alamat_kegiatan')}
                editable={false}
                type="hidden"
              />
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onChangeText={handleChange('tenant_id')}
                editable={false}
                type="hidden"
              />
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onChangeText={handleChange('nama_instansi')}
                editable={false}
                type="hidden"
              />
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onChangeText={handleChange('jabatan')}
                editable={false}
                type="hidden"
              />
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onChangeText={handleChange('alamat_instansi')}
                editable={false}
                type="hidden"
              />
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onChangeText={handleChange('tanggal_mulai')}
                editable={false}
                type="hidden"
              />
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onChangeText={handleChange('tanggal_selesai')}
                editable={false}
                type="hidden"
              />
            </View>
            <View>
              <TouchableOpacity onPress={(e) =>
                {
                  letHide(e),
                  doYourTask(e),
                  handleAjukanSewa(e)
                }
              }
              disabled={isDisabled}>
                <View style={styles.button}>
                  {visible == true &&
                    <ActivityIndicator
                      size="large"
                      color="#00B8D4"
                      animating={visible}
                    />
                  }
                  {visible == false &&
                    <Text style={styles.buttonTitle}>LANJUTKAN</Text>
                  }
                </View>
              </TouchableOpacity>
            </View>
            </View>
          </View>
        )}
      </Formik>
      {/* <TouchableOpacity onPress={(e) =>
        {
          handleUploadAktaNotaris(e),
          handleAjukanSewa(e)
        }
      }>
        <View style={styles.button}>
          <Text style={styles.buttonTitle}>LANJUTKAN</Text>
        </View>
      </TouchableOpacity> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  item: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    opacity:1,
    height:200,
    width: 200,
    backgroundColor:'#F1C40F',
    padding:16,
    marginBottom:16
  },
  picture_item: {
    opacity:1,
    height:120,
    width: 120
  },
  text_item: {
    fontSize:24,
    fontWeight: "bold"
  },
  border: {
    backgroundColor: "#C4C4C4",
    height: "2%",
    opacity: 0.7
  },
  border2: {
    backgroundColor: "#C4C4C4",
    height: "3%",
    opacity: 0.3
  },
  textInput: {
    elevation: 12,
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    padding: 4,
    paddingHorizontal: 4,
    borderRadius: 20,
    borderColor: '#ffcd04'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#ffcd04',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    textAlign: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: -16
  },
  btn: {
    backgroundColor: '#25185A',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    textAlign: 'center',
    marginTop:16,
    padding:8,
  },
  buttonTitle: {
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 0,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 22,
  },
  root: {
    flex: 1,
  },
  pickButton: {
    alignItems: 'center',
    backgroundColor: '#ffcd04',
    borderRadius: 8,
    height: 36,
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: 4,
    padding: 8
  },
  pickedDateContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderColor: '#ffcd04',
    borderWidth: 3,
    borderRadius: 10,
  },
  pickedTimeContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderColor: '#ffcd04',
    borderWidth: 3,
    borderRadius: 10,
    marginTop:8
  },
  pickedDate: {
      color: '#ffcd04',
      fontSize: 14,
      textAlign: 'center',
  },
  card: {
    shadowOffset: {width:0, height:2},
    shadowOpacity: 0.5,
    width: '100%',
    borderTopLeftRadius:15,
    borderTopRightRadius:15,
    marginTop:16,
    backgroundColor: '#C4C4C4',
  },
});
