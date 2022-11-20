import React, {useContext} from 'react';
import { StyleSheet, Text, View, Image, FlatList, TextInput, TouchableOpacity, Dimensions, ImageBackground, Button } from "react-native";
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
const win = Dimensions.get("window");
import logo from "../assets/icon.png";
import { useIsFocused } from '@react-navigation/native';

export default function DetaiRefund({ navigation, route }) {
  const {refund} = route.params
  const [data, setData] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [page, setPage] = useState(1);
  const [text, setText] = useState('');
  const [cari, setCari] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();

  const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
  const alat = order.alat
  console.log(alat)
  const total_harga = alat.reduce((total,item)=>{
    const harga_sewa_perhari = item.jumlah_hari_refund * item.harga_sewa_perhari
    const harga_sewa_perjam = item.jumlah_jam_refund * item.harga_sewa_perjam
    const total_biaya = harga_sewa_perhari+harga_sewa_perjam
    return total + total_biaya;
  },0)

  const eq=refund.alat
  // const order_id = alat.order_id
  const total_harga_perhari = eq.reduce((total,item)=>{
    const harga_sewa_perhari = total_hari * item?.[0]?.harga_sewa_perhari
    return total + harga_sewa_perhari;
  },0)
  const total_harga_perjam = eq.reduce((total,item)=>{
    const harga_sewa_perjam = total_jam * item?.[0]?.harga_sewa_perjam
    return total + harga_sewa_perjam;
  },0)

  useEffect(async() => {
    setIsLoading(true);
    fetch('http://e565-180-242-214-45.ngrok.io/api/refunds')
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
    fetch('http://e565-180-242-214-45.ngrok.io/api/detail-refunds')
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
  var dtMulai = refund.tanggal_mulai
  var dtSelesai = refund.tanggal_selesai

  return (
    <View style={{ padding:8 }}>
      <Card style={{ backgroundColor: '#C4C4C4' }}>
        <View style={{ flexDirection:'row', justifyContent: "space-between", height: 48, backgroundColor: '#25185A'}}>
          <Image style={styles.icon} source={logo} />
          <Text style={{ marginRight:16, textAlignVertical: 'center', fontWeight:'bold', color: '#ffffff' }}>Kode Refund ALB-Ref-{refund.id}</Text>
        </View>
        <View style={{ padding:16 }}>
          <Card style={styles.card}>
            <View style={{ height: 48, textAlignVertical: 'center', backgroundColor: '#25185A', borderTopLeftRadius:15, borderTopRightRadius:15}}>
              <Text style={{ marginLeft:16, marginTop:14, textAlignVertical: 'center', fontWeight:'bold', color: '#ffffff' }}>Data Refund</Text>
            </View>
            <View style={{ flexDirection:'row', justifyContent: "space-between", padding:8}}>
              <Text>Tanggal Pengajuan:</Text>
              <Text>{Moment(refund.created_at).format('dddd, DD MMMM YYYY')}</Text>
            </View>
            <View style={{ flexDirection:'row', justifyContent: "space-between", padding:8}}>
              <Text>Metode Refund:</Text>
              <Text>{refund.metode_refund}</Text>
            </View>
          </Card>
          <Card style={styles.card}>
            <View style={{ height: 48, textAlignVertical: 'center', backgroundColor: '#25185A', borderTopLeftRadius:15, borderTopRightRadius:15}}>
              <Text style={{ marginLeft:16, marginTop:14, textAlignVertical: 'center', fontWeight:'bold', color: '#ffffff' }}>Detail Refund</Text>
            </View>
            {alat.map((item)=>
              <Card key={item.id} {...item} >
                <View style={{ margin:16 }}>
                  <Text>{item.metode_refund}</Text>
                  <View style={{ flexDirection:'row', justifyContent: "space-between" }}>
                    <View>
                      <Image source={{ uri:'http://e565-180-242-214-45.ngrok.io/storage/'+item?.[0].alat.foto }} style={{ width:58, height:58, marginRight:8 }} />
                      <Text style={{ fontWeight:'100', marginBottom:4, fontSize:11 }}>{iitem?.[0].alat.nama_alat}</Text>
                    </View>
                    <View>
                      <Text style={{ opacity: 0.4, fontSize:12 }}>Jumlah hari refund</Text>
                      <Text style={{ fontWeight:'bold', marginBottom:8, fontSize:12 }}>{item.jumlah_hari_refund} X Rp.{Number(item.harga_sewa_perhari).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')},-</Text>
                      <Text style={{ opacity: 0.4, fontSize:12 }}>Jumlah jam refund</Text>
                      <Text style={{ fontWeight:'bold', marginBottom:4, fontSize:12 }}>{item.jumlah_jam_refund} X Rp.{Number(item.harga_sewa_perjam).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')},-</Text>
                    </View>
                    <View>
                      <Text>x1</Text>
                      <Text style={{ marginBottom:8, fontWeight:'bold', fontSize:12 }}>Rp.{Number(item.jumlah_hari_refund * item.harga_sewa_perhari).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')},-</Text>
                      <Text>x1</Text>
                      <Text style={{ fontWeight:'bold', fontSize:12 }}>Rp.{(item.jumlah_jam_refund) * Number(item.harga_sewa_perjam).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')},-</Text>
                    </View>
                  </View>
                  <View style={styles.border2}/>
                  <View style={{ flexDirection:'row', justifyContent: "space-between", marginTop:8 }}>
                    <Text>Total Pesanan:</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ marginLeft:8, fontWeight: 'bold' }}>Rp.{((item.jumlah_hari_refund * item.harga_sewa_perhari) + (item.jumlah_jam_refund * item.harga_sewa_perjam)).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')},-</Text>
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
              </Card>
            )}
            <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
              <Text style={{ fontWeight:'bold', fontSize:16, fontWeight:'bold', margin:16 }}> Total :</Text>
              <Text style={{ textAlign:'right', fontSize:16, fontWeight:'bold', margin:16 }}>Rp.{Number(total_harga_perhari).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')},-</Text>
            </View>
          </Card>
        </View>
      </Card>
    </View>
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
    borderColor:'#2196F3',
    borderWidth:2
  },
  icon: {
    width: 32,
    height:32,
    marginLeft:16,
    marginTop:8,
  }
});
