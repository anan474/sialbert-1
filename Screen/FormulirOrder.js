import React, {useContext} from 'react';
import { StyleSheet, Text, View, Image, Alert, SafeAreaView, TextInput, TouchableHighlightComponent, TouchableOpacity, Dimensions, ImageBackground, Button } from "react-native";
import { useState, useEffect } from "react";

import FloatingTabBar from "../components/FloatingTabBar";
import { ScrollView } from "react-native-gesture-handler";
import { Asset } from 'expo-asset';
import { AntDesign } from '@expo/vector-icons'
import ActivityIndicatorExample  from "../components/ActivityIndicatorExample";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from '../components/CredentialsContext';
import { Formik, useFormik, Form } from 'formik';
import Step1 from "./forms/FormFirstStep";
import Step2 from "./forms/FormSecondStep";
// import AnimatedMultistep from "react-native-animated-multistep";
import { Stepper } from 'react-form-stepper';
import borderdark from "../assets/image/borderdark.png";
import borderlight from "../assets/image/borderlight.png";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Input } from 'react-native-elements';
import {Picker} from '@react-native-picker/picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

// import { FormSuccess } from "./forms/FormSuccess";
import * as yup from 'yup';
import { makeStyles } from "@material-ui/core/styles";

const win = Dimensions.get("window");

export default function FormulirOrder({navigation, route}) {
  const [data, setData] = useState([]);
  const [avatar, setAvatar] = useState([]);
  const [text, setText] = useState('');
  const [cari, setCari] = useState([]);
  const [selectedValue, setFieldValue] = useState('1');
  const [isLoading, setIsLoading] = useState(false);

  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
  const {nama, email, no_hp, foto, kontak_darurat, alamat, id, token} = storedCredentials;
  const isFocused = useIsFocused();

  const formOrderValidationSchema = yup.object().shape({
    nama_instansi: yup
      .string()
      .required('Nama Instansi wajib diisi!'),
    jabatan: yup
      .string()
      .required('Jabatan wajib diisi!'),
    alamat_instansi: yup
      .string()
      .required('Alamat Instansi wajib diisi!'),
    nama_kegiatan: yup
      .string()
      .required('Nama Kegiatan wajib diisi!'),
    alamat_kegiatan: yup
      .string()
      .required('Alamat Kegiatan wajib diisi!'),
    category_order_id: yup
      .string()
      .required('Status Kegiatan wajib diisi!'),
  })

  const handleRegister = (credentials, setSubmitting) => {
    handleMessage(null);
    const url = 'http://e565-180-242-214-45.ngrok.io/api/register';

    axios
      .post(url, credentials)
      .then((response) => {
        const result = response.data;
        const { message, status, data } = result;
        if (status == 'success') {
          // navigation.navigate('Register2');
          persistLogin({ ...data }, message, status);
          Alert.alert("Register", "Anda berhasil registrasi!", [
            {
              text:"OK",
              onPress: () => {},
            },
          ]);
          persistLogin({...data}, message, status);
        }
        else {
          handleMessage("Email telah terdaftar!");
        }
        setSubmitting(false);
      })

      .catch(function(error) {
        setSubmitting(false);
        handleMessage("Email atau password salah, silahkan coba kembali!");
      });
      // .catch((error)=> {
      //   console.log(error.JSON());
      //   setSubmitting(false);
      //   handleMessage("An error occured. Check your internet and try again!");
      // });
  };

  const handleMessage = (message, type = 'failed') => {
    setMessage(message);
    setMessageType(type);
  }

  console.log(selectedValue)

  return (
    <SafeAreaView style={{ justifyContent: 'center', flexDirection: "row", flex:1}}>
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
        <ScrollView style={styles.root}>
          <View style={{ justifyContent:'center', alignItems:'center' }}>
            <Text style={{ fontWeight: 'bold', margin: 16 }}>Isi Formulir Pengajuan</Text>
          </View>
          <Formik
            validationSchema={formOrderValidationSchema}
            // enableReinitialize={true}
            // initialValues={{ category_order_id:selectedValue, nama_kegiatan: '', tenant_id:id, nama_penyewa: nama, email: email, no_hp: no_hp, kontak_darurat: kontak_darurat, alamat: alamat, nama_instansi: '', jabatan:'', alamat_instansi:''}}
            initialValues={{ category_order_id:selectedValue, nama_kegiatan: '', alamat_kegiatan:'', tenant_id:id, nama_instansi: '', jabatan:'', alamat_instansi:''}}
            onSubmit={(values, {setSubmitting})  => {
              navigation.navigate('Formulir Order Step 2', {value: values})
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, touched, values, isSubmitting, errors }) => (
              <View style={styles.root}>
                <View>
                  <View style={{ margin:16, flexDirection: 'row', justifyContent:'space-between' }}>
                    <View style={{justifyContent:'center', alignItems:'center' }}>
                      <View style={{ borderColor:'#ffcd04', backgroundColor:'#ffcd04', borderWidth:1, height:24, width: 24, borderRadius:20 }}>
                        <Text style={{textAlign: 'center' }}>1</Text>
                      </View>
                      <Text style={{textAlign: 'center', alignContent:'center', alignItems:'center', textAlignVertical:'center' }}>Step 1</Text>
                    </View>
                    <View style={{ backgroundColor: '#ffcd04', width: '25%', marginTop:24, height: 1}}/>
                    <View style={{ justifyContent:'center', alignItems:'center' }}>
                      <View style={{ borderColor:'#C4C4C4', backgroundColor:'#C4C4C4', borderWidth:1, height:24, width: 24, borderRadius:20 }}>
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
                    <Text style={{ marginLeft:16, marginTop:4 }}>Status Kegiatan :</Text>
                    <View style={{ margin: 8, backgroundColor: '#ffcd04', borderRadius: 20, borderColor: '#ffcd04', borderWidth:2 }}>
                      <Picker
                        style={styles.pickerCustomeStyle}
                        mode='dropdown'
                        style={{ color: 'white'}}
                        value={values.category_order_id}
                        selectedValue={selectedValue}
                        onValueChange={(itemValue, itemIndex) =>
                          setFieldValue(itemValue)
                        }
                        >
                        <Picker.Item label="Umum" value="1" key={1}/>
                        <Picker.Item label="Kegianan Rutin " value="2" key={2}/>
                        <Picker.Item label="Dinas Lain" value="3" key={3}/>
                        <Picker.Item label="Sosial Masyarakat " value="4" key={4}/>
                      </Picker>
                    </View>
                  </View>
                  <View>
                    <View style={styles.form}>
                      <Text style={{ marginLeft:16, marginTop:4 }}>Nama Kegiatan :</Text>
                      <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="next"
                        placeholder="Nama Kegiatan"
                        style={styles.textInput}
                        onChangeText={handleChange('nama_kegiatan')}
                      />
                    </View>
                    {(errors.nama_kegiatan && touched.nama_kegiatan) &&
                      <Text style={{ fontSize: 10, color: 'red', marginLeft:16 }}>{errors.nama_kegiatan}</Text>
                    }
                  </View>
                  <View>
                    <View style={styles.form}>
                      <Text style={{ marginLeft:16, marginTop:4 }}>Lokasi Kegiatan :</Text>
                      <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="next"
                        placeholder="Alamat Kegiatan"
                        style={styles.textInputAlamat}
                        onChangeText={handleChange('alamat_kegiatan')}
                      />
                    </View>
                    {(errors.alamat_kegiatan && touched.alamat_kegiatan) &&
                      <Text style={{ fontSize: 10, color: 'red', marginLeft:16 }}>{errors.alamat_kegiatan}</Text>
                    }
                  </View>
                  <View style={styles.border}></View>
                  <View style={{ flexDirection:'row' }}>
                    <View style={{ width: '50%' }}>
                      <View style={styles.form}>
                        <Text style={{ marginLeft:16, marginTop:4 }}>Nama Penyewa:</Text>
                        <Text style={styles.textInput}>{nama}</Text>
                      </View>
                    </View>
                    <View style={{ width: '50%' }}>
                      <View style={styles.form}>
                        <Text style={{ marginLeft:16, marginTop:4 }}>Email :</Text>
                        <Text style={styles.textInput}>{email}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ flexDirection:'row' }}>
                    <View style={{ width:'50%' }}>
                      <View style={styles.form}>
                        <Text style={{ marginLeft:16, marginTop:4 }}>No. Handphone:</Text>
                        <Text style={styles.textInput}>{no_hp}</Text>
                      </View>
                    </View>
                    <View style={{ width:'50%' }}>
                      <View style={styles.form}>
                        <Text style={{ marginLeft:16, marginTop:4 }}>Kontak Darurat:</Text>
                        <Text style={styles.textInput}>{kontak_darurat}</Text>
                      </View>
                    </View>
                  </View>
                  <View>
                    <View style={styles.form}>
                      <Text style={{ marginLeft:16, marginTop:4 }}>Alamat :</Text>
                      <Text style={styles.textInputAlamat}>{alamat}</Text>
                    </View>
                  </View>
                  <View style={styles.border3}/>
                  <View style={{ paddingHorizontal:16, width: '100%' }}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Edit Profil')}
                    >
                      <View>
                        <View style={{flexDirection:'row', justifyContent: "space-between"}}>
                          <Text>Ajukan Perubahan Informasi Penyewa</Text>
                          <MaterialCommunityIcons name="arrow-right" size={24} color='#FAD603'/>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.border3}/>
                  <View style={styles.border}></View>
                  <View style={{ flexDirection:'row' }}>
                    <View style={{ width: '50%' }}>
                      <View style={styles.form}>
                        <Text style={{ marginLeft:16, marginTop:4 }}>Nama Instansi :</Text>
                        <TextInput
                          autoCapitalize="none"
                          autoCorrect={false}
                          returnKeyType="next"
                          placeholder="Nama Instansi"
                          style={styles.textInput}
                          onChangeText={handleChange('nama_instansi')}
                          editable={true}
                        />
                      </View>
                      {(errors.nama_instansi && touched.nama_instansi) &&
                        <Text style={{ fontSize: 10, color: 'red', marginLeft:16 }}>{errors.nama_instansi}</Text>
                      }
                    </View>
                    <View style={{ width: '50%' }}>
                      <View style={styles.form}>
                        <Text style={{ marginLeft:16, marginTop:4 }}>Jabatan Penyewa :</Text>
                        <TextInput
                          autoCapitalize="none"
                          autoCorrect={false}
                          returnKeyType="next"
                          placeholder="Jabatan"
                          style={styles.textInput}
                          onChangeText={handleChange('jabatan')}
                          editable={true}
                        />
                      </View>
                      {(errors.jabatan && touched.jabatan) &&
                        <Text style={{ fontSize: 10, color: 'red', marginLeft:16 }}>{errors.jabatan}</Text>
                      }
                    </View>
                  </View>
                  <View>
                    <View style={styles.form}>
                      <Text style={{ marginLeft:16, marginTop:4 }}>Alamat Instansi :</Text>
                      <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="next"
                        placeholder="Alamat Instansi"
                        style={styles.textInputAlamat}
                        onChangeText={handleChange('alamat_instansi')}
                      />
                    </View>
                    {(errors.alamat_instansi && touched.alamat_instansi) &&
                      <Text style={{ fontSize: 10, color: 'red', marginLeft:16 }}>{errors.alamat_instansi}</Text>
                    }
                  </View>
                  {/* <Text type ={messageType} style={styles.message}>{message}</Text> */}
                  <View>
                    <TouchableOpacity
                      onPress={handleSubmit}
                    >
                      <View style={styles.button}>
                        <Text style={styles.buttonTitle}>LANJUTKAN</Text>
                      </View>
                    </TouchableOpacity>
                    {/* {!isSubmitting && (
                      <TouchableOpacity
                        onPress={handleSubmit}
                      >
                        <View style={styles.button}>
                          <Text style={styles.buttonTitle}>LANJUTKAN</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    {isSubmitting && (
                      <View style={styles.button}>
                        <ActivityIndicatorExample />
                      </View>
                    )} */}
                </View>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  onChangeText={handleChange('tenant_id')}
                  editable={false}
                  type="hidden"
                />
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
      }
    </SafeAreaView>
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
    opacity: 0.7,
    marginVertical: 4
  },
  border2: {
    backgroundColor: "#C4C4C4",
    height: "3%",
    opacity: 0.3,
    marginVertical: 4,
  },
  border3: {
    backgroundColor: "#C4C4C4",
    height: 2,
  },
  line:{
    borderBottomColor: 'black',
    height: 1,
    width:'5%'
  },
  borderdark: {
    backgroundColor: "#787171",
    height: "2%",
  },
  borderlight: {
    backgroundColor: "#C4C4C4",
    height: "2%",
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
    borderWidth:2
  },
  textInputAlamat: {
    elevation: 12,
    height: 80,
    flexDirection: "row",
    marginHorizontal: 8,
    marginVertical: 8,
    backgroundColor: '#fff',
    padding: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderColor: '#ffcd04',
    borderWidth:2
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#ffcd04',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    textAlign: 'center',
    margin: 16
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
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
  },
  root: {
    flex: 1,
    backgroundColor:'#ffffff',
    paddingBottom:16,
  },
  pickerCustomeStyle: {
    color: "red",
  },
  // button: {
  //   alignItems: 'center',
  //   backgroundColor: '#ffcd04',
  //   borderRadius: 20,
  //   padding: 10,
  //   elevation: 2
  // },
});
