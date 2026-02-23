import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {hideSheet} from '../helpers';

/**
 * Sample sheet component with content positioned at BOTTOM (flex-end).
 * Use this pattern for action sheets, toasts, or bottom-anchored content.
 */
const BottomSheetExample = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Bottom Sheet</Text>
        <Text style={styles.subtitle}>Content at flex-end</Text>
        <TouchableOpacity onPress={() => hideSheet()}>
          <Text style={styles.button}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    // alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    padding: 44,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    minWidth: 280,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  button: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default BottomSheetExample;
