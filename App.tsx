import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SeekScrollSectionList } from './SeekScrollSectionList';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <SeekScrollSectionList />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 8
  },
});
