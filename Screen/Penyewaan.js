import React, { useContext } from "react";
import {
  StyleSheet,
  Alert,
  Text,
  View,
  Image,
  FlatList,
  TextInput,
  ToastAndroid,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Button,
} from "react-native";
import { useState, useEffect } from "react";

import { ScrollView } from "react-native-gesture-handler";
import { Asset } from "expo-asset";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "react-native-paper";
import Moment from "moment";
import ActivityIndicatorExample from "../components/ActivityIndicatorExample";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CredentialsContext } from "../components/CredentialsContext";
import { StatusBar } from "expo-status-bar";
import * as FileSystem from "expo-file-system";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";

import Rent from "../assets/image/rent-active.png";

import {
  AndroidImportance,
  AndroidNotificationVisibility,
  NotificationChannel,
  NotificationChannelInput,
  NotificationContentInput,
} from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const channelId = "DownloadInfo";

const win = Dimensions.get("window");

export default function MenuUtama({ navigation }) {
  // const {nama, email} = route.params;
  const [data, setData] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [alats, setAlats] = useState([]);
  const [page, setPage] = useState(1);
  const [text, setText] = useState("");
  const [cari, setCari] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);
  const { nama, email, id, token } = storedCredentials;
  const isFocused = useIsFocused();

  // const [downloadProgress, setDownloadProgress] = useState(0);
  const [document, setDocument] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState("0%");

  async function setNotificationChannel() {
    const loadingChannel = await Notifications.getNotificationChannelAsync(
      channelId
    );

    // if we didn't find a notification channel set how we like it, then we create one
    if (loadingChannel == null) {
      const channelOptions = {
        name: channelId,
        importance: AndroidImportance.HIGH,
        lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
        sound: "default",
        vibrationPattern: [250],
        enableVibrate: true,
      };
      await Notifications.setNotificationChannelAsync(
        channelId,
        channelOptions
      );
    }
  }

  useEffect(async () => {
    let isMounted = true;
    await MediaLibrary.requestPermissionsAsync();
    await Notifications.requestPermissionsAsync();
    setNotificationChannel();
  }, [isFocused]);

  const downloadProgressUpdater = ({
    totalBytesWritten,
    totalBytesExpectedToWrite,
  }) => {
    const pctg = 100 * (totalBytesWritten / totalBytesExpectedToWrite);
    setDownloadProgress(`${pctg.toFixed(0)}%`);
  };

  useEffect(async () => {
    let isMounted = true;
    setIsLoading(true);
    fetch(`http://e565-180-242-214-45.ngrok.io/api/orders/${id}`, {
      method: "GET",
      headers: {
        //  'Accept': 'application/json',
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((hasil) => {
        setData(hasil);
        setCari(hasil);
        setIsLoading(false);
      })
      // .finally(() => setLoading(false));
      .catch((error) => {
        console.log;
      });
  }, [isFocused]);

  const listOrders = ({ item }) => {
    const alat = [...item.alat];
    const inisialValue = 0;
    var i;
    const total_hari = item.total_hari;
    const total_jam = item.total_jam;
    const count = item.total_alat;
    const sum = harga_perhari + harga_perjam;
    const order_id = item.id;
    // const nama_alat=alat?.[0]?.[0].alat.nama_alat
    // console.log('alat',alat?.[0].alat?.[0].nama_alat)
    const nama_alat = alat?.[0]?.[0].alat.nama_alat;
    const harga_perhari = alat?.[0]?.[0].alat.harga_sewa_perhari * total_hari;
    const harga_perjam = alat?.[0]?.[0].alat.harga_sewa_perjam * total_jam;
    // const harga_perjam = alat?.[0]?.[0]?.alat?.[0].harga_sewa_perjam * total_jam
    const eq = alat;
    console.log("eq", eq);
    const total_harga_perhari = alat.reduce((total, item) => {
      const harga_sewa_perhari = total_hari * item?.[0].alat.harga_sewa_perhari;
      return total + harga_sewa_perhari;
    }, 0);
    const total_harga_perjam = alat.reduce((total, item) => {
      const harga_sewa_perjam = total_jam * item?.[0].alat.harga_sewa_perjam;
      return total + harga_sewa_perjam;
    }, 0);
    const id_alat = alat?.[0]?.equipment_id;
    // console.log(id_alat)
    // useEffect(() => {
    //   let isMounted = true
    //   setIsLoading(true);
    //   fetch('https://sialbert.000webhostapp.com/teknisi/equipments/show/' +id_alat)
    //     .then((response) => response.json())
    //     .then((hasil) => {
    //       setData(hasil);
    //       setIsLoading(false);
    //     })
    //     // .finally(() => setLoading(false));
    //     .catch(error => { console.log; });
    // }, [isFocused]);
    var idLocale = require("moment/locale/id");
    Moment.locale("id");
    var dt = item.created_at;
    var id_order = item.id;
    var nama_instansi = item.nama_instansi;

    return (
      <>
        <ScrollView>
          <TouchableOpacity
            onPress={() => navigation.navigate("Detail Order", { order: item })}
          >
            <View
              style={{
                flexDirection: "row",
                textAlign: "center",
                textAlignVertical: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  margin: 16,
                  textAlign: "center",
                  textAlignVertical: "center",
                  justifyContent: "center",
                }}
              >
                {/* <Image source={{uri: item.foto}} style={styles.myequipmentImage} /> */}
                <Card style={styles.card}>
                  <View
                    style={{
                      margin: 16,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Image
                        source={Rent}
                        style={{ width: 24, height: 24, marginRight: 8 }}
                      />
                      <Text style={{ fontWeight: "bold" }}>
                        {Moment(dt).format("DD MMMM YYYY")}
                      </Text>
                    </View>
                    {(() => {
                      if (item.ttd_pemohon == "") {
                        return (
                          <View
                            style={{
                              borderWidth: 2,
                              borderRadius: 8,
                              borderColor: "#FB1313",
                              alignItems: "center",
                              padding: 2,
                            }}
                          >
                            <Text
                              style={{
                                textAlign: "right",
                                color: "#FB1313",
                                alignItems: "flex-end",
                                justifyContent: "flex-end",
                                alignContent: "flex-end",
                              }}
                            >
                              Belum ditandatangan
                            </Text>
                          </View>
                        );
                      } else {
                        if (item.ket_persetujuan_kepala_dinas === "setuju") {
                          return (
                            <View
                              style={{
                                borderWidth: 2,
                                borderRadius: 8,
                                borderColor: "#11CF00",
                                alignItems: "center",
                                padding: 2,
                              }}
                            >
                              <Text
                                style={{
                                  textAlign: "right",
                                  color: "#11CF00",
                                  alignItems: "flex-end",
                                  justifyContent: "flex-end",
                                  alignContent: "flex-end",
                                }}
                              >
                                Pengajuan disetujui
                              </Text>
                            </View>
                          );
                        }
                        if (
                          item.ket_persetujuan_kepala_uptd !== "tolak" &&
                          item.ket_verif_admin !== "tolak"
                        ) {
                          if (
                            (item.ket_persetujuan_kepala_dinas === "belum" ||
                              item.ket_persetujuan_kepala_uptd === "belum") &&
                            item.ket_verif_admin === "verif"
                          ) {
                            return (
                              <View
                                style={{
                                  borderWidth: 2,
                                  borderRadius: 8,
                                  borderColor: "#FAD603",
                                  alignItems: "center",
                                  padding: 2,
                                }}
                              >
                                <Text
                                  style={{
                                    textAlign: "right",
                                    color: "#FAD603",
                                    alignItems: "flex-end",
                                    justifyContent: "flex-end",
                                    alignContent: "flex-end",
                                  }}
                                >
                                  Menunggu persetujuan
                                </Text>
                              </View>
                            );
                          } else if (
                            (item.ket_persetujuan_kepala_dinas === "belum" ||
                              item.ket_persetujuan_kepala_uptd === "belum") &&
                            item.ket_verif_admin === "belum"
                          ) {
                            return (
                              <View
                                style={{
                                  borderWidth: 2,
                                  borderRadius: 8,
                                  borderColor: "#FAD603",
                                  alignItems: "center",
                                  padding: 2,
                                }}
                              >
                                <Text
                                  style={{
                                    textAlign: "right",
                                    color: "#FAD603",
                                    alignItems: "flex-end",
                                    justifyContent: "flex-end",
                                    alignContent: "flex-end",
                                  }}
                                >
                                  Menunggu verifikasi
                                </Text>
                              </View>
                            );
                          }
                        }
                        if (
                          item.ket_verif_admin === "tolak" ||
                          item.ket_persetujuan_kepala_uptd === "tolak" ||
                          item.ket_persetujuan_kepala_dinas === "tolak"
                        ) {
                          return (
                            <View
                              style={{
                                borderWidth: 2,
                                borderRadius: 8,
                                borderColor: "#FB1313",
                                alignItems: "center",
                                padding: 2,
                              }}
                            >
                              <Text
                                style={{
                                  textAlign: "right",
                                  color: "#FB1313",
                                  alignItems: "flex-end",
                                  justifyContent: "flex-end",
                                  alignContent: "flex-end",
                                }}
                              >
                                Pengajuan Ditolak
                              </Text>
                            </View>
                          );
                        }
                      }
                      return null;
                    })()}
                  </View>
                  <View style={styles.border2} />
                  <View style={{ margin: 16 }}>
                    <Text>{item.nama_kegiatan}</Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Image
                        source={{
                          uri:
                            "https://sialbert.000webhostapp.com/" +
                            alat?.[0]?.[0].alat.foto +
                            "/" +
                            alat?.[0]?.[0].alat.foto,
                        }}
                        style={{ width: 58, height: 58, marginRight: 8 }}
                      />
                      <View>
                        <Text>{nama_alat}</Text>
                        {total_hari > 0 ? (
                          <Text>
                            Rp.
                            {Number(alat?.[0]?.[0].alat.harga_sewa_perhari)
                              .toFixed(0)
                              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
                            ,-
                          </Text>
                        ) : (
                          <Text>
                            Rp.
                            {Number(alat?.[0]?.[0].alat.harga_sewa_perjam)
                              .toFixed(0)
                              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
                            ,-
                          </Text>
                        )}
                        {total_hari > 0 ? (
                          <Text>x{total_hari} hari</Text>
                        ) : (
                          <Text>x{total_jam} jam</Text>
                        )}
                        {total_hari > 0 ? (
                          <Text style={{ fontWeight: "bold" }}>
                            Rp.
                            {harga_perhari
                              .toFixed(0)
                              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
                            ,-
                          </Text>
                        ) : (
                          <Text style={{ fontWeight: "bold" }}>
                            Rp.
                            {harga_perjam
                              .toFixed(0)
                              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
                            ,-
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.border2} />
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text>{count} Alat</Text>
                      <View style={{ flexDirection: "row", marginTop: 4 }}>
                        <Text>Total Pesanan:</Text>
                        {total_hari > 0 ? (
                          <Text style={{ marginLeft: 8, fontWeight: "bold" }}>
                            Rp.
                            {total_harga_perhari
                              .toFixed(0)
                              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
                            ,-
                          </Text>
                        ) : (
                          <Text style={{ marginLeft: 8, fontWeight: "bold" }}>
                            Rp.
                            {total_harga_perjam
                              .toFixed(0)
                              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
                            ,-
                          </Text>
                        )}
                        {/* <Text style={{ marginLeft:8 , fontWeight:'bold'}}>Rp.{total_harga_perhari.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-</Text> */}
                      </View>
                    </View>
                  </View>
                  <View style={styles.border2} />
                  <Text
                    style={{ textAlign: "center", margin: 4, color: "#C4C4C4" }}
                  >
                    Lihat Detail
                  </Text>
                  <View style={styles.border2} />
                  <View style={{ flexDirection: "row", margin: 4 }}>
                    {/* <TouchableOpacity>
                      <View style={styles.btn}>
                        <Text style={styles.buttonTitle}>Download Bukti Bayar</Text>
                      </View>
                    </TouchableOpacity> */}
                    {item.ket_persetujuan_kepala_dinas == "setuju" && (
                      <TouchableOpacity
                        onPress={async () => {
                          await downloadToFolder(
                            `http://e565-180-242-214-45.ngrok.io/api/downloadDokumenSewa/${id_order}`,
                            `${id_order}.pdf`,
                            "Download",
                            channelId,
                            {
                              downloadProgressCallback: downloadProgressUpdater,
                              downloadProgressCallback: ToastAndroid.show(
                                `Sedang Mendownload, Mohon Menunggu!`,
                                ToastAndroid.SHORT
                              ),
                              // ToastAndroid.show(`Sedang Mendownload ${downloadProgress}`, ToastAndroid.SHORT)
                            }
                          );
                        }}
                      >
                        {/* <TouchableOpacity onPress={async () => {
                          await downloadToFolder('http://e565-180-242-214-45.ngrok.io/api/downloadDokumenSewa/1', filename, folder, channelId)
                        }}> */}
                        <View style={styles.btn}>
                          <Text style={styles.buttonTitle}>
                            Download Perjanjian Sewa
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    {item.ttd_pemohon == "" && (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("pdfFormulirOrder", {
                            order_id: item.id,
                          })
                        }
                      >
                        {/* <TouchableOpacity onPress={async () => {
                          await downloadToFolder('http://e565-180-242-214-45.ngrok.io/api/downloadDokumenSewa/1', filename, folder, channelId)
                        }}> */}
                        <View style={styles.btn}>
                          <Text style={styles.buttonTitle}>
                            Tanda Tangan Formulir
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                  {/* <Text>{item.alat}</Text> */}
                  {/* {alat.map((item)=>
                    <Card key={item.id} {...item} >
                    <Text>{item.alat}</Text>
                    </Card>
                  )} */}
                  {/* <View>
                      <FlatList
                        data={equipments}
                        horizontal
                        key={1}
                        numColumns={1}
                        nestedScrollEnabled
                        // fadingEdgeLength={10}
                        keyExtractor={item=>item.id}
                        // {item.id === item.order_id

                        // }
                        renderItem={listEquipments}
                        onEndReachedThreshold={0.5}
                        // getItemCount={getItemCount}
                        // getItem={getItem}
                      />
                    </View> */}
                </Card>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </>
    );
  };

  return (
    <>
      <View style={{ backgroundColor: "#fff" }}>
        <TouchableOpacity
          style={{ width: "50%" }}
          onPress={() => navigation.navigate("Cart")}
        >
          <View
            style={{
              borderWidth: 2,
              margin: 8,
              borderRadius: 20,
              borderColor: "#ffcd04",
              alignItems: "center",
              padding: 8,
              flexDirection: "row",
            }}
          >
            <Ionicons name="add" size={32} color="#ffcd04" />
            <Text style={{ color: "#ffcd04" }}>Ajukan Penyewaan</Text>
          </View>
        </TouchableOpacity>
        <StatusBar style="auto" />
        <View
          style={{
            height: 48,
            textAlignVertical: "center",
            backgroundColor: "#ffcd04",
            marginHorizontal: 16,
            marginVertical: 8,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          }}
        >
          <Text
            style={{
              marginLeft: 16,
              marginTop: 14,
              textAlignVertical: "center",
              fontWeight: "bold",
              color: "#ffffff",
            }}
          >
            Riwayat Penyewaan
          </Text>
        </View>
        <View style={styles.container}>
          <SafeAreaView
            style={{
              marginBottom: 300,
              justifyContent: "center",
              flexDirection: "row",
              flex: 1,
            }}
          >
            {isLoading ? (
              <View
                style={{
                  justifyContent: "center",
                  textAlign: "center",
                  textAlignVertical: "center",
                  marginTop: 0,
                  textAlign: "center",
                  flex: 1,
                  alignItems: "center",
                }}
              >
                <ActivityIndicatorExample style={styles.progress} />
              </View>
            ) : (
              <View>
                {data.length <= 0 && (
                  <View style={{ margin: 16 }}>
                    <Text>Anda belum pernah melakukan penyewaan</Text>
                  </View>
                )}
                {data.length > 0 && (
                  <View>
                    <Text style={{ marginHorizontal: 16 }}>
                      Pengajuan Anda baru diproses jika telah di tanda tangan!
                    </Text>
                    <FlatList
                      style={{ margin: 0 }}
                      data={data}
                      vertical
                      // key={1}
                      numColumns={1}
                      nestedScrollEnabled
                      // fadingEdgeLength={10}
                      keyExtractor={(item) => item.id}
                      renderItem={listOrders}
                      onEndReachedThreshold={0.5}
                      extraData={data}
                      // getItemCount={getItemCount}
                      // getItem={getItem}
                    />
                  </View>
                )}
              </View>
            )}
          </SafeAreaView>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  back: {
    backgroundColor: "#25185A",
  },
  container: {
    height: "100%",
    marginHorizontal: 16,
  },
  perda: {
    // flex: 1,
    position: "absolute",
    bottom: 80,
    width: "100%",
  },
  illus: {
    width: "100%",
  },
  perdaText: {
    position: "absolute",
    marginTop: 105,
    margin: 8,
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 24,
    height: 108,
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
    marginStart: 24,
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
    flexDirection: "row",
  },
  myequipmentItem: {
    alignItems: "center",
    elevation: 16,
    borderRadius: 75,
    borderWidth: 1,
    margin: 16,
    flexDirection: "row",
  },

  myequipmentImage: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderRadius: 75,
    margin: 8,
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
    margin: 8,
  },
  mybookTitle: {
    width: 65,
    color: "#212121",
  },
  textInput: {
    elevation: 12,
    flexDirection: "row",
    marginHorizontal: 16,
    backgroundColor: "#e9e9e9",
    padding: 10,
    marginVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderColor: "#364878",
  },
  btnSearch: {
    width: 18,
    height: 18,
    marginEnd: 8,
    marginVertical: 8,
  },
  progress: {
    justifyContent: "center",
    textAlign: "center",
    textAlignVertical: "center",
    marginTop: 0,
    textAlign: "center",
    flex: 1,
    alignItems: "center",
  },
  lainnya: {
    marginLeft: -90,
    marginTop: 196,
  },
  border2: {
    backgroundColor: "#C4C4C4",
    height: "1%",
    opacity: 0.4,
  },
  footer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  btn: {
    margin: 4,
    backgroundColor: "#ffcd04",
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
    textAlign: "center",
    padding: 8,
  },
  buttonTitle: {
    alignItems: "center",
    textAlign: "center",
    marginTop: 0,
    fontWeight: "600",
    lineHeight: 22,
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: "#800000",
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },
  card: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    width: "100%",
    height: "100%",
    borderColor: "#2196F3",
    borderWidth: 2,
  },
});
