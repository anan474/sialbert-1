import React, {useContext} from 'react';
import { StyleSheet, Text, View, Image, FlatList, TextInput, TouchableOpacity, Alert, ActivityIndicator, Dimensions, ImageBackground, Button } from "react-native";
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
import DateTimePicker from '@react-native-community/datetimepicker';
import { Formik, useFormik, Form } from 'formik';
const win = Dimensions.get("window");
import logo from "../assets/icon.png";
import * as yup from 'yup';
import axios from 'axios';

export default function DetaiReschedule({ navigation, route }) {
  const {reschedule} = route.params
  const {dtMulai} = route.params
  const {dtSelesai} = route.params
  const {order_id} = route.params
  const {kode_pesanan} = route.params
  const [data, setData] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [page, setPage] = useState(1);
  const [text, setText] = useState('');
  const [cari, setCari] = useState([]);
  const [date1, setDate] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [mode2, setMode2] = useState('date');
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [currentDate, setCurrentDate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const [visible, setVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  
  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
  const {nama, email, id, token} = storedCredentials;
  // const total_harga = alat.reduce((total,item)=>{
  //   const harga_sewa_perhari = item.jumlah_hari_refund * item.harga_sewa_perhari
  //   const harga_sewa_perjam = item.jumlah_jam_refund * item.harga_sewa_perjam
  //   const total_biaya = harga_sewa_perhari+harga_sewa_perjam
  //   return total + total_biaya;
  // },0)

  const letHide = (alasan_refund) => {
    if (visible === true) {
      setVisible(false)
    } else {
      setVisible(true)
    }
  }

  const doYourTask = (alasan_refund) => {
    setIsDisabled(true);
  }

  const handleReschedule = (credentials, isSubmitting, alasan_refund) => {
    handleMessage(null);
    const url = `http://e565-180-242-214-45.ngrok.io/api/reschedules/post`;

    if(dayDiffAwal != dayDiff || hoursDiffAwal != hoursDiff)
    {
      Alert.alert("Gagal", "Harap masukkan rentang waktu yang sama dengan sebelumnya!", [
        {
          text:"OK",
          onPress: () => {},
        },
      ]);
      setVisible(false);
      setIsDisabled(false);
    }
    else{
      axios({
        url:`http://e565-180-242-214-45.ngrok.io/api/reschedules/post`,
        method:"POST",
        headers: {
          //  'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+token,
        },
        data:
        {
          waktu_mulai: tanggalMulai,
          waktu_selesai: tanggalSelesai,
          // alasan_refund: alasan_refund,
          detail_order_id: detail_reschedule,
          order_id: order_id,
          ket_verif_admin:'belum',
          ket_persetujuan_kepala_uptd:'belum'
        },
      })

      .then((response) => {
        const result = response.data;
        const { message, success, status, data } = result;
        console.log(response.data);
        axios({
          url:`https://sialbert.000webhostapp.com/teknisi/equipments/reschedule`,
          method:"POST",
          data:
          {
            waktu_mulai: tanggalMulai,
            waktu_selesai: tanggalSelesai,
            // alasan_refund: alasan_refund,
            detail_order_id: detail_reschedule,
            order_id: kode_pesanan,
            id_alat: id_alat,
          },
        })
        .then((response) => {
          const result = response.data;
          const { message, error, status } = result;
          console.log(response.data)
        })
        .catch((error)=> {
          // console.error('error', error);
          console.log(error.response)
          handleMessage("Tidak ada koneksi internet!");
        });

        if (success == true) {
          // navigation.navigate('MenuUtama');
          // navigation.navigate('MenuUtama');
          // persistLogin({ ...data[0] }, message, status);
          Alert.alert("Berhasil", "Pengajuan Reschedule Berhasil!", [
            {
              text:"OK",
              onPress: () => navigation.navigate("Reschedule"),
            },
          ]);
          console.log(response.data);
        }
        else {
          handleMessage("Gagal!");
        }
      })

      .catch((error)=> {
        // console.error('error', error);
        console.log(error.response)
        handleMessage("Tidak ada koneksi internet!");
      });
    }
  };

  const handleMessage = (message, type = 'failed') => {
    setMessage(message);
    setMessageType(type);
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

  const rescheduleValidationSchema = yup.object().shape({
    alasan_refund: yup
      .string()
      .required('Keterangan wajib diisi!'),
  })
  const range = Moment.range(dtMulai, dtSelesai);
  const dayDiffAwal = range.diff('days')
  const hoursDiffAwal = range.diff('hours')
  // const hoursDiffAwal = tSelesaiAwal.diff(tMulaiAwal, 'hours');

  const tMulai = Moment(date1)
  const tSelesai = Moment(date2)
  const dayDiff = tSelesai.diff(tMulai, 'days');
  const hoursDiff = tSelesai.diff(tMulai, 'hours');

  const detail_reschedule = reschedule?.[0].detail_order.id
  const id_alat = reschedule?.[0].detail_order.id_alat
  const tanggalMulai = Moment(date1).format('YYYY-MM-DD HH:mm:ss')
  const tanggalSelesai = Moment(date2).format('YYYY-MM-DD HH:mm:ss')

  return (
    <ScrollView style={{ padding:8, backgroundColor:'#fff', height: '100%' }}>
      <View style={{ padding:16 }}>
        <Card style={styles.card}>
          <View style={{ height: 48, textAlignVertical: 'center', backgroundColor: '#25185A', borderTopLeftRadius:15, borderTopRightRadius:15}}>
            <Text style={{ marginLeft:16, marginTop:14, textAlignVertical: 'center', fontWeight:'bold', color: '#ffffff' }}>Jadwal Awal</Text>
          </View>
          <Card>
            <View style={{ margin:16 }}>
              <View style={{ flexDirection:'row', justifyContent: "space-between" }}>
                <View>
                <Image source={{ uri:'https://sialbert.000webhostapp.com/'+reschedule?.[0].alat.foto +'/' +reschedule?.[0].alat.foto }} style={{ width:58, height:58, marginRight:8, marginTop: 8 }} />
                  <Text style={{ fontWeight:'100', marginBottom:4, fontSize:11 }}>{reschedule?.[0].alat.nama_alat}</Text>
                </View>
                <View>
                  <Text style={{ opacity: 0.4, fontSize:12 }}>Tanggal Mulai</Text>
                  <Text style={{ fontWeight:'bold', marginBottom:8, fontSize:12 }}>{Moment(dtMulai).format('dddd, DD MMMM YYYY')}</Text>
                  <Text style={{ opacity: 0.4, fontSize:12 }}>Jam Mulai</Text>
                  <Text style={{ fontWeight:'bold', marginBottom:8, fontSize:12 }}>{Moment(dtMulai).format('HH:mm')}</Text>
                  <Text style={{ opacity: 0.4, fontSize:12 }}>Tanggal Selesai</Text>
                  <Text style={{ fontWeight:'bold', marginBottom:4, fontSize:12 }}>{Moment(dtSelesai).format('dddd, DD MMMM YYYY')}</Text>
                  <Text style={{ opacity: 0.4, fontSize:12 }}>Jam Selesai</Text>
                  <Text style={{ fontWeight:'bold', marginBottom:4, fontSize:12 }}>{Moment(dtSelesai).format('HH:mm')}</Text>
                </View>
              </View>
            </View>
          <View style={styles.border2}/>
          {/* <Text>{hoursDiffAwal}</Text> */}
          {(dayDiffAwal >=1) &&
            <Text style={{ margin: 16, fontWeight:'bold' }}> Total Hari : {dayDiffAwal} hari</Text>
          }
          {(dayDiffAwal < 1 && hoursDiffAwal>=1) &&
            <Text style={{ margin: 16, fontWeight:'bold' }}> Total Jam : {hoursDiffAwal} jam</Text>
          }
          </Card>
        </Card>
        <Formik
          validationSchema={rescheduleValidationSchema}
          // enableReinitialize={true}
          initialValues={{
            waktu_mulai: tanggalMulai,
            waktu_selesai: tanggalSelesai,
            // alasan_refund: '',
            detail_order_id: detail_reschedule,
            order_id: order_id,
            ket_verif_admin:'belum',
            ket_persetujuan_kepala_uptd:'belum'
          }}
          onSubmit={(values, {setSubmitting})  => {
            handleReschedule(values, setSubmitting);
            console.log(values)
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, touched, values, isSubmitting, errors }) => (
            <Card style={styles.card}>
              <View style={{ height: 48, textAlignVertical: 'center', backgroundColor: '#25185A', borderTopLeftRadius:15, borderTopRightRadius:15}}>
                <Text style={{ marginLeft:16, marginTop:14, textAlignVertical: 'center', fontWeight:'bold', color: '#ffffff' }}>Detail Pengajuan Perubahan Jadwal</Text>
              </View>
              <View style={{ paddingHorizontal: 8, paddingVertical: 16 }}>
                <View>
                    <Text style={{ fontWeight:"bold", textAlign:"center", marginBottom:4 }}>Tanggal Mulai</Text>
                    <View style={styles.pickedDateContainer}>
                        <Text style={styles.pickedDate}>{Moment(date1).format('DD MMMM YYYY HH:mm')}</Text>
                    </View>
                    <TouchableOpacity onPress={showDatepicker}>
                        <View style={styles.pickButton}>
                            <Text style={styles.buttonTitle}>Atur Tanggal Ambil!</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={showTimepicker}>
                        <View style={styles.pickButton}>
                            <Text style={styles.buttonTitle}>Atur Jam Ambil!</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={{ fontWeight:"bold", alignItems:'center', marginTop:16, textAlign:"center", marginBottom:4 }}>Tanggal Selesai</Text>
                    <View style={styles.pickedDateContainer}>
                        <Text style={styles.pickedDate}>{Moment(date2).format('DD MMMM YYYY HH:mm')}</Text>
                    </View>
                    <TouchableOpacity onPress={showDatepicker2}>
                        <View style={styles.pickButton}>
                            <Text style={styles.buttonTitle}>Atur Tanggal Kembali!</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={showTimepicker2}>
                        <View style={styles.pickButton}>
                            <Text style={styles.buttonTitle}>Atur Jam Kembali!</Text>
                        </View>
                    </TouchableOpacity>
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
                <View>
                  <Text style={{ margin: 16, fontWeight:'bold' }}> Total Hari : {dayDiff} hari</Text>
                </View>
              }
              {(dayDiff < 1 && hoursDiff>=1) &&
                <Text style={{ margin: 16, fontWeight:'bold' }}> Total Jam : {hoursDiff} jam</Text>
              }
              {/* <View>
                <View style={styles.form}>
                  <Text style={{ marginLeft:16, marginTop:4 }}>Keterangan :</Text>
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    placeholder="Keterangan"
                    style={styles.textInput}
                    onChangeText={handleChange('alasan_refund')}
                    value={values.alasan_refund}
                  />
                </View>
                {(errors.alasan_refund && touched.alasan_refund) &&
                  <Text style={{ fontSize: 10, color: 'red', marginLeft:16 }}>{errors.alasan_refund}</Text>
                }
              </View> */}
              <View style={{ flexDirection: 'row', width: '100%' }}>
                {/* <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  onChangeText={handleChange('waktu_mulai')}
                  editable={false}
                  type="hidden"
                />
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  onChangeText={handleChange('waktu_selesai')}
                  editable={false}
                  type="hidden"
                /> */}
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  onChangeText={handleChange('order_id')}
                  editable={false}
                  type="hidden"
                />
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  onChangeText={handleChange('detail_order_id')}
                  editable={false}
                  type="hidden"
                />
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  onChangeText={handleChange('ket_verif_admin')}
                  editable={false}
                  type="hidden"
                />
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  onChangeText={handleChange('ket_persetujuan_kepala_uptd')}
                  editable={false}
                  type="hidden"
                />
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  onChangeText={handleChange('id_alat')}
                  editable={false}
                  type="hidden"
                />
                {/* <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  onChangeText={handleChange('alasan_refund')}
                  editable={false}
                  type="hidden"
                /> */}
              </View>
              {!isSubmitting &&
              <View>
                {(() => {
                  const alasan_refund = values.alasan_refund
                  return(
                    <TouchableOpacity onPress={(alasan_refund) =>
                      {
                        letHide(alasan_refund),
                        doYourTask(alasan_refund),
                        handleReschedule(alasan_refund)
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
                  )
                })()}
              </View>
              }
              {isSubmitting &&
                <View style={styles.button}>
                  <ActivityIndicatorExample/>
                </View>
              }
            </Card>
          )}
        </Formik>
      </View>
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
    borderWidth: 2,
    borderColor:'#2196F3'
  },
  icon: {
    width: 32,
    height:32,
    marginLeft:16,
    marginTop:8,
  },
  pickButton: {
    alignItems: 'center',
    backgroundColor: '#ffcd04',
    borderRadius: 8,
    height: 36,
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: 8,
    padding: 4
  },
  pickedDateContainer: {
    padding: 8,
    backgroundColor: '#fff',
    borderColor: '#ffcd04',
    borderWidth: 3,
    borderRadius: 10,
  },
  pickedDate: {
      color: '#ffcd04',
      fontSize: 14,
      textAlign: 'center',
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
  textInput: {
    elevation: 12,
    flexDirection: "row",
    marginHorizontal: 8,
    marginVertical: 8,
    backgroundColor: '#fff',
    padding: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderColor: '#ffcd04',
    borderWidth:2,
    height: 90,
  },
  button: {
    backgroundColor: '#25185A',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    textAlign: 'center',
    alignItems:'center',
    padding:8,
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
});
