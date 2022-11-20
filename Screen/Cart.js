import React, { useState, useContext } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import { CartContext } from '../components/CartContext';
import { Card } from 'react-native-paper';
const win = Dimensions.get("window");
export default function Cart({navigation}) {
    const {items, setItems, itemCount, setItemCount} = useContext(CartContext);
    const [isSelected, setSelection] = useState(false);
    const [refreshing, setRefreshing] = useState(true);

    const deleteCart = (alat) => {
        console.log('tes')
        var index = items.id
        var total = items.reduce((sum, item) => (sum + item.qty), 0)
        items.splice(index, 1)
        setRefreshing(false);
        var newdata = items.concat();
        setItems(newdata);
    };

    function Totals() {
        let [total, setTotal] = useState(0);
        return (
        <View style={styles.cartLineTotal}>
            <Text style={[styles.lineLeft, styles.lineTotal]}>Total</Text>
            <Text style={styles.lineRight}>$ {items.reduce((sum, item) => (sum + item.totalPrice), 0)}</Text>
        </View>
        );
    }

    return (
        <ScrollView keyboardShouldPersistTaps='handled' style={{backgroundColor:'#fff'}}>
            {refreshing ? <ActivityIndicator /> : null}
            <View style={{ height: 48, textAlignVertical: 'center', backgroundColor: '#ffcd04', borderTopLeftRadius:15, borderTopRightRadius:15, margin: 16}}>
              <Text style={{ marginLeft:16, marginTop:14, textAlignVertical: 'center', fontWeight:'bold', color: '#ffffff' }}>Keranjang Anda</Text>
            </View>
            {items.length <= 0 &&
                <View style={{ margin: 16 }}>
                  <View style={{  alignItems:'center' }}>
                    <Text>Keranjang Anda masih kosong</Text>
                  </View>
                  <TouchableOpacity onPress={() => navigation.navigate('Alat')} style={{ margin: 16 }}>
                      <View style={styles.btn}>
                        <Text style={styles.buttonTitle}>Tambahkan Alat</Text>
                      </View>
                  </TouchableOpacity>
                </View>
            }
            {items.length > 0 &&
              <View style={{ margin: 16 }}>
                {items.map((item, i) =>
                  <View style={{ padding: 16, alignItems:'center', flexDirection:'row' }} key={i} idx={i}>
                    {(() => {
                      const photo ='https://sialbert.000webhostapp.com/' +item.product.foto + '/' +item.product.foto
                      console.log(photo)
                      return(
                        <Card style={styles.card}>
                            <View style={{ flexDirection:'row', justifyContent: 'space-between' }}>
                                <View style={{ borderRightWidth:2, borderRightColor:'#2196F3', width: '75%' }}>
                                    <View style={{ padding: 12 }}>
                                        <Image source={{ uri: photo }} style={{ width:75, height:75, marginRight:8, borderRadius: 20, borderWidth:1 }} />
                                        <Text style={{ fontWeight:'100', marginBottom:4}}>{item.product.nama}</Text>
                                        <Text>Harga sewa perhari:</Text>
                                        {/* <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop:8 }}>Rp.{(item.product.harga_sewa_perhari).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')},-</Text> */}
                                        <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop:8 }}>Rp.{(item.product.harga_sewa_perhari)},-</Text>
                                        <Text style={{ marginTop: 4 }}>Harga sewa perjam:</Text>
                                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Rp.{(item.product.harga_sewa_perjam)},-</Text>
                                        {/* <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Rp.{(item.product.harga_sewa_perjam).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')},-</Text> */}
                                    </View>
                                </View>
                                <View style={styles.center}>
                                    <TouchableOpacity onPress={deleteCart}>
                                        <View style={styles.btn}>
                                            <Text style={styles.buttonTitle}>Hapus</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                {/* <Text style={styles.lineLeft}>{item.product.nama} x {item.qty}</Text>
                                <Text style={styles.lineRight}>$ {item.totalPrice}</Text> */}
                            </View>
                        </Card>
                      )
                    })()}
                  </View>
                )}
                <TouchableOpacity onPress={() => navigation.navigate('Persyaratan dan Prosedur Sewa')} style={{ margin: 16 }}>
                  <View style={styles.btn}>
                      <Text style={styles.buttonTitle}>LANJUTKAN</Text>
                  </View>
                </TouchableOpacity>
              </View>
            }
        </ScrollView>
    );
}
const styles = StyleSheet.create({
  cartLine: {
    flexDirection: 'row',
  },
  cartLineTotal: {
    flexDirection: 'row',
    borderTopColor: '#dddddd',
    borderTopWidth: 1
  },
  lineTotal: {
    fontWeight: 'bold',
  },
  lineLeft: {
    fontSize: 20,
    lineHeight: 40,
    color:'#333333'
  },
  lineRight: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 40,
    color:'#333333',
    textAlign:'right',
  },
  itemsList: {
    backgroundColor: '#eeeeee',
  },
  itemsListContainer: {
    backgroundColor: '#eeeeee',
    paddingVertical: 8,
    marginHorizontal: 8,
  },
  center: {
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
    height: '100%',
    borderColor:'#2196F3',
    borderWidth:2,
  },
  border2: {
    backgroundColor: "#C4C4C4",
    height: 2,
  },
  btn: {
    backgroundColor: '#25185A',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    textAlign: 'center',
    padding:8,
  },
  buttonTitle: {
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 0,
    color: '#fff',
    fontWeight: '600',
    lineHeight: 22,
  },
});