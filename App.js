import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import Header from './components/Header'
import Footer from './components/Footer'
import Stylesheet from './style/style'
import Gameboard from './components/Gameboard';


export default function App() {
  return (
    <View style={Stylesheet.container}>
      <Header />
      <Gameboard />
      <Footer />
    </View>
  );
}
