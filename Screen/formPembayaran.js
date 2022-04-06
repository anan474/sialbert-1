import React, {useRef, useState, useContext, useEffect} from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import PDFReader from 'rn-pdf-reader-js';
import SignatureScreen from "react-native-signature-canvas";
import * as FileSystem from "expo-file-system";
import { CredentialsContext } from '../components/CredentialsContext';
import axios from 'axios';
import { Card } from 'react-native-paper';
import FormData from 'form-data';
import Moment from 'moment';
import * as DocumentPicker from 'expo-document-picker';

import Add from "../assets/image/plus.png";

export default function formPembayaran({ navigation, route }) {
    const {id_order} = route.params
    const {skr} = route.params
    const {dateSkr} = route.params
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [buktiPembayaran, setBuktiPembayaran] = useState(null);
    const [data, setData] = useState([]);
    const [visible, setVisible] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const {nama, email, id} = storedCredentials;

    const pickBuktiPembayaran = async () => {
        // No permissions request is necessary for launching the image library
        let response = await DocumentPicker.getDocumentAsync({
          type: ['image/*','application/pdf'],
        });

        console.log(response);

        if (!response.cancelled) {
            setBuktiPembayaran(response.uri);
        }
    };

    const handlePembayaran = (credentials, isSubmitting) => {
        handleMessage(null);
        if (buktiPembayaran != null) {
          axios({
            url:`http://d480-2001-448a-6060-f025-e101-75c0-9054-d867.ngrok.io/api/payments`,
            method:"POST",
            data:
            {
              order_id:id_order,
              tenant_id: id,
            },
        })
        .then((response) => {
            const result = response.data;
            const { message, success, status, data } = result;
            console.log(response.data);
            const datasBuktiPembayaran = new FormData();
            datasBuktiPembayaran.append('bukti_pembayaran', {
            name: 'bukti_pembayaran.jpg',
            type: 'image/jpeg',
            uri:  buktiPembayaran,
            });

            if (buktiPembayaran != null) {
            axios({
                url:`http://d480-2001-448a-6060-f025-e101-75c0-9054-d867.ngrok.io/api/bukti-pembayaran/${id_order}`,
                method:"POST",
                data: datasBuktiPembayaran
            })
            .then((response) => {
                const result = response.data;
                const { message, success, status, data } = result;
                console.log(response.data);
            })
            .catch((error)=> {
                // console.error('error', error);
                console.log(error.response)
                handleMessage("Format Bukti Pembayaran haru dalam bentuk jpg, jpeg, png, pdf!");
            });
            } else {
            alert('Bukti Pembayaran tidak boleh kosong!');
            }
                Alert.alert("Berhasil", "Upload Bukti Pembayaran Berhasil!", [
                {
                    text:"OK",
                    onPress: () => navigation.navigate('Penyewaan'),
                },
                ]);
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
    };

    const handleMessage = (message, type = 'failed') => {
        setMessage(message);
        setMessageType(type);
    }

    var idLocale=require('moment/locale/id');
    Moment.locale('id');
    const tenggat = Moment(dateSkr).add(30, 'days')

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
    return (
        <>
            <View style={{ height: '60%'}}>
                <PDFReader
                    source={{
                    uri: `http://d480-2001-448a-6060-f025-e101-75c0-9054-d867.ngrok.io/api/skrPdf/${id_order}`,
                    }}
                />
            </View>
            <ScrollView style={{ paddingBottom: 16 }}>
                <Card style={styles.card}>
                    <View style={{ height: 48, textAlignVertical: 'center', backgroundColor: '#25185A', borderTopLeftRadius:15, borderTopRightRadius:15}}>
                        <Text style={{ marginLeft:16, marginTop:14, textAlignVertical: 'center', fontWeight:'bold', color: '#ffffff' }}>Jangka Waktu Penyewaan</Text>
                    </View>
                    <View style={{ margin: 16 }}>
                        <Text style={{ fontWeight: 'bold' }}>Selesaikan pembayaran sebelum:</Text>
                        <Text>{Moment(tenggat).format('dddd, DD MMMM YYYY')}</Text>
                    </View>
                    <View style={{ margin: 16 }}>
                        <Text style={{ fontWeight: 'bold' }}>Transfer ke:</Text>
                        <View style={{ justifyContent: 'space-between' }}>
                            <Text style={{ fontWeight:'bold', fontSize: 18 }}>Rekening Bank Kalbar</Text>
                            <Text style={{ fontWeight:'bold', fontSize: 32 }}>1001013358</Text>
                        </View>
                    </View>
                    <View style={styles.border2}/>
                </Card>
                <TouchableOpacity onPress={pickBuktiPembayaran}>
                    <View style={{ elevation: 12, margin: 16, height: 120, backgroundColor: '#fff', padding: 4, borderRadius: 20, borderColor: '#6C6B6B', borderWidth:2 }}>
                        <View style={{height: 40, width: '100%', flexDirection:'row', justifyContent:'center', alignItems:'center', flex:1}}>
                            <Image source={Add} style={{ width: 45, height: 45 }}/>
                            {/* {ktp &&
                            <Text>{ktp, datasKtp}</Text>
                            } */}
                            <View style={{ width:'80%' }}>
                                <Text style={{ fontSize:18, fontWeight: 'bold', marginLeft: 16 }}>Bukti Pembayaran</Text>
                                <Text style={{ marginLeft: 16, fontSize: 14, fontWeight: 'bold' }}>Tap disini pilih file dari perangkat Anda</Text>
                                <Text style={{ marginLeft: 16, fontSize:11 }}>Pastikan format file dalam bentuk png/jpg/jpeg/pdf !</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginBottom: 16 }} onPress={(e) =>
                    {
                        letHide(e),
                        doYourTask(e),
                        handlePembayaran(e)
                    }
                    }
                    disabled={isDisabled}
                >
                    {visible == true &&
                        <ActivityIndicator
                        size="large"
                        color="#00B8D4"
                        animating={visible}
                        style={{ marginBottom: 20 }}
                        />
                    }
                    {visible == false &&
                        <View style={styles.button}>
                        <Text style={styles.buttonTitle}>SIMPAN</Text>
                        </View>
                    }
                </TouchableOpacity>
            </ScrollView>
        </>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      height: 250,
      padding: 10,
    },
    row: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      justifyContent: 'space-between',
      alignItems: "center",
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#ffd700',
        borderRadius: 8,
        height: 48,
        justifyContent: 'center',
        textAlign: 'center',
        padding: 4,
        marginHorizontal:16
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
    preview: {
        width: 335,
        height: 114,
        backgroundColor: "#F8F8F8",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
    },
    card: {
        shadowOffset: {width:0, height:2},
        shadowOpacity: 0.5,
        borderTopLeftRadius:15,
        borderTopRightRadius:15,
        margin:16,
        marginBottom: 16,
        borderColor:'green',
        borderWidth:2
    },
    border2: {
        backgroundColor: "#C4C4C4",
        height: "1%",
        opacity: 0.4,
      },
  });