import React, {useEffect, useState, useContext} from 'react';
import { Text, View, StyleSheet, Image, Button, ImageBackground, FlatList, Alert, SafeAreaView, ScrollView, Dimensions, Picker, TouchableOpacity } from 'react-native';
import Cart from "../assets/image/cart.png";
import Notif from "../assets/image/notif.png";
import { AntDesign } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Dropdown } from 'react-native-material-dropdown-v2-fixed';
const win = Dimensions.get("window");
import DatePicker from 'react-native-datepicker';
import ActivityIndicatorExample  from "../components/ActivityIndicatorExample";
import DateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import DateRangePicker from "react-native-daterange-picker";
// import * as Calendar from 'expo-calendar';
// import EventCalendar from 'react-native-events-calendar';
import { CartContext } from './../components/CartContext';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
// import { Calendar } from 'react-native-calendario';
import DateRangePicker from "rnv-date-range-picker";
let {width} = Dimensions.get('window');
import { useIsFocused } from '@react-navigation/native';
import { CartIcon } from './../components/CartIcon.js';
// import { CartContext } from './CartContext';
// import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function Detail({ navigation, route }) {
    const {alat} = route.params
    const [product, setProduct] = useState({});
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAdd, setIsAdd] = useState(false);
    const [selectedRange, setRange] = useState({});
    const [date1, setDate] = useState(new Date());
    const [date2, setDate2] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [mode2, setMode2] = useState('date');
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [currentDate, setCurrentDate] = useState();

    // const { addItemToCart } = useContext(CartContext);
    // const [items, setItems] = useState([]);
    const {storedCart, setStoredCart} = useContext(CartContext);
    const {itemCount} = useContext(CartContext);
    const {items, setItems} = useContext(CartContext);
    const isFocused = useIsFocused();
    // const {nama} = storedCart;

    const id_alat= alat.id_alat
    const harga=alat.harga_sewa_perhari
    const nama_alat=alat.nama


    const addCart = (alat) => {
        persistCart(alat);
        setIsAdd(true);
    };

    const persistCart = (cart) => {
        AsyncStorage.setItem('cartCredentials', JSON.stringify(alat))
        .then(() => {
            // setStoredCart(alat);
            const product = alat;
            setItems((prevItems) => {
                const alat = prevItems.find((alat) => (alat.id_alat == id_alat));
                if(!alat) {
                    return [...prevItems, {
                        id_alat,
                        qty: 1,
                        product,
                        totalPrice: product.harga_sewa_perjam,
                    }];
                    alat.qty++
                }
                else {
                    Alert.alert("Alat sudah ada di keranjang!")
                    return [...prevItems];
                }
            })
        })
        .catch((error) => {
          console.log(error);
        })
    }

    useEffect(async() => {
        let isMounted = true
        setIsLoading(true);
        fetch('https://sialbert.000webhostapp.com/teknisi/schedule/show/' + alat.id_alat)
          .then((response) => response.json())
          .then((hasil) => {
            setData(hasil);
            setCari(hasil);
            setIsLoading(false);
          })
          // .finally(() => setLoading(false));
          .catch(error => { console.log; });
    }, [isFocused]);
    const listOrders = ({item}) => {
        const tanggal = [...item.tanggal_mulai]
    }
    // console.log(data)
    // console.log('https://sialbert.000webhostapp.com/teknisi/schedule/show/' + alat.id_alat)

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

    // console.log(items, product)

    const cekCart = () => {
        Alert.alert("Cart", "Alat sudah ada di keranjang!", [
            {
              text:"OK",
              onPress: () => {},
            },
        ]);
    }
    const harga_sewa_perhari = alat.harga_sewa_perhari
    const harga_sewa_perjam = alat.harga_sewa_perjam
    // console.log(date1)
    // console.log(date2)
    // const data2= data.map((item, idx) => {
    //     const tanggal_mulai = item.tanggal_mulai
    //     const tanggal_selesai = item.tanggal_selesai
    //     console.log(tanggal_mulai)
    // })

    // objectList.map((item, idx)=>{
    //     const month = item.month
    //     const range = [...month]
    //     let anyString = 'tes'
    //     range.map((item, idx)=>{
    //         const rentang = item.substring(0,10)
    //         // console.log(rentang)
    //     })
    // })

    // let calenderItems = objectList.reduce((acc, leave) => {
    //     let { tanggal_mulai, tanggal_selesai } = leave;
    //     var fromDateObject = {
    //         ...acc,
    //         [tanggal_mulai]: {
    //             startingDay: true,
    //             endingDay: false,
    //             color: '#ffcd04'
    //         },
    //     }
    //     return {
    //       ...fromDateObject,
    //       [tanggal_selesai]: {
    //         startingDay: false,
    //         endingDay: true,
    //         color: '#ffcd04'
    //       },
    //     };
    // }, {});

    console.log(data)
    const objectList = [...data]
    let calenderItems = objectList.reduce((acc, leave) => {
        let { tanggal_mulai, tanggal_selesai } = leave;
        let start = Moment(tanggal_mulai).startOf('day').add(1, 'days');
        let end = Moment(tanggal_selesai).startOf('day');
        const dateRange = {
            [tanggal_mulai]: { selected: true, startingDay: true, color: '#ffcd04' },
            [tanggal_selesai]: { selected: true, endingDay: true, color: '#ffcd04' },
        };
        while (end.isAfter(start)) {
            Object.assign(dateRange, { [start.format('YYYY-MM-DD')]: { selected: true, color: '#ffcd04' } });
            start = start.add(1, 'days');
        }
        return {...acc, ...dateRange};
    }, {});
    console.log(calenderItems)
    // calenderItems = Object.keys(calenderItems)
    // .sort()
    // .reduce((obj, key) => {
    //     obj[key] = calenderItems[key];
    //     return obj;
    // }, {});


    // let a = objectList.map((item, idx)=>{
    //     const month = item.month
    //     const range = [...month]
    //     let anyString = 'tes'
    //     const b = range.map((item, idx)=>{
    //         const rentang = item.substring(0,10)
    //         return rentang;
    //         // const deliveryDates = [
    //         //     {date:rentang, deliveryStatus:false, endingDay:false, startingDay:true},
    //         // ];

    //         // const markedDates = deliveryDates.reduce((acc, {date,endingDay,startingDay}) => {
    //         //     acc[date] = {disabled: true, color: 'green', startingDay, endingDay};
    //         //     return acc;
    //         // },{});
    //         // return markedDates;
    //         // console.log(markedDates)
    //     })
    //     return b;
    // })
    // const k = a.map((item, idx)=>{
    //     const deliveryDates = [
    //         {date:a, deliveryStatus:false, endingDay:false, startingDay:true},
    //     ];
    //     const markedDates = deliveryDates.reduce((acc, {date,endingDay,startingDay}) => {
    //         acc[date] = {disabled: true, color: 'green', startingDay, endingDay};
    //         return acc;
    //     },{});
    //     return markedDates;
    // })

    let newDaysObject = {};
    // const i =a.forEach((day) => {
    //     newDaysObject[day] = {
    //         selected: true,
    //         marked: true
    //     }
    //     return newDaysObject[day]
    // });

    const photo ='https://sialbert.000webhostapp.com/' +alat.foto + '/' +alat.foto
    return (
        <ScrollView style={{ backgroundColor:'#fff' }}>
            <View style={{ backgroundColor:'#fff' }}>
                <View style={{ height:250, width: '100%' }}>
                    <Image source={{uri: photo}} style={styles.equipmentImage}/>
                </View>
                <View style= {{ flexDirection:'row', justifyContent: 'space-between' }}>
                    <View style={{ padding:16 }}>
                        <Text style={styles.textHeader}>{alat.nama_alat}</Text>
                        <Text style={{ marginTop:4 }}>{alat.model}</Text>
                        <Text style={{ marginTop:4 }}>{alat.jenis}</Text>
                        <Text style={{ marginTop:8 }}>{alat.kegunaan}</Text>
                        <Text style={{ marginTop:8 }}>{alat.spesifikasi}</Text>
                        <View style={{ flexDirection:'row', justifyContent:'space-between', marginTop:8 }}>
                            <Text>Kondisi:</Text>
                            <Text>{alat.kondisi}</Text>
                        </View>
                        <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
                            <Text>Harga Sewa Perjam:</Text>
                            <Text>Rp.{Number(harga_sewa_perjam).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-</Text>
                        </View>
                        <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
                            <Text>Harga Sewa Perhari:</Text>
                            <Text style={{ marginTop:4 }}>Rp.{Number(harga_sewa_perhari).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},-</Text>
                        </View>
                    </View>
                </View>
                <View style={{ borderBotomColor:'yellow', borderBottomWidth: 2 }} opacity={0.5}/>
            </View>
            <SafeAreaView>
                <View>
                {!isLoading ?
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
                    </View> : (
                    <Calendar
                        markingType={'period'}
                        onDayPress={day => {
                            // console.log('selected day', day);
                        }}
                        markedDates={calenderItems}
                        // disabledDaysIndexes={[0, 6]}
                        theme={{
                            selectedColor: 'blue'
                        }}
                    />
                )}
                </View>
            </SafeAreaView>
            <View style={{ flexDirection: 'row', margin: 16 }}>
                <TouchableOpacity onPress={addCart} style={{ width: '75%'}}>
                    <View style={styles.pickButton}>
                        <Text style={styles.buttonTitle}>Tambah ke keranjang</Text>
                    </View>
                </TouchableOpacity>
                <CartIcon navigation={navigation}/>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    equipmentImage: {
        width: '100%',
        height: '100%',
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerContainer: {
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: 'white',
        padding: 16,
        marginTop: 16
    },
    textHeader: {
        fontSize: 24,
        fontWeight: "bold",
    },
    pickedDateContainer: {
        padding: 20,
        backgroundColor: '#eee',
        borderRadius: 10,
    },
    pickedDate: {
        color: 'yellow',
        fontSize: 14,
        textAlign: 'center',
    },
    btnContainer: {
        padding: 30,
    },
    pickButton: {
        alignItems: 'center',
        backgroundColor: '#ffcd04',
        borderRadius: 8,
        height: 48,
        justifyContent: 'center',
        textAlign: 'center',
        marginTop: 8,
        padding: 8,
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
})