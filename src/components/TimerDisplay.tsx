import { StyleSheet, Text } from 'react-native';

import { formatTime } from '../utils/time';

type TimerDisplayProps = {
  timeMs: number;
  isRunning: boolean;
  isHidden: boolean;
  size?: 'large' | 'small';
};

export function TimerDisplay({ timeMs, isRunning, isHidden, size = 'large' }: TimerDisplayProps) {
  if (isHidden) {
    return <Text style={[styles.hidden, size === 'small' && styles.small]}>--</Text>;
  }

  return (
    <Text
      style={[
        styles.time,
        size === 'small' && styles.small,
        isRunning ? styles.running : styles.stopped,
      ]}
    >
      {formatTime(timeMs)}
    </Text>
  );
}

const styles = StyleSheet.create({
  time: {
    fontSize: 96,
    fontWeight: '200',
    fontVariant: ['tabular-nums'],
    letterSpacing: 0,
  },
  small: {
    fontSize: 40,
  },
  running: {
    color: '#22c55e',
  },
  stopped: {
    color: '#ef4444',
  },
  hidden: {
    color: '#475569',
    fontSize: 96,
    fontWeight: '200',
    fontVariant: ['tabular-nums'],
    letterSpacing: 0,
  },
});
