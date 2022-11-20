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
import { DataTable } from 'react-native-paper';

import Add from "../assets/image/plus.png";

export default function FormPembayaran({ navigation, route }) {
    const {id_order} = route.params
    const {skr} = route.params
    const {dateSkr} = route.params
    const {total_harga} = route.params
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [buktiPembayaran, setBuktiPembayaran] = useState(null);
    const [data, setData] = useState([]);
    const [visible, setVisible] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [detail, setDetail] = useState([]);
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
    const {nama, email, id, token} = storedCredentials;

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
            url:`http://48a3-2001-448a-6060-519e-4cc7-b779-fedd-d7bd.ngrok.io/api/payments`,
            method:"POST",
            headers: {
                //  'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+token,
            },
            data:
            {
              order_id:id_order,
              tenant_id: id,
              total: total_bayar
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
                url:`http://48a3-2001-448a-6060-519e-4cc7-b779-fedd-d7bd.ngrok.io/api/bukti-pembayaran/${id_order}`,
                method:"POST",
                // headers: {
                //     //  'Accept': 'application/json',
                //     'Content-Type': 'application/json',
                //     'Authorization': 'Bearer '+token,
                // },
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
                    onPress: () => navigation.navigate("Penyewaan"),
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
        alert('Bukti pembayaran tidak boleh kosong!');
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

    var date = Moment()
    const denda = 0.02 * total_harga

    const dt= Moment(dateSkr)
    const range = Moment.range(dt, tenggat);
    const umurSkr = range.diff('days')
    const teng = Moment(tenggat)

    const total_bayar = total_harga+denda

    return (
        <>
            <View style={{ height: '85%'}}>
                <PDFReader
                    source={{
                    uri: `http://48a3-2001-448a-6060-519e-4cc7-b779-fedd-d7bd.ngrok.io/api/skrPdf/${id_order}`,
                    headers: {
                    //  'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+token,
                    }
                    }}
                />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('SKR', {id_order: id_order, skr: data.skr, dateSkr: data.created_at, total_harga: total_harga})} style={{ margin: 16 }}>
            <View style={styles.button}>
                <Text style={styles.buttonTitle}>LANJUTKAN PEMBAYARAN</Text>
            </View>
            </TouchableOpacity>
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
        backgroundColor: '#ffcd04',
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
        borderColor:'#2196F3',
        borderWidth:2
    },
    border2: {
        backgroundColor: "#C4C4C4",
        height: "1%",
        opacity: 0.4,
      },
  });