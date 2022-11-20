import React, {useContext} from 'react';
import { StyleSheet, KeyboardAvoidingView, SafeAreaView, Alert, Text, View, Form, Input, Image, FlatList, TextInput, TouchableOpacity, Dimensions, ImageBackground, Button } from "react-native";
import { useState, useEffect } from "react";

import FloatingTabBar from "../components/FloatingTabBar";
import { ScrollView } from "react-native-gesture-handler";
import { Asset } from 'expo-asset';
import { AntDesign } from '@expo/vector-icons'
import ActivityIndicatorExample  from "../components/ActivityIndicatorExample";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from './../components/CredentialsContext';
import ImagePicker from 'react-native-image-picker';
import { Formik } from 'formik';
import * as yup from 'yup'
import axios from 'axios';
const win = Dimensions.get("window");

import openedEye from "../assets/image/opened-eye.png";
import closeEye from "../assets/image/closed-eye.png";

import picture_account from "../assets/image/acount-inactive.png";

// constructor(props) {
//   super(props);
//   this.state = {
//     nama : '',
//   };
// }
export default function EditProfil({route, navigation, props}) {
  // const {no_hp} = route.params;
  const [data, setData] = useState([]);
  const [text, setText] = useState('');
  const [cari, setCari] = useState([]);
  const [hidePassword, setHidePassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
  const {nama, email, no_hp, foto, kontak_darurat, alamat, id} = storedCredentials;
  const clearLogin = () => {
    AsyncStorage
    .removeItem('sialbertCredentials')
    .then(() => {
      setStoredCredentials("");
    })
    .catch(error => console.log(error))
    Alert.alert("Logout", "Anda berhasil logout!", [
      {
        text:"OK",
        onPress: () => {clearLogin},
      },
    ]);
  }

  const handleEditProfil = (credentials, setSubmitting) => {
    handleMessage(null);
    const url = `http://59bd-2001-448a-6060-321d-5cc4-b2c9-58f9-b880.ngrok.io/api/editProfil/1`;

    axios
      .put(url, credentials)
      .then((response) => {
        const result = response.data;
        const { message, success, status, data } = result;

        // if (success == true) {
        //   navigation.navigate('MenuUtama');
        //   // persistLogin({ ...data[0] }, message, status);
        //   Alert.alert("Edit Prfil", "Edit Profil Berhasil!", [
        //     {
        //       text:"OK",
        //       onPress: () => {},
        //     },
        //   ]);
        // }
        // else {
        //   handleMessage("Email atau password salah, silahkan coba kembali!");
        // }
        // navigation.navigate('MenuUtama');
          // persistLogin({ ...data[0] }, message, status);
          Alert.alert("Edit Profil", "Edit Profil Berhasil!", [
            {
              text:"OK",
              onPress: () => {},
            },
          ]);
        setSubmitting(false);
      })

      .catch((error)=> {
        console.error('error', error);
        setSubmitting(false);
        handleMessage("Tidak ada koneksi internet!");
      });
    };

    const handleMessage = (message, type = 'failed') => {
      setMessage(message);
      setMessageType(type);
    }

  const editProfilValidationSchema = yup.object().shape({
    // nama: yup
    //   .string()
    //   .required('Nama wajib diisi!'),
    email: yup
      .string()
      .email("Harap masukkan email yang valid!")
      .required('Alamat email wajib diisi!'),
    no_hp: yup
      .number()
      .required('No. Handphone wajib diisi!'),
    kontak_darurat: yup
      .number()
      .required('Kontak Darurat wajib diisi!'),
    alamat: yup
      .string()
      .required('Alamat wajib diisi!'),
  })


  const myfun = () => {
    //alert('clicked');

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image Picker Error: ', response.error);
      } else {
        let source = {uri: response.uri};

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source,
          pic: response.data,
        });
      }
    });
  };

  return (
    <>
      <SafeAreaView style={styles.safeAreaView}>
        <ScrollView showsVerticalScrollIndicator={true}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.content}
          >
            <View style={{ backgroundColor: '#FFFFFF', flex:1 }}>
                <TouchableOpacity onPress={clearLogin}>
                  <View style={styles.button}>
                    <Text style={styles.buttonTitle}>Logout</Text>
                  </View>
                </TouchableOpacity>
            </View>
            {/* <TouchableOpacity
              onPress={myfun}>
            </TouchableOpacity> */}
            <View opacity={1} style={styles.banner}>
              <Text style={{color: '#fff'}}>Pilih Image</Text>
              <View style={{borderRadius: 70}}>
                {{foto}===null &&
                  <Image source={picture_account} style={picture_account}></Image>
                }
                {{foto}!='' &&
                  <Image source={{uri: foto, width: 80, height: 80}} style={{borderRadius: 70}}></Image>
                }
              </View>
              <Text style={{ fontWeight: "bold" }}>Ubah</Text>
              <Text>Tekan untuk ubah</Text>
            </View>
            <View style={styles.border}></View>
            <View>
              <Form
                // validationSchema={editProfilValidationSchema}
                // enableReinitialize={true}
                // initialValues={{  nama: data.nama ? data.nama: "", email: '', no_hp: '', kontak_darurat: '', alamat: ''}}
                // initialValues={data}
                onSubmit={({setSubmitting})  => {
                  handleEditProfil(setSubmitting);
                }}
              >
                {({ handleSubmit }) => (
                  <View>
                    <View>
                      <View style={styles.form}>
                        <Input
                          autoCapitalize="none"
                          autoCorrect={false}
                          returnKeyType="next"
                          placeholder="Nama"
                          style={styles.textInput}
                          onChangeText={nama}
                          onBlur={nama}
                          defaultValue={nama}
                          editable={true}
                        />
                      </View>
                      {/* {(errors.nama && touched.nama) &&
                        <Text style={{ fontSize: 10, color: 'red', marginLeft:24 }}>{errors.nama}</Text>
                      } */}
                    </View>
                    <View>
                      <View style={styles.form}>
                        <Input
                          autoCapitalize="none"
                          autoCompleteType="email"
                          autoCorrect={false}
                          keyboardType="email-address"
                          returnKeyType="next"
                          placeholder="Email"
                          style={styles.textInput}
                          onChangeText={email}
                          defaultValue={email}
                          editable={true}
                        />
                      </View>
                      {/* {(errors.email && touched.alamat) &&
                        <Text style={{ fontSize: 10, color: 'red', marginLeft:24 }}>{errors.email}</Text>
                      } */}
                      {/* {values.email=="" &&
                        <Text style={{ fontSize: 10, color: 'red', marginLeft:16 }}>Alamat email wajib diisi</Text>
                      } */}
                    </View>
                    <View style={styles.border2}></View>
                    {/* <Text type ={messageType} style={styles.message}>{message}</Text> */}
                    <View>
                      <View style={styles.form}>
                          <Input
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="next"
                            keyboardType='numeric'
                            // dataDetectorTypes={'phoneNumber'}
                            placeholder="No. Handphone"
                            style={styles.textInput}
                            onChangeText={no_hp}
                            defaultValue={no_hp}
                          />
                        </View>
                        {/* {(errors.no_hp && touched.no_hp) &&
                          <Text style={{ fontSize: 10, color: 'red', marginLeft:24 }}>{errors.no_hp}</Text>
                        } */}
                    </View>
                    <View>
                      <View style={styles.form}>
                        <Input
                          autoCapitalize="none"
                          autoCorrect={false}
                          returnKeyType="next"
                          keyboardType='numeric'
                          placeholder="Kontak Darurat"
                          style={styles.textInput}
                          onChangeText={kontak_darurat}
                          defaultValue={kontak_darurat}
                        />
                      </View>
                      {/* {(errors.kontak_darurat && touched.kontak_darurat) &&
                        <Text style={{ fontSize: 10, color: 'red', marginLeft:24 }}>{errors.kontak_darurat}</Text>
                      } */}
                    </View>
                    <View>
                      <View style={styles.form}>
                        <Input
                          autoCapitalize="none"
                          autoCorrect={false}
                          returnKeyType="next"
                          placeholder="Alamat"
                          style={styles.textInput}
                          onChangeText={alamat}
                          defaultValue={alamat}
                        />
                      </View>
                      {/* {(errors.alamat && touched.alamat) &&
                        <Text style={{ fontSize: 10, color: 'red', marginLeft:24 }}>{errors.alamat}</Text>
                      } */}
                    </View>
                    <View>
                      <TouchableOpacity onPress={handleSubmit}>
                        <View style={styles.button}>
                          <Text style={styles.buttonTitle}>SIMPAN</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    {/* {!isSubmitting &&
                    }
                    {isSubmitting &&
                      <View style={styles.button}>
                        <ActivityIndicatorExample/>
                      </View>
                    } */}
                  </View>
                )}
              </Form>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#FAD603",
    height: "25%",
    alignItems: "center",
    justifyContent: "center",
  },
  picture: {
    borderRadius: 70,
    opacity:1
  },
  picture_account: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 70,
    opacity:1
  },
  border: {
    backgroundColor: "#C4C4C4",
    height: "2%",
    opacity: 0.7
  },
  border2: {
    backgroundColor: "#C4C4C4",
    height: "5%",
    opacity: 0.3
  },
  back: {
    backgroundColor: "#25185A",
  },
  textInput: {
    elevation: 12,
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#fff',
    padding: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderColor: '#364878'
  },
  safeAreaView: {
    flex: 1,
    height:'100%'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 32,
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
