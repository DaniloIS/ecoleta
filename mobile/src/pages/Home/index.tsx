import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Image, Text, TextInput, KeyboardAvoidingView, Platform, Picker } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';

import styles from './styles';

interface IBGEUFResponse {
  sigla: string
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('0');


  
  //const [uf, setUf] = useState('');
  //const [city, setCity] = useState('');
  const navigation = useNavigation();
  
  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
        const ufInitials = response.data.map(uf => uf.sigla);
        
        setUfs(ufInitials);
    });
  }, []);

  useEffect(() => {
    if(selectedUf === '0'){
        return;
    }
    
    axios
        .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
        .then(response => {
            const cityNames = response.data.map(city => city.nome);

            setCities(cityNames);
    });
  }, [selectedUf]);

  function handleNavigateToPoints() {
    const uf = selectedUf;
    const city = selectedCity;
    console.log(uf);
    navigation.navigate('Points', {
      uf,
      city
    });
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground 
        source={require('../../assets/home-background.png')} 
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.input}>
            <Picker
              selectedValue={selectedUf}
              style={{flex:1}}
              onValueChange={(itemValue, itemIndex) => setSelectedUf(itemValue)}
            >
              <Picker.Item label="Selecione um estado" value="" />
              {ufs.map(uf => (
                <Picker.Item key={uf} label={uf} value={uf} />
              ))}
            
            </Picker>
          </View>
          <View style={styles.input}>
            <Picker
              selectedValue={selectedCity}
              style={{flex:1}}
              onValueChange={(itemValue, itemIndex) => setSelectedCity(itemValue)}
            >
              <Picker.Item label="Selecione uma cidade" value="" />
              {cities.map(city => (
                <Picker.Item key={city} label={city} value={city} />
              ))}
            
            </Picker>
          </View>
          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default Home;