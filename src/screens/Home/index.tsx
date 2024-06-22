import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import database from '@react-native-firebase/database';

import Img1 from '../../assets/img1.png';
import Img2 from '../../assets/img2.png';

export function Home() {
  const [luminosidade, setLuminosidade] = useState<number>(0);
  const [umidade, setUmidade] = useState<number>(0);
  const [temperatura, setTemperatura] = useState<number>(0);

  useEffect(() => {
    const onLuminosidadeChange = database().ref('/Monitoramento/Luminosidade')
      .on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          const values = Object.values(data) as number[];
          const lastValue = values[0];
          setLuminosidade(lastValue);
        }
      });

    const onUmidadeChange = database().ref('/Monitoramento/Umidade')
      .on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          const values = Object.values(data) as number[];
          const lastValue = values[0];
          setUmidade(lastValue);
        }
      });
      
    const onTemperaturaChange = database().ref('/Monitoramento/Temperatura')
      .on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          const values = Object.values(data) as number[];
          const lastValue = values[0];
          setTemperatura(lastValue);
        }
      });

    return () => {
      database().ref('/Monitoramento/Luminosidade').off('value', onLuminosidadeChange)
      database().ref('/Monitoramento/Umidade').off('value', onUmidadeChange)
      database().ref('/Monitoramento/Temperatura').off('value', onTemperaturaChange)
    };
  }, []);

  return (
    <LinearGradient style={[styles.superContainer]} colors={['#1C8F09', '#177407', '#082903']}>
      <Text style={styles.supertitle}>Valores:</Text>

      <View style={styles.container}>
        <Text style={styles.title}>dht 11</Text>

        <View style={{ flexDirection: 'row', gap: 20 }}>
          <Image
            source={Img1}
            style={{ width: 110, height: 110 }}
            resizeMode='cover'
          />

          <View style={{ gap: 10, justifyContent: 'center' }}>
            <Text style={styles.value}>Umidade: {umidade}</Text>
            <Text style={styles.value}>Temperatura: {temperatura}</Text>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Idr</Text>

        <View style={{ flexDirection: 'row', gap: 20 }}>
          <Image
            source={Img2}
            style={{ width: 110, height: 110 }}
            resizeMode='cover'
          />

          <View style={{ gap: 10, justifyContent: 'center' }}>
            <Text style={styles.value}>
              Luminosidade: {luminosidade}
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  superContainer: {
    flex: 1,
    gap: 30,
    paddingVertical: 80,
    paddingHorizontal: 32
  },
  supertitle: {
    fontWeight: '600',
    fontSize: 20,
    color: 'white'
  },
  container: {
    gap: 5
  },
  title: {
    fontWeight: '600',
    fontSize: 20,
    color: 'white'
  },
  value: {
    fontSize: 18,
    color: 'white'
  }
})
