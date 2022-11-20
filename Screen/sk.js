import React, {useContext} from 'react';
import { StyleSheet, Text, View, Image, FlatList, TextInput, TouchableOpacity, Dimensions, ImageBackground, Button } from "react-native";
import { useState, useEffect } from "react";

import FloatingTabBar from "../components/FloatingTabBar";
import { ScrollView } from "react-native-gesture-handler";
import { Asset } from 'expo-asset';
import { AntDesign } from '@expo/vector-icons'
import ActivityIndicatorExample  from "../components/ActivityIndicatorExample";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from '../components/CredentialsContext';

import Profil from "../assets/image/user.png";
import Logout from "../assets/image/logout.png";
import BouncyCheckbox from "react-native-bouncy-checkbox";
const win = Dimensions.get("window");

export default function Refund({navigation}) {
  const [isSelected, setSelection] = useState(false);
  let bouncyCheckboxRef: BouncyCheckbox | null = null;
  const [checkboxState, setCheckboxState] = useState(false);
  return (
    <ScrollView>
      <ScrollView style={{ margin:16 }}>
        <View>
          <Text style={{ fontWeight:'bold', fontSize:18 }}>PERSYARATAN SEWA</Text>
          <Text>1. KTP yang Masih Berlaku</Text>
          <Text>2. Akte Notaris (Bagi Penyewaan Umum/Komersil yang Berbadan Hukum)</Text>
          <Text>3. Surat Pengantar dari RT / RW / Lurah / surat pengantar dari kedinasan (Bagi Penyewaan non-komersil(Sosial Masyarakat/Dinas lainnya)</Text>
        </View>
        <View style={{ marginTop:32 }}>
          <Text style={{ fontWeight:'bold', fontSize:18 }}>MEKANISME DAN PROSEDUR SEWA</Text>
          <Text>1. Penyewa login atau register(jika belum memiliki akun)</Text>
          <Text>2. Cek jadwal alat apakah alat tersedia pada waktu yang ingin disewa</Text>
          <Text>3. Pilih alat dan masukkan ke keranjang jika alat tersedia</Text>
          <Text>4. Isi Formulir Penyewaan</Text>
          <Text>5. Penyewaan dapat dilakukan minimum lima(5) hari sebelum digunakan</Text>
          <Text>6. Admin akan mengecek pengajuan</Text>
          <Text>7. Menunggu persetujuan Kepala UPTD dan Kepala Dinas</Text>
          <Text>8. Jika pengajuan sewa telah disetujui, penyewa dapat mengunduh dokumen perjanjian sewa</Text>
          <Text>9. Jika pengajuan telah disetujui, bendahara akan menerbitkan SkR (khusus penyewa umum atau komersil)</Text>
          <Text>10. Penyewa baru bisa membayar tagihan jika SKR telah terbit (khusus penyewa umum atau komersil)</Text>
          <Text>11. Pembayaran dilakukan selambat-lambatnya 30 hari sejak SKR diterbitkan. Jika penyewa membayar melewati tenggat waktu, maka penyewa akan dikenakan denda sebesar 2% dari total tagihan (khusus penyewa umum atau komersil).</Text>
          <Text>12. Pengambilan alat beserta penandatanganan dokumen perjanjian sewa.</Text>
          <Text>13. Pengembalian alat. Kontrak selesai</Text>
        </View>
      </ScrollView>
      <View style={styles.wrapper}>
        <BouncyCheckbox
          size={20}
          fillColor="#ffcd04"
          unfillColor="#FFFFFF"
          text="Saya setuju dengan syarat dan ketentuan yang berlaku"
          iconStyle={{ borderColor: "#ffcd04" }}
          iconStyle={{borderRadius: 0}}
          ref={(ref: any) => (bouncyCheckboxRef = ref)}
          isChecked={checkboxState}
          disableBuiltInState
          textStyle={{textDecorationLine: "none"}}
          // onPress={(isChecked: boolean) => {}}
          onPress={() => setCheckboxState(!checkboxState)}
        />
      </View>
      {checkboxState ?
        <TouchableOpacity onPress={() => navigation.navigate('Formulir Order Step 1')} style={{ margin: 16 }}>
          <View style={styles.btn}>
              <Text style={styles.buttonTitle}>SEWA ALAT</Text>
          </View>
        </TouchableOpacity>:
        <TouchableOpacity disabled={true} onPress={() => navigation.navigate('Formulir Order Step 1')} style={{ margin: 16 }}>
          <View style={styles.btn2}>
              <Text style={styles.buttonTitle}>SEWA ALAT</Text>
          </View>
        </TouchableOpacity>
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    paddingVertical: 15,
    marginHorizontal:24,
    marginVertical:12
  },
  btn: {
    backgroundColor: '#ffcd04',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    textAlign: 'center',
    padding:8,
  },
  btn2: {
    backgroundColor: '#ffcd04',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    textAlign: 'center',
    padding:8,
    opacity:0.5
  },
  buttonTitle: {
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 0,
    color: '#fff',
    fontWeight: '600',
    lineHeight: 22,
  },
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
});
