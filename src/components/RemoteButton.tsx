import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';

type RemoteButtonProps = {
  label: string;
  image?: ImageSourcePropType;
  onPress: () => void;
  disabled?: boolean;
  onLongPress?: () => void;
  delayLongPress?: number;
  variant?: 'primary' | 'secondary' | 'compact' | 'primaryCompact' | 'plain';
};

export function RemoteButton({
  label,
  image,
  onPress,
  disabled,
  onLongPress,
  delayLongPress,
  variant = 'secondary',
}: RemoteButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        styles.button,
        variant === 'primary' && styles.primaryButton,
        variant === 'secondary' && styles.secondaryButton,
        variant === 'compact' && styles.compactButton,
        variant === 'primaryCompact' && styles.primaryCompactButton,
        variant === 'plain' && styles.plainButton,
        disabled && styles.buttonDisabled,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={delayLongPress}
      disabled={disabled}
    >
      {image && (
        <View
          style={[
            styles.photoFrame,
            (variant === 'compact' || variant === 'primaryCompact') && styles.compactPhotoFrame,
          ]}
        >
          <Image source={image} resizeMode="cover" style={styles.photo} />
        </View>
      )}
      <Text
        style={[styles.buttonText, variant === 'plain' && styles.plainButtonText]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 118,
    minHeight: 102,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#166534',
  },
  secondaryButton: {
    backgroundColor: '#334155',
  },
  compactButton: {
    minWidth: 56,
    minHeight: 68,
    paddingHorizontal: 6,
    paddingVertical: 6,
    backgroundColor: '#334155',
  },
  primaryCompactButton: {
    minWidth: 56,
    minHeight: 68,
    paddingHorizontal: 6,
    paddingVertical: 6,
    backgroundColor: '#166534',
  },
  plainButton: {
    minWidth: 88,
    minHeight: 42,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(15,23,42,0.72)',
  },
  photoFrame: {
    width: 58,
    height: 58,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#0f172a',
  },
  compactPhotoFrame: {
    width: 34,
    height: 34,
    borderRadius: 7,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0,
    textAlign: 'center',
    maxWidth: 128,
  },
  plainButtonText: {
    fontSize: 14,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
});
