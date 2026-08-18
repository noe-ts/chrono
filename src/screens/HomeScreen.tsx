import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  CHRONO_LABELS,
  CHRONO_MODES,
  CHRONO_THEME,
  HOME_IMAGES,
} from '../domain/chronos';
import type { ChronoMode } from '../types';

type HomeScreenProps = {
  onSelectMode: (mode: ChronoMode) => void;
};

export function HomeScreen({ onSelectMode }: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chrono Basket</Text>
        <Text style={styles.subtitle}>Choisis le pupitre de chronometre des tirs a travailler.</Text>
      </View>

      <ScrollView
        horizontal
        contentContainerStyle={styles.cardRow}
        showsHorizontalScrollIndicator={false}
      >
        {CHRONO_MODES.map((mode) => {
          const theme = CHRONO_THEME[mode];

          return (
            <Pressable
              key={mode}
              accessibilityRole="button"
              accessibilityLabel={`Choisir ${CHRONO_LABELS[mode]}`}
              style={[styles.card, { backgroundColor: theme.surface }]}
              onPress={() => onSelectMode(mode)}
            >
              <View style={[styles.photoFrame, { backgroundColor: theme.panel }]}>
                <Image source={HOME_IMAGES[mode]} resizeMode="cover" style={styles.photo} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{CHRONO_LABELS[mode]}</Text>
              </View>
              <View style={[styles.launchBadge, { backgroundColor: theme.accent }]}>
                <Text style={[styles.launchText, { color: theme.textOnAccent }]}>Entrainement</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 28,
    justifyContent: 'center',
    gap: 24,
  },
  header: {
    alignItems: 'center',
    gap: 6,
  },
  title: {
    color: '#f8fafc',
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0,
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0,
    textAlign: 'center',
  },
  cardRow: {
    gap: 16,
    alignItems: 'stretch',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  card: {
    width: 236,
    minHeight: 222,
    borderRadius: 8,
    padding: 14,
    gap: 12,
  },
  photoFrame: {
    width: 96,
    height: 96,
    borderRadius: 8,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  cardBody: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0,
    textAlign: 'center',
  },
  launchBadge: {
    minHeight: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  launchText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
  },
});
