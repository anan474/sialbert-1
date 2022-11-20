import React, {useContext} from 'react';
import { StyleSheet, KeyboardAvoidingView, SafeAreaView, Alert, Text, View, Image, FlatList, TextInput, TouchableOpacity, Dimensions, ImageBackground, Button } from "react-native";
import { useState, useEffect } from "react";

import FloatingTabBar from "../components/FloatingTabBar";
import { ScrollView } from "react-native-gesture-handler";
import { Asset } from 'expo-asset';
import { AntDesign } from '@expo/vector-icons'
import ActivityIndicatorExample  from "../components/ActivityIndicatorExample";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from './../components/CredentialsContext';
import * as ImagePicker from 'expo-image-picker';
import { Formik, useFormik } from 'formik';
import * as yup from 'yup'
import axios from 'axios';
import FormData from 'form-data';
const win = Dimensions.get("window");
import { useIsFocused } from '@react-navigation/native';

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
    const [image, setImage] = useState(null);
    const [avatar, setAvatar] = useState([]);
    const [data, setData] = useState([]);
    const [text, setText] = useState('');
    const [cari, setCari] = useState([]);
    const [hidePassword, setHidePassword] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [fileContent, setFileContent] = useState(null);
    const [fileUri, setFileUri] = useState('');
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const {nama, email, no_hp, foto, kontak_darurat, alamat, id,token, username} = storedCredentials;
    const isFocused = useIsFocused();

    const persistLogin = (credentials, message, status) => {
      AsyncStorage.setItem('sialbertCredentials', JSON.stringify(credentials))
      .then(() => {
        handleMessage(message, status);
        setStoredCredentials(credentials);
      })
      .catch((error) => {
        console.log(error);
        handleMessage('Persisting login failed');
      })
    }

    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

    console.log(response);

    if (!response.cancelled) {
      setImage(response.uri);
    }
  };

  const handleUploadPhoto = () => {
    handleMessage(null);
    setIsLoading(true);
    // const url = `http://e565-180-242-214-45.ngrok.io/api/updatePicture/${id}`;
    const datas = new FormData();

    datas.append('foto', {
      name: 'foto.jpg',
      type: 'image/jpeg',
      uri:  image,
    });
    // datas.append('image', image);
    // datas.append('name', 'dita');
    console.log(image);
    console.log(datas);
    if (image != null) {
      axios({
        url:`http://e565-180-242-214-45.ngrok.io/api/updatePicture/${id}`,
        method:"POST",
        data:datas
      })
      .then((response) => {
        const result = response.data;
        const { message, success, status, data } = result;
        console.log(response.data);

        if (success == true) {
          // navigation.navigate('MenuUtama');
          // navigation.navigate('MenuUtama');
          // persistLogin({ ...data[0] }, message, status);
          Alert.alert("Edit Foto Profil", "Edit Foto Profil Berhasil!", [
            {
              text:"OK",
              onPress: () => {},
            },
          ]);
          console.log(response.data);
        }
        else {
          handleMessage("Email atau password salah, silahkan coba kembali!");
        }
        setIsLoading(false);
      })
    } else {
      alert('Please Select File first');
      setIsLoading(false);
    }

      // .catch((error)=> {
      //   
      
      //   console.response(response.uri);

      //   handleMessage("Tidak ada koneksi internet!");
      // });
  };
  // const {no_hp} = route.params;
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
    const url = `http://e565-180-242-214-45.ngrok.io/api/editProfil/${id}`;

    axios
      .post(url, credentials)
      .then((response) => {
        const result = response.data;
        const { message, success, status, data } = result;
        console.log(response.data);

        if (success == true) {
          // navigation.navigate('MenuUtama');
          // navigation.navigate('MenuUtama');
          // persistLogin({ ...data[0] }, message, status);
          persistLogin({ ...data[0] }, message, status);
          Alert.alert("Edit Profil", "Edit Profil Berhasil!", [
            {
              text:"OK",
              onPress: () => {},
            },
          ]);
          console.log(response.data);
        }
        else {
          handleMessage("Email atau password salah, silahkan coba kembali!");
        }
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
    nama: yup
      .string()
      .required('Nama wajib diisi!'),
    username: yup
      .string()
      .required('Nama wajib diisi!'),
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
  console.log(token)

  useEffect(async() => {
    setIsLoading(true);
    const {nama, email, no_hp, foto, kontak_darurat, alamat, id,token} = storedCredentials;
    fetch(`http://e565-180-242-214-45.ngrok.io/api/cekUser/${id}`,
    {
      method: "GET",
      headers: {
        //  'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+token,
      }})
      .then((response) => response.json())
      .then((hasil) => {
        // console.log(token)
        setAvatar(hasil);
        setIsLoading(false);
      })
      // .finally(() => setLoading(false));
      .catch(error => { console.log; });

  }, [isFocused]);

  console.log(avatar)

  return (
    <>
      <SafeAreaView style={styles.safeAreaView}>
        <ScrollView showsVerticalScrollIndicator={true}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.content}
          >
            {/* <View style={{ backgroundColor: '#FFFFFF', flex:1 }}>
              <TouchableOpacity onPress={clearLogin}>
                <View style={styles.button}>
                  <Text style={styles.buttonTitle}>Logout</Text>
                </View>
              </TouchableOpacity>
            </View> */}
            <View
              opacity={1} style={styles.banner}
            >
              <TouchableOpacity onPress={pickImage} style={styles.banner2}>
                <Text style={{color: '#fff'}}>Pilih Image</Text>
                <View style={{borderRadius: 70, padding: 16}}>
                  {image ?
                    <Image source={{ uri: image, width: 90, height: 90 }} style={{ borderRadius: 70 }} /> :
                      <>
                        {avatar.data =='http://e565-180-242-214-45.ngrok.io/storage/tenant/no-pict.png' &&
                          <Image source={picture_account} style={picture_account}></Image>
                        }
                        {avatar.data!='http://e565-180-242-214-45.ngrok.io/storage/tenant/no-pict.png' &&
                          <>
                          <Image source={{uri: avatar.data, width: 90, height: 90}} style={{borderRadius: 70}}></Image>
                          </>
                        }
                      </>
                  }
                </View>
                <Text style={{ fontWeight: "bold"}}>Ubah</Text>
                <Text>Tekan untuk ubah</Text>
              </TouchableOpacity>
              {isLoading &&
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
                </View>
              }
              {!isLoading &&
                <TouchableOpacity onPress={handleUploadPhoto}>
                    <View style={styles.btn}>
                      <Text style={styles.buttonTitle}>Upload Photo</Text>
                    </View>
                </TouchableOpacity>
              }
            </View>
            {/* <TouchableOpacity
              onPress={myfun}>
            </TouchableOpacity> */}
            <View style={{ backgroundColor:'#fff' }}>
              <Formik
                validationSchema={editProfilValidationSchema}
                // enableReinitialize={true}
                initialValues={{  id:id, nama: nama, username: username, email: email, no_hp: no_hp, kontak_darurat: kontak_darurat, alamat: alamat, image:'tes.jpeg'}}
                // initialValues={data}
                onSubmit={(values, {setSubmitting})  => {
                  handleEditProfil(values, setSubmitting);
                }}
                // onSubmit={async (values) => alert(JSON.stringify(values, null, 2))}
              >
                {({ handleChange, handleBlur, handleSubmit, touched, values, isSubmitting, errors }) => (
                  <View>
                    <View style={styles.border}></View>
                    <View>
                      <View style={styles.form}>
                        <Text style={{ marginLeft:24, marginTop:4 }}>Username :</Text>
                        <TextInput
                          autoCapitalize="none"
                          autoCorrect={false}
                          returnKeyType="next"
                          placeholder="Username"
                          style={styles.textInput}
                          onChangeText={handleChange('username')}
                          onBlur={handleBlur('username')}
                          defaultValue={avatar.username}
                          editable={true}
                        />
                      </View>
                      {(errors.username && touched.username) &&
                        <Text style={{ fontSize: 10, color: 'red', marginLeft:24 }}>{errors.username}</Text>
                      }
                    </View>
                    <View>
                      <View style={styles.form}>
                        <Text style={{ marginLeft:24, marginTop:4 }}>Nama :</Text>
                        <TextInput
                          autoCapitalize="none"
                          autoCorrect={false}
                          returnKeyType="next"
                          placeholder="Nama"
                          style={styles.textInput}
                          onChangeText={handleChange('nama')}
                          onBlur={handleBlur('nama')}
                          defaultValue={avatar.nama}
                          editable={true}
                        />
                      </View>
                      {(errors.nama && touched.nama) &&
                        <Text style={{ fontSize: 10, color: 'red', marginLeft:24 }}>{errors.nama}</Text>
                      }
                    </View>
                    <View>
                      <View style={styles.form}>
                        <Text style={{ marginLeft:24, marginTop:4 }}>Email :</Text>
                        <TextInput
                          autoCapitalize="none"
                          autoCompleteType="email"
                          autoCorrect={false}
                          keyboardType="email-address"
                          returnKeyType="next"
                          placeholder="Email"
                          style={styles.textInput}
                          onChangeText={handleChange('email')}
                          defaultValue={avatar.email}
                          editable={true}
                        />
                      </View>
                      {(errors.email && touched.alamat) &&
                        <Text style={{ fontSize: 10, color: 'red', marginLeft:24 }}>{errors.email}</Text>
                      }
                      {/* {values.email=="" &&
                        <Text style={{ fontSize: 10, color: 'red', marginLeft:16 }}>Alamat email wajib diisi</Text>
                      } */}
                    </View>
                    <View style={styles.border2}></View>
                    {/* <Text type ={messageType} style={styles.message}>{message}</Text> */}
                    <View>
                      <View style={styles.form}>
                        <Text style={{ marginLeft:24, marginTop:4 }}>No. Handphone:</Text>
                        <TextInput
                          autoCapitalize="none"
                          autoCorrect={false}
                          returnKeyType="next"
                          keyboardType='phone-pad'
                          // dataDetectorTypes={'phoneNumber'}
                          placeholder="No. Handphone"
                          style={styles.textInput}
                          onChangeText={handleChange('no_hp')}
                          defaultValue={avatar.no_hp}
                        />
                      </View>
                      {(errors.no_hp && touched.no_hp) &&
                      <Text style={{ fontSize: 10, color: 'red', marginLeft:24 }}>{errors.no_hp}</Text>
                      }
                    </View>
                    <View>
                      <View style={styles.form}>
                        <Text style={{ marginLeft:24, marginTop:4 }}>Kontak Darurat:</Text>
                        <TextInput
                          autoCapitalize="none"
                          autoCorrect={false}
                          returnKeyType="next"
                          keyboardType='phone-pad'
                          placeholder="Kontak Darurat"
                          style={styles.textInput}
                          onChangeText={handleChange('kontak_darurat')}
                          defaultValue={avatar.kontak_darurat}
                        />
                      </View>
                      {(errors.kontak_darurat && touched.kontak_darurat) &&
                        <Text style={{ fontSize: 10, color: 'red', marginLeft:24 }}>{errors.kontak_darurat}</Text>
                      }
                    </View>
                    <View>
                      <View style={styles.form}>
                        <Text style={{ marginLeft:24, marginTop:4 }}>Alamat :</Text>
                        <TextInput
                          autoCapitalize="none"
                          autoCorrect={false}
                          returnKeyType="next"
                          placeholder="Alamat"
                          style={styles.textInput}
                          onChangeText={handleChange('alamat')}
                          defaultValue={avatar.alamat}
                        />
                      </View>
                      {(errors.alamat && touched.alamat) &&
                        <Text style={{ fontSize: 10, color: 'red', marginLeft:24 }}>{errors.alamat}</Text>
                      }
                      <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="next"
                        onChangeText={handleChange('id')}
                        editable={false}
                        type="hidden"
                      />
                    </View>
                    {!isSubmitting &&
                    <View>
                      <TouchableOpacity onPress={handleSubmit}>
                        <View style={styles.button}>
                          <Text style={styles.buttonTitle}>SIMPAN</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    }
                    {isSubmitting &&
                      <View style={styles.button}>
                        <ActivityIndicatorExample/>
                      </View>
                    }
                  </View>
                )}
              </Formik>
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
    height: "35%",
    alignItems: "center",
    justifyContent: "center",
    marginTop:0
  },
  banner2: {
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
    opacity:1,
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
  back: {
    backgroundColor: "#25185A",
  },
  textInput: {
    elevation: 12,
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    padding: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderColor: '#ffcd04'
  },
  safeAreaView: {
    flex: 1,
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
    backgroundColor: 'white'
  },
});
