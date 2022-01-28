import React, {Component, useContext} from "react";
import Button from 'react-native-button';
import { useState } from "react";
import { Formik } from 'formik';
import {  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Image,
  View,
  ScrollView,
  KeyboardAvoidingViewBase} from "react-native";

import Svg, { Path, Stop, LinearGradient, Defs } from 'react-native-svg';
import axios from 'axios';
import { AxiosResponse, AxiosError } from "axios";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from './../components/CredentialsContext';

import SVGImg from '../assets/wave.svg';
import svg from '../assets/image/wave.png';
import Illust from "../assets/image/icon.png"
import Email from "../assets/image/email.png";
import Password from "../assets/image/password.png";
import openedEye from "../assets/image/opened-eye.png";
import closeEye from "../assets/image/closed-eye.png";
import { withSafeAreaInsets } from "react-native-safe-area-context";
import ActivityIndicatorExample  from "../components/ActivityIndicatorExample";
import * as yup from 'yup'

export default function LoginPage({ navigation, item }) {
  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);

  const loginValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Harap masukkan email yang valid!")
      .required('Alamat email wajib diisi!'),
    password: yup
      .string()
      .required('Password wajib diisi'),
  })

  const handleLogin = (credentials, setSubmitting) => {
    handleMessage(null);
    const url = 'http://858b-2001-448a-6060-6dc0-d8e-843-21f3-41e1.ngrok.io/api/login';

    axios
      .post(url, credentials)
      .then((response) => {
        const result = response.data;
        const { message, status, data } = result;

        if (status == 'success') {
          // navigation.navigate('MenuUtama', {...data[0]});
          persistLogin({...data[0]}, message, status);
          Alert.alert("Login", "Anda berhasil Login!", [
            {
              text:"OK",
              onPress: () => {},
            },
          ]);
        }
        else {
          handleMessage("Email atau password salah, silahkan coba kembali!");
        }
        setSubmitting(false);
      })

      .catch((error)=> {
        setSubmitting(false);
        handleMessage("Tidak ada koneksi internet!");
      });
    };

    const handleMessage = (message, type = 'failed') => {
      setMessage(message);
      setMessageType(type);
    }

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

    return (
      <View style={styles.root}>
        {/* <Svg
          height="120%"
          width="100%"
          // viewBox="0 0 1440 320"
          style={{ position: 'absolute', top: 0 }}
        >
          <Path
            fill="#ffd700" fill-opacity="1"
            d="M0,160L12.6,170.7C25.3,181,51,203,76,213.3C101.1,224,126,224,152,202.7C176.8,181,202,139,227,138.7C252.6,139,278,181,303,165.3C328.4,149,354,75,379,42.7C404.2,11,429,21,455,58.7C480,96,505,160,531,192C555.8,224,581,224,606,213.3C631.6,203,657,181,682,154.7C707.4,128,733,96,758,74.7C783.2,53,808,43,834,69.3C858.9,96,884,160,909,165.3C934.7,171,960,117,985,85.3C1010.5,53,1036,43,1061,69.3C1086.3,96,1112,160,1137,165.3C1162.1,171,1187,117,1213,133.3C1237.9,149,1263,235,1288,234.7C1313.7,235,1339,149,1364,112C1389.5,75,1415,85,1427,90.7L1440,96L1440,0L1427.4,0C1414.7,0,1389,0,1364,0C1338.9,0,1314,0,1288,0C1263.2,0,1238,0,1213,0C1187.4,0,1162,0,1137,0C1111.6,0,1086,0,1061,0C1035.8,0,1011,0,985,0C960,0,935,0,909,0C884.2,0,859,0,834,0C808.4,0,783,0,758,0C732.6,0,707,0,682,0C656.8,0,632,0,606,0C581.1,0,556,0,531,0C505.3,0,480,0,455,0C429.5,0,404,0,379,0C353.7,0,328,0,303,0C277.9,0,253,0,227,0C202.1,0,177,0,152,0C126.3,0,101,0,76,0C50.5,0,25,0,13,0L0,0Z"
          />
        </Svg> */}
        {/* <Svg style={{ position: 'absolute', top: 0 }} width="100%" height="100%" id="svg" viewBox="0 0 1440 600" xmlns="http://www.w3.org/2000/svg" class="transition duration-300 ease-in-out delay-150">
          <Path d="M 0,600 C 0,600 0,200 0,200 C 205.71428571428572,257.14285714285717 822.8571428571429,228.57142857142858 1440,200 C 1440,200 1440,600 1440,600 Z" stroke="none" stroke-width="0" fill="#fcb90088" class="transition-all duration-300 ease-in-out delay-150 path-0" transform="rotate(-180 720 300)"></Path>
          <Path d="M 0,600 C 0,600 0,400 0,400 C 205.71428571428572,514.2857142857143 822.8571428571429,457.14285714285717 1440,400 C 1440,400 1440,600 1440,600 Z" stroke="none" stroke-width="0" fill="#fcb900ff" class="transition-all duration-300 ease-in-out delay-150 path-1" transform="rotate(-180 720 300)"></Path>
        </Svg> */}
        <Image source={svg} style={{ position: 'absolute', top: 0 }}></Image>
        {/* <View style={styles.header}/> */}
        <SafeAreaView style={styles.safeAreaView}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.content}
          >
            <View style={styles.mainImageContainer}>
            <Image source={Illust} style={styles.deco}></Image>
            </View>
            {/* <Text style={styles.title}>Welcome Back!</Text> */}
            <Text style={styles.title}>LOGIN SI-ALBERT</Text>
            <Text style={styles.subtitle}>Masuk ke akun si-albert</Text>
            <ScrollView showsVerticalScrollIndicator={true}>
              <Formik
                validationSchema={loginValidationSchema}
                initialValues={{  email: '', password: '' }}
                onSubmit={(values, {setSubmitting}) => {
                  handleLogin(values, setSubmitting);
                }}
              >
                {({ handleChange, handleSubmit, values, isSubmitting, errors }) => (
                  <View>
                    <View>
                      <View style={styles.form}>
                        <Image style={styles.icon} source={Email} />
                        <TextInput
                          autoCapitalize="none"
                          autoCompleteType="email"
                          autoCorrect={false}
                          keyboardType="email-address"
                          returnKeyType="next"
                          placeholder="Email"
                          style={styles.textInput}
                          textContentType="username"
                          onChangeText={handleChange('email')}
                          value={values.email}
                        />
                      </View>
                      {errors.email &&
                        <Text style={{ fontSize: 10, color: 'red' }}>{errors.email}</Text>
                      }
                    </View>
                    <View>
                      <View style={styles.form}>
                        <Image style={styles.icon} source={Password} />
                        <TextInput
                          autoCapitalize="none"
                          autoCompleteType="password"
                          autoCorrect={false}
                          returnKeyType="done"
                          style={styles.textInput}
                          textContentType="password"
                          onChangeText={handleChange('password')}
                          value={values.password}
                          placeholder="Password"
                          secureTextEntry={hidePassword}
                          setHidePassword={setHidePassword}
                        />
                        <TouchableOpacity onPress={() => {
                          setHidePassword(prev=>!prev)
                        }}>
                          {hidePassword &&
                            <Image style={styles.icon} source={openedEye} />}
                          {!hidePassword &&
                            <Image style={styles.icon} source={closeEye} />}
                        </TouchableOpacity>
                      </View>
                      {errors.password &&
                        <Text style={{ fontSize: 10, color: 'red' }}>{errors.password}</Text>
                      }
                    </View>
                    {/* <Text type ={messageType} style={styles.message}>{message}</Text> */}
                    <Text type ={messageType} style={styles.message}>{message}</Text>
                    <View style={styles.regis}>
                      <Text style={styles.textButton}>Belum Punya Akun?</Text>
                      <TouchableOpacity onPress={() => {
                        navigation.navigate("Register");
                      }} style={styles.textButton}
                      >
                        <Text style={styles.linkText}> REGISTRASI DISINI!</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.forgotPasswordContainer}>
                      <Text style={styles.textButton}>Lupa Password?</Text>
                    </View>
                    {!isSubmitting &&
                    <View>
                      <TouchableOpacity onPress={handleSubmit}>
                        <View style={styles.button}>
                          <Text style={styles.buttonTitle}>LOGIN</Text>
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
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    );
}

const styles = {
  header: {
    height:'30%',
    backgroundColor: '#ffd700',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  deco: {
    width: '50%',
    height: '50%'
  },
  button: {
      alignItems: 'center',
      backgroundColor: '#ffd700',
      borderRadius: 8,
      height: 48,
      justifyContent: 'center',
      textAlign: 'center',
      marginTop: 0
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
    content: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 16,
      paddingVertical: 32,
    },
    forgotPasswordContainer: {
      alignItems: 'flex-end',
      marginTop:30
    },
    form: {
      alignItems: 'center',
      borderBottomWidth: 1,
      borderRadius: 8,
      flexDirection: 'row',
      height: 48,
      paddingHorizontal: 4, 
      // paddingHorizontal: 16,
      marginBottom: 10,
    },
    root: {
      flex: 1,
      backgroundColor: 'white'
    },
    safeAreaView: {
      flex: 1,
    },
    subtitle: {
      color: 'rgba(52, 52, 52, 0.8)',
      fontSize: 17,
      fontWeight: '400',
      lineHeight: 22,
    },
    textButton: {
      color: 'rgba(52, 52, 52, 0.8)',
      fontSize: 15,
      fontWeight: '400',
      lineHeight: 20,
      marginTop: -20
    },
    linkText: {
      color: 'blue',
      fontSize: 15,
      fontWeight: '400',
      lineHeight: 20,
      fontStyle: 'italic',
      textDecorationLine: 'underline'
    },
    textInput: {
      color: 'black',
      flex: 1,
      marginLeft:8
    },
    title: {
      color: 'grey',
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 34,
      marginBottom: 10,
      marginTop: -60
    },
    mainImageContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
    mainImage: {
      resizeMode: "cover",
    },
    decoContainer: { flex: 1 },
    regis: {
      flexDirection: 'row',
      margin: 8
    },
    icon: {
      height: 24,
      width: 24,
    },
    message: {
      color: 'red',
      alignItems: "center",
      marginHorizontal: 8,
      justifyContent: "center",
    }
};
