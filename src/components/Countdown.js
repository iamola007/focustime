import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { fontSizes, spacing } from '../utils/sizes';
import { colors } from '../utils/colors';

// const minutesToMillis = (min) => min * 1000 * 60;
const minutesToMillis = (min) => (min || 0) * 1000 * 60;
const formatTime = (time) => (time < 10 ? `0${time}` : time);
export const Countdown = ({ minutes = 0.1, isPaused, onProgress, onEnd }) => {
  const interval = React.useRef(null);

  // const [millis, setMillis] = useState(null);

  const [millis, setMillis] = useState(minutesToMillis(minutes));

   const reset = () => setMillis(minutesToMillis(minutes))

  // const countDown = () => {
  //   setMillis((time) => {
  //     if (time === 0) {
  //       clearInterval(interval.current);
  //       onEnd();
  //       return time;
  //     }
  //     const timeLeft = time - 1000;
  //     return timeLeft;
  //   });
  // };

  const countDown = React.useCallback(() => {
    setMillis((time) => {
      if (time === 0) {
        clearInterval(interval.current);
        onEnd(reset);
        return time;
      }
      // const timeLeft = time - 1000;

      const timeLeft = Math.round(time - 1000); // Ensure `timeLeft` is an integer
      return timeLeft;
    });
  }, [onEnd]); // Add `onEnd` as a dependency if it's used inside `countDown`

  useEffect(() => {
    setMillis(minutesToMillis(minutes));
  }, [minutes]);

  // useEffect(() => {
  //   onProgress(millis / minutesToMillis(minutes));
  // }, [millis]);

  // useEffect(() => {
  //   if (millis !== null) {
  //     onProgress(Math.round((millis / minutesToMillis(minutes)) * 100) / 100);
  //   }
  // }, [millis, minutes, onProgress]);

  useEffect(() => {
  if (millis !== null) {
    const progress = millis / minutesToMillis(minutes);
    onProgress(Math.round(progress * 100) / 100); // Round to 2 decimal places
  }
}, [millis, minutes, onProgress]);

  useEffect(() => {
    if (isPaused) {
      if (interval.current) clearInterval(interval.current);
      return;
    }

    interval.current = setInterval(countDown, 1000);

    return () => clearInterval(interval.current);
  }, [isPaused, countDown]);

  // const minute = Math.floor(millis / 1000 / 60) % 60;
  // const seconds = Math.floor(millis / 1000) % 60;

  // const minute = millis !== null ? Math.floor(millis / 1000 / 60) % 60 : 0;
  // const seconds = millis !== null ? Math.floor(millis / 1000) % 60 : 0;

  const minute = millis !== null ? Math.round(millis / 1000 / 60) % 60 : 0;
  const seconds = millis !== null ? Math.round(millis / 1000) % 60 : 0;

  return (
    <Text style={styles.text}>
      {formatTime(minute)}:{formatTime(seconds)}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: fontSizes.xxxl,
    fontWeight: 'bold',
    color: colors.white,
    padding: spacing.lg,
    backgroundColor: 'rgba(94, 132, 226, 0.3)',
  },
});
