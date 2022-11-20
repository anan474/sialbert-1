import React, {useState} from 'react';
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, style, TouchableOpacity } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./Screen/Login";
import Register from "./Screen/Register";
import Register2 from "./Screen/Register2";
import Setting from "./Screen/Setting";
import EditProfil from "./Screen/EditProfil";
import MenuUtama from "./Screen/MenuUtama";
import Detail from "./Screen/Detail";
import Alat from "./Screen/Alat";
import Penyewaan from "./Screen/Penyewaan";
import PdfFormulirOrder from "./Screen/PdfFormulirOrder";
import FormPembayaran from "./Screen/FormPembayaran";
import skr from "./Screen/skr";
import FormulirOrder from "./Screen/FormulirOrder";
import FormSecondStep from "./Screen/forms/FormSecondStep";
import DetailOrder from "./Screen/DetailOrder";
import DetailPembatalan from "./Screen/DetailPembatalan";
import FormReschedule from "./Screen/FormReschedule";
import FormRefund from "./Screen/FormReschedule";
import DetailRefund from "./Screen/DetailRefund";
import DetailReschedule from "./Screen/DetailReschedule";
import Pembatalan from "./Screen/Refund";
import Reschedule from "./Screen/Reschedule";
import Cart from "./Screen/Cart";
import sk from "./Screen/sk";
import { CartIcon } from './components/CartIcon.js';

import AppLoading from 'expo-app-loading';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from './components/CredentialsContext';
import { CartContext } from './components/CartContext';
import { CartProvider } from './components/CartContext.js';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FloatingTabBar from './components/FloatingTabBar';
// import Icon from 'react-native-vector-icons/AntDesign';
import { Ionicons } from '@expo/vector-icons';
import { Button } from 'react-native-paper';
// import { CartProvider } from './Screen/CartContext.js';

const Stack = createNativeStackNavigator();

// function MenuUtama() {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen name="Detail" component={Detail} />
//     </Tab.Navigator>
//   );
// }
const Tab = createBottomTabNavigator();
function Nav() {
  const [appReady, setAppReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState("");
  const [storedCart, setStoredCart] = useState([]);
  const [items, setItems] = useState([]);

  const checkLoginCredentials = () => {
    AsyncStorage
      .getItem('sialbertCredentials')
      .then((result) => {
        if (result !== null) {
          setStoredCredentials(JSON.parse(result));
        } else {
          setStoredCredentials(null);
        }
      })
      .catch(error => console.log(error))
  }

  const addItemToCart = (itemData, id, harga) => {
    AsyncStorage
      .getItem('cartCredentials')
      .then((alat) => {
        if (alat !== null) {
          const product = alat;
          setItems((prevItems, id, harga) => {
            const item = prevItems.find((item) => (item.id == id));
            if(!item) {
                return [...prevItems, {
                    id,
                    qty: 1,
                    product,
                    totalPrice: harga
                }];
            }
            else {
                return prevItems.map((item) => {
                    if(item.id == id) {
                    item.qty++;
                    item.totalPrice += harga;
                    }
                    return item;
                });
            }
          })
          setItemCount(items.reduce((sum, item) => (sum + item.qty), 0))
        } else {
          setItems(null);
        }
      })
      .catch(error => console.log(error))
  }

  if (!appReady) {
    return (
      <AppLoading
        startAsync={checkLoginCredentials}
        onFinish={() => setAppReady(true)}
        onError={console.warn}
      />
    )
  }
  return (
    <>
    <StatusBar hidden/>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({focused, color, size}) => {
          let activeIcon, iconStyle;

          if (route.name === 'Home') {
            activeIcon = focused
            ? require("./assets/image/home-active.png")
            : require("./assets/image/home-inactive.png")
          } else if (route.name === 'Penyewaan') {
            activeIcon = focused
            ? require("./assets/image/rent-active.png")
            : require("./assets/image/rent-inactive.png")
          } else if (route.name === 'Reschedule') {
            activeIcon = focused
            ? require("./assets/image/reschedule-active.png")
            : require("./assets/image/reschedule-inactive.png")
          } else if (route.name === 'Pembatalan') {
            activeIcon = focused
            ? require("./assets/image/cancel-active.png")
            : require("./assets/image/cancel-inactive.png")
          } else if (route.name === 'Setting') {
            activeIcon = focused
            ? require("./assets/image/setting-active.png")
            : require("./assets/image/setting-inactive.png")
          }
          return <Image style = {{ height: 32, width: 32 }}
            source={activeIcon}
            // style={iconStyle}
          />;
        },
        backgroundColor: 'tomato',
        tabBarActiveTintColor: '#FBCB33',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name='Home' component={MenuUtama} options={{ headerShown: false }}/>
      <Tab.Screen name='Penyewaan' component={Penyewaan} options={{ headerShown: false }}/>
      <Tab.Screen name='Reschedule' component={Reschedule} options={{ headerShown: false }} screenOptions={{unmountOnBlur: true}}/>
      <Tab.Screen name='Pembatalan' component={Pembatalan} options={{ headerShown: false }} screenOptions={{unmountOnBlur: true}}/>
      <Tab.Screen name='Setting' component={Setting} options={{ headerShown: false }}/>
      {/* <Tab.Screen
        name='Setting'
        component={Setting}
        options={{
          headerRight: () => (
            <Button
              onPress={ () => alert ('This is a button!') }
              title="info"
              color='#fff'
            />
          ),
        }}
      /> */}
    </Tab.Navigator>
    </>
  );
}

export default function App({navigation}) {
  const [appReady, setAppReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState("");
  const [storedCart, setStoredCart] = useState([]);
  const [items, setItems] = useState([]);

  const checkLoginCredentials = () => {
    AsyncStorage
      .getItem('sialbertCredentials')
      .then((result) => {
        if (result !== null) {
          setStoredCredentials(JSON.parse(result));
        } else {
          setStoredCredentials(null);
        }
      })
      .catch(error => console.log(error))
  }
  const addItemToCart = (id, harga) => {
    AsyncStorage
      .getItem('cartCredentials')
      .then((alat) => {
        if (alat !== null) {
          const product = alat;
          setItems((prevItems, id, harga) => {
            const item = prevItems.find((item) => (item.id == id));
            if(!item) {
                return [...prevItems, {
                    id,
                    qty: 1,
                    product,
                    totalPrice: harga
                }];
            }
            else {
                return prevItems.map((item) => {
                    if(item.id == id) {
                    item.qty++;
                    item.totalPrice += harga;
                    }
                    return item;
                });
            }
          })
          setItemCount(items.reduce((sum, item) => (sum + item.qty), 0))
        } else {
          setItems(null);
        }
      })
      .catch(error => console.log(error))
  }

  if (!appReady) {
    return (
      <AppLoading
        startAsync={checkLoginCredentials}
        onFinish={() => setAppReady(true)}
        onError={console.warn}
      />
    )
  }


  return (
    <>
    <CredentialsContext.Provider value={{ storedCredentials, setStoredCredentials }}>
      <CartContext.Provider value={{ items, setItems }}>
        <CredentialsContext.Consumer>
          {({storedCredentials}) => (
          <>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Nav">
                {storedCredentials ? (
                <>
                  {/* <Stack.Screen
                  name="EditProfil"
                  component={EditProfil}
                  options={{ headerShown: false }}
                  /> */}
                  <Stack.Screen
                  name="Nav"
                  component={Nav}
                  options={{ headerShown: false }}
                  />
                  <Stack.Screen
                  name="Edit Profil"
                  component={EditProfil}
                  options={{ headerShown: true }}
                  />
                  <Stack.Screen
                  name="MenuUtama"
                  component={MenuUtama}
                  options={{ headerShown: false }}
                  />
                  <Stack.Screen
                  name="Detail"
                  component={Detail}
                  options={{ headerShown: true, headerBackTitleVisible: false,
                  }}
                  />
                  <Stack.Screen
                  name="Alat"
                  component={Alat}
                  options={{ headerShown: false }}
                  />
                  <Stack.Screen
                  name="Cart"
                  component={Cart}
                  options={{ headerShown: false }}
                  />
                  <Stack.Screen
                  name="Persyaratan dan Prosedur Sewa"
                  component={sk}
                  options={{ headerShown: true }}
                  />
                  <Stack.Screen
                  name="Detail Order"
                  component={DetailOrder}
                  options={{ headerShown: true }}
                  />
                  <Stack.Screen
                  name="Detail Pembatalan"
                  component={DetailPembatalan}
                  options={{ headerShown: true }}
                  />
                  <Stack.Screen
                  name="Pembayaran"
                  component={FormPembayaran}
                  options={{ headerShown: true }}
                  />
                  <Stack.Screen
                  name="SKR"
                  component={skr}
                  options={{ headerShown: true }}
                  />
                  <Stack.Screen
                  name="Pengajuan Perubahan Jadwal"
                  component={FormReschedule}
                  options={{ headerShown: true }}
                  />
                  <Stack.Screen
                  name="pdfFormulirOrder"
                  component={PdfFormulirOrder}
                  options={{ headerShown: false }}
                  />
                  <Stack.Screen
                  name="Pengajuan Pembatalan"
                  component={FormRefund}
                  options={{ headerShown: true }}
                  />
                  <Stack.Screen
                  name="Formulir Order Step 1"
                  component={FormulirOrder}
                  options={{ headerShown: false }}
                  />
                  <Stack.Screen
                  name="Formulir Order Step 2"
                  component={FormSecondStep}
                  options={{ headerShown: false }}
                  />
                    <Stack.Screen
                  name="Detail Refund"
                  component={DetailRefund}
                  options={{ headerShown: true }}
                  />
                  <Stack.Screen
                  name="Detail Reschedule"
                  component={DetailReschedule}
                  options={{ headerShown: true }}
                  />
                </>
                ) : (
                <>
                    <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }}
                    />
                    <Stack.Screen
                    name="Register"
                    component={Register}
                    options={{ headerShown: false }}
                    />
                    <Stack.Screen
                    name="Edit Profil"
                    component={EditProfil}
                    options={{ headerShown: false }}
                    />
                    <Stack.Screen
                    name="Register2"
                    component={Register2}
                    options={{ headerShown: false }}
                    />
                </>
                )}
                </Stack.Navigator>
            </NavigationContainer>
            <StatusBar hidden />
          </>
          )}
        </CredentialsContext.Consumer>
      </CartContext.Provider>
    </CredentialsContext.Provider>
    {/* <NavigationContainer>
        <FloatingTabBar/>
    </NavigationContainer> */}
    </>
  );
}
