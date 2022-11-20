import React, {createContext, useState} from 'react';
import { useIsFocused } from '@react-navigation/native';
// import { getProduct } from './services/ProductsService.js';

export const CartContext = createContext();
export function CartProvider(props) {
    const [items, setItems] = useState([]);
    const [data, setData] = useState([]);
    const isFocused = useIsFocused();
    const {nama, email, no_hp, foto, kontak_darurat, alamat, id,token} = storedCredentials;
    useEffect(async() => {
        let isMounted = true
        setIsLoading(true);
        fetch(`http://e565-180-242-214-45.ngrok.io/api/equipments`,
        {
        method: "GET",
        headers: {
            //  'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+token,
        }})
        // fetch('http://e565-180-242-214-45.ngrok.io/api/equipments')
        .then((response) => response.json())
        .then((hasil) => {
            setData(hasil);
            setCari(hasil);
            setIsLoading(false);
        })
        // .finally(() => setLoading(false));
        .catch(error => { console.log; });

    const id_alat= data.id_alat
    const harga=data.harga_sewa_perhari
    const nama_alat=data.nama_alat
    }, [isFocused]);
    function addItemToCart(id_alat) {
        const product = id_alat;
        setItems((prevItems) => {
        const item = prevItems.find((item) => (item.id_alat == id_alat));
        if(!item) {
            return [...prevItems, {
                id_alat,
                qty: 1,
                product,
                totalPrice: product.harga
            }];
        }
        else {
            return prevItems.map((item) => {
                if(item.id_alat == id_alat) {
                item.qty++;
                item.totalPrice += product.harga;
                }
                return item;
            });
        }
        });
    }
    function getItemsCount() {
        return items.reduce((sum, item) => (sum + item.qty), 0);
    }

    function getTotalPrice() {
        return items.reduce((sum, item) => (sum + item.totalPrice), 0);
    }  

    return (
        <CartContext.Provider 
        value={{items, setItems, getItemsCount, addItemToCart, getTotalPrice}}>
        {props.children}
        </CartContext.Provider>
    );
}