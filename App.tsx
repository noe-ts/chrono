import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { HomeScreen } from './src/screens/HomeScreen';
import { SimulatorScreen } from './src/screens/SimulatorScreen';
import type { ChronoMode } from './src/types';

export default function App() {
  const [selectedMode, setSelectedMode] = useState<ChronoMode | null>(null);

  useEffect(() => {
    void ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  }, []);

  return (
    <View style={styles.container}>
      {selectedMode === null ? (
        <HomeScreen onSelectMode={setSelectedMode} />
      ) : (
        <SimulatorScreen initialMode={selectedMode} onBack={() => setSelectedMode(null)} />
      )}
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
