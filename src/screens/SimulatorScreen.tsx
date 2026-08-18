import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { RemoteButton } from '../components/RemoteButton';
import { TimerDisplay } from '../components/TimerDisplay';
import {
  CHRONO_DESCRIPTIONS,
  CHRONO_LABELS,
  CHRONO_THEME,
  CONTROL_IMAGES,
} from '../domain/chronos';
import type { ChronoMode } from '../types';
import { triggerHaptic } from '../utils/haptics';
import { adjustCorrectionTime, adjustModeBSecondaryTime, REVERT_SET_WINDOW_MS } from '../utils/time';

type SimulatorScreenProps = {
  initialMode: ChronoMode;
  onBack: () => void;
};

export function SimulatorScreen({ initialMode, onBack }: SimulatorScreenProps) {
  const mode = initialMode;
  const theme = CHRONO_THEME[mode];
  const [timeMs, setTimeMs] = useState(24 * 1000);
  const [isRunning, setIsRunning] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isCorrectionMode, setIsCorrectionMode] = useState(false);
  const [isModeBCorrection, setIsModeBCorrection] = useState(false);
  const [secondaryTimeMs, setSecondaryTimeMs] = useState(24 * 1000);

  const endTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const playBuzzerRef = useRef<() => void>(() => {});
  const revertTimeMsRef = useRef<number | null>(null);
  const revertSetAtRef = useRef<number | null>(null);
  const stoppedMemoryMsRef = useRef<number | null>(null);
  const activeStoppedPresetRef = useRef<14 | 24 | null>(null);
  const runningMemoryMsRef = useRef<number | null>(null);
  const activeRunningPresetRef = useRef<14 | 24 | null>(null);
  const runningSetAtRef = useRef<number | null>(null);
  const modeBLongPressHandledRef = useRef(false);
  const isHiddenRef = useRef(isHidden);

  isHiddenRef.current = isHidden;

  const buzzerPlayer = useAudioPlayer(require('../../assets/audio/shot-clock-buzzer.wav'));

  const clearSetRevert = useCallback(() => {
    revertTimeMsRef.current = null;
    revertSetAtRef.current = null;
  }, []);

  const clearModeBStoppedPreset = useCallback(() => {
    stoppedMemoryMsRef.current = null;
    activeStoppedPresetRef.current = null;
  }, []);

  const clearModeBRunningPreset = useCallback(() => {
    runningMemoryMsRef.current = null;
    activeRunningPresetRef.current = null;
    runningSetAtRef.current = null;
  }, []);

  const canRevertSet = useCallback(() => {
    if (revertTimeMsRef.current === null || revertSetAtRef.current === null) {
      return false;
    }

    return Date.now() - revertSetAtRef.current < REVERT_SET_WINDOW_MS;
  }, []);

  const playBuzzer = useCallback(() => {
    if (mode === 'A' && isHiddenRef.current) {
      return;
    }

    void (async () => {
      await buzzerPlayer.seekTo(0);
      buzzerPlayer.play();
    })();
  }, [buzzerPlayer, mode]);

  const stopBuzzer = useCallback(() => {
    buzzerPlayer.pause();
    void buzzerPlayer.seekTo(0);
  }, [buzzerPlayer]);

  const stopTimer = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsRunning(false);
  }, []);

  useEffect(() => {
    playBuzzerRef.current = playBuzzer;
  }, [playBuzzer]);

  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'mixWithOthers',
      allowsRecording: false,
    });
  }, []);

  useEffect(() => {
    if (!isRunning || timeMs <= 0) {
      return;
    }

    endTimeRef.current = Date.now() + timeMs;

    const tick = () => {
      const remaining = Math.max(0, (endTimeRef.current ?? Date.now()) - Date.now());
      setTimeMs(remaining);

      if (remaining > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setIsRunning(false);
        rafRef.current = null;
        playBuzzerRef.current();
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
      setIsCorrectionMode(false);
    } else {
      clearSetRevert();
    }

    clearModeBStoppedPreset();
    clearModeBRunningPreset();
  }, [isRunning, clearSetRevert, clearModeBStoppedPreset, clearModeBRunningPreset]);

  const handleBack = () => {
    triggerHaptic();
    stopTimer();
    stopBuzzer();
    onBack();
  };

  const handleStartStop = () => {
    triggerHaptic();

    if (isRunning) {
      stopTimer();
      return;
    }

    if (timeMs > 0) {
      if (mode === 'B' || mode === 'C') {
        setIsHidden(false);
      }
      setIsRunning(true);
    }
  };

  const setTime = (seconds: 14 | 24) => {
    triggerHaptic();

    if (mode === 'B' && isRunning) {
      stopBuzzer();

      const withinWindow =
        runningSetAtRef.current !== null &&
        Date.now() - runningSetAtRef.current < REVERT_SET_WINDOW_MS;

      if (activeRunningPresetRef.current === seconds && withinWindow) {
        const revertMs = runningMemoryMsRef.current ?? timeMs;
        activeRunningPresetRef.current = null;
        runningSetAtRef.current = null;
        setTimeMs(revertMs);
        endTimeRef.current = Date.now() + revertMs;
        return;
      }

      if (!withinWindow || runningMemoryMsRef.current === null) {
        runningMemoryMsRef.current = timeMs;
      }
      activeRunningPresetRef.current = seconds;
      runningSetAtRef.current = Date.now();
      const newTimeMs = seconds * 1000;
      setTimeMs(newTimeMs);
      endTimeRef.current = Date.now() + newTimeMs;
      return;
    }

    if (mode === 'B' && !isRunning) {
      if (activeStoppedPresetRef.current === seconds) {
        setTimeMs(stoppedMemoryMsRef.current ?? timeMs);
        activeStoppedPresetRef.current = null;
      } else {
        if (stoppedMemoryMsRef.current === null) {
          stoppedMemoryMsRef.current = timeMs;
        }
        activeStoppedPresetRef.current = seconds;
        setTimeMs(seconds * 1000);
      }
      stopBuzzer();
      return;
    }

    if (mode === 'A' && isRunning) {
      revertTimeMsRef.current = timeMs;
      revertSetAtRef.current = Date.now();
    } else if (mode === 'A') {
      clearSetRevert();
    }

    const newTimeMs = seconds * 1000;
    setTimeMs(newTimeMs);
    if (isRunning) {
      endTimeRef.current = Date.now() + newTimeMs;
    }
    if (mode === 'A' || mode === 'C') {
      setIsHidden(false);
    }
    if (mode === 'B' || mode === 'C') {
      stopBuzzer();
    }
  };

  const handleModeCReset = () => {
    triggerHaptic();
    stopBuzzer();

    if (isHidden) {
      setIsHidden(false);
      return;
    }

    stopTimer();
    setIsHidden(true);
    setTimeMs(24 * 1000);
  };

  const handleHide = () => {
    triggerHaptic();

    if (mode === 'B') {
      if (isHidden && !isRunning) {
        setIsHidden(false);
        return;
      }

      stopTimer();
      setIsHidden(true);
      return;
    }

    if (mode === 'A' && isRunning && canRevertSet()) {
      const revertMs = revertTimeMsRef.current ?? timeMs;
      clearSetRevert();
      setTimeMs(revertMs);
      endTimeRef.current = Date.now() + revertMs;
      return;
    }

    clearSetRevert();
    setIsHidden((hidden) => !hidden);
  };

  const handleStopSound = () => {
    triggerHaptic();
    stopBuzzer();
  };

  const adjustTimeByCorrectionStep = (direction: -1 | 1) => {
    const newTimeMs = adjustCorrectionTime(timeMs, direction);
    setTimeMs(newTimeMs);
    if (isRunning) {
      endTimeRef.current = Date.now() + newTimeMs;
    }
  };

  const handleModeBEnterCorrection = () => {
    if (mode !== 'B' || isRunning) {
      return;
    }
    triggerHaptic();
    setSecondaryTimeMs(timeMs);
    setIsModeBCorrection(true);
  };

  const handleModeBCorrectionOk = () => {
    triggerHaptic();
    setTimeMs(secondaryTimeMs);
    setIsModeBCorrection(false);
  };

  const handleModeBSecondaryMinus = () => {
    if (!isModeBCorrection) {
      return;
    }
    triggerHaptic();
    setSecondaryTimeMs((current) => adjustModeBSecondaryTime(current, -1));
  };

  const handleModeBSecondaryPlus = () => {
    if (!isModeBCorrection) {
      return;
    }
    triggerHaptic();
    setSecondaryTimeMs((current) => adjustModeBSecondaryTime(current, 1));
  };

  const handleAdjustMinus = () => {
    if (!isCorrectionMode || isRunning) {
      return;
    }
    triggerHaptic();
    adjustTimeByCorrectionStep(-1);
  };

  const handleAdjustCenter = () => {
    if (isRunning) {
      return;
    }
    triggerHaptic();
    setIsCorrectionMode((active) => !active);
  };

  const handleAdjustPlus = () => {
    if (!isCorrectionMode || isRunning) {
      return;
    }
    triggerHaptic();
    adjustTimeByCorrectionStep(1);
  };

  const hideButtonLabel =
    mode === 'B'
      ? isHidden && !isRunning
        ? 'Afficher'
        : 'Masquer + stop'
      : isHidden
        ? 'Afficher'
        : 'Masquer';

  const startStopButton = (
    <RemoteButton
      label={isRunning ? 'Stop' : 'Start'}
      image={
        mode === 'A'
          ? CONTROL_IMAGES.bodetStart
          : mode === 'B'
            ? CONTROL_IMAGES.stramatelStart
            : CONTROL_IMAGES.grunenwaldStart
      }
      onPress={handleStartStop}
      disabled={timeMs === 0 && !isRunning}
      variant="primary"
    />
  );

  const hideButton = (
    <RemoteButton
      label={hideButtonLabel}
      image={mode === 'A' ? CONTROL_IMAGES.bodetHide : CONTROL_IMAGES.stramatelHide}
      onPress={handleHide}
    />
  );

  const stopSoundButton = (
    <RemoteButton label="Klaxon" image={CONTROL_IMAGES.bodetSound} onPress={handleStopSound} />
  );

  const set14Button = (
    <RemoteButton
      label="14 s"
      image={
        mode === 'A'
          ? CONTROL_IMAGES.bodet14
          : mode === 'B'
            ? CONTROL_IMAGES.stramatel14
            : CONTROL_IMAGES.grunenwald14
      }
      onPress={() => setTime(14)}
    />
  );

  const set24Button = (
    <RemoteButton
      label="24 s"
      image={
        mode === 'A'
          ? CONTROL_IMAGES.bodet24
          : mode === 'B'
            ? CONTROL_IMAGES.stramatel24
            : CONTROL_IMAGES.grunenwald24
      }
      onPress={() => {
        if (modeBLongPressHandledRef.current) {
          modeBLongPressHandledRef.current = false;
          return;
        }
        setTime(24);
      }}
      onLongPress={() => {
        if (mode === 'B' && !isRunning) {
          modeBLongPressHandledRef.current = true;
          handleModeBEnterCorrection();
        }
      }}
      delayLongPress={500}
    />
  );

  const modeCResetButton = (
    <RemoteButton
      label={isHidden ? 'Afficher' : 'Masquer + RAZ'}
      image={CONTROL_IMAGES.grunenwaldReset}
      onPress={handleModeCReset}
    />
  );

  const modeAAdjustButtons = (
    <View style={styles.adjustButtonRow}>
      <RemoteButton
        label="-"
        image={CONTROL_IMAGES.bodetCorrectionMinus}
        onPress={handleAdjustMinus}
        variant="compact"
      />
      <RemoteButton
        label="C"
        image={CONTROL_IMAGES.bodetCorrectionOk}
        onPress={handleAdjustCenter}
        variant={isCorrectionMode && !isRunning ? 'primaryCompact' : 'compact'}
      />
      <RemoteButton
        label="+"
        image={CONTROL_IMAGES.bodetCorrectionPlus}
        onPress={handleAdjustPlus}
        variant="compact"
      />
    </View>
  );

  const modeBSecondaryDisplayMs = isModeBCorrection ? secondaryTimeMs : timeMs;

  return (
    <View style={[styles.container, { backgroundColor: theme.panel }]}>
      <Pressable style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>Retour</Text>
      </Pressable>

      <View style={styles.mainContent}>
        <View style={styles.brandHeader}>
          <Text style={styles.brandTitle}>{CHRONO_LABELS[mode]}</Text>
          <Text style={styles.brandSubtitle}>{CHRONO_DESCRIPTIONS[mode]}</Text>
        </View>

        {mode === 'A' && (
          <>
            <View style={[styles.timerRow, { backgroundColor: theme.surface }]}>
              <View style={[styles.timerRowSide, styles.timerRowSideLeft]}>{stopSoundButton}</View>
              <View style={styles.timerRowCenter}>
                <TimerDisplay timeMs={timeMs} isRunning={isRunning} isHidden={isHidden} />
                {modeAAdjustButtons}
              </View>
              <View style={[styles.timerRowSide, styles.timerRowSideRight]}>{hideButton}</View>
            </View>

            <View style={[styles.buttonRow, styles.buttonRowSpread]}>
              {startStopButton}
              {set14Button}
              {set24Button}
            </View>
          </>
        )}

        {mode === 'B' && (
          <View style={[styles.modeBLayout, { backgroundColor: theme.surface }]}>
            <View style={styles.modeBTimerStack}>
              <View style={styles.timerRowSingleCompact}>
                <TimerDisplay timeMs={timeMs} isRunning={isRunning} isHidden={isHidden} />
              </View>
              <View style={styles.modeBSecondaryRow}>
                {isModeBCorrection && (
                  <View style={styles.modeBCorrectionControls}>
                    <Pressable style={styles.correctionChip} onPress={handleModeBCorrectionOk}>
                      <Text style={styles.correctionChipText}>OK</Text>
                    </Pressable>
                    <Pressable style={styles.correctionChip} onPress={handleModeBSecondaryMinus}>
                      <Text style={styles.correctionChipText}>-</Text>
                    </Pressable>
                    <Pressable style={styles.correctionChip} onPress={handleModeBSecondaryPlus}>
                      <Text style={styles.correctionChipText}>+</Text>
                    </Pressable>
                  </View>
                )}
                <TimerDisplay
                  timeMs={modeBSecondaryDisplayMs}
                  isRunning={isRunning}
                  isHidden={false}
                  size="small"
                />
              </View>
            </View>

            <View style={[styles.buttonRow, styles.buttonRowModeB]}>
              {startStopButton}
              {hideButton}
              {set14Button}
              {set24Button}
            </View>
          </View>
        )}

        {mode === 'C' && (
          <>
            <View style={[styles.timerRowSingle, { backgroundColor: theme.surface }]}>
              <Image
                source={CONTROL_IMAGES.grunenwaldCorrection}
                resizeMode="cover"
                style={styles.modeCDisplayAccent}
              />
              <TimerDisplay timeMs={timeMs} isRunning={isRunning} isHidden={isHidden} />
            </View>

            <View style={styles.modeCGrid}>
              <View style={styles.modeCGridRow}>
                {set24Button}
                {modeCResetButton}
              </View>
              <View style={styles.modeCGridRow}>
                {startStopButton}
                {set14Button}
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
    minHeight: 42,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: 'rgba(15,23,42,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  brandHeader: {
    alignItems: 'center',
    gap: 2,
  },
  brandTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0,
  },
  brandSubtitle: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    minHeight: 148,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  timerRowSide: {
    flex: 1,
  },
  timerRowSideLeft: {
    alignItems: 'flex-start',
  },
  timerRowSideRight: {
    alignItems: 'flex-end',
  },
  timerRowCenter: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  timerRowSingle: {
    width: '100%',
    minHeight: 148,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modeBLayout: {
    width: '100%',
    alignItems: 'center',
    gap: 18,
    borderRadius: 10,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modeBTimerStack: {
    alignItems: 'center',
    gap: 6,
  },
  timerRowSingleCompact: {
    minHeight: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeBSecondaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modeBCorrectionControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  adjustButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  correctionChip: {
    backgroundColor: '#334155',
    height: 36,
    minWidth: 36,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  correctionChipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  buttonRowSpread: {
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    gap: 0,
  },
  buttonRowModeB: {
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 18,
  },
  modeCGrid: {
    gap: 12,
    alignItems: 'center',
  },
  modeCGridRow: {
    flexDirection: 'row',
    gap: 24,
  },
  modeCDisplayAccent: {
    position: 'absolute',
    left: 16,
    top: 16,
    width: 58,
    height: 58,
    borderRadius: 8,
    opacity: 0.32,
  },
});
