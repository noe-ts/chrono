import * as Haptics from 'expo-haptics';

export function triggerHaptic() {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}
