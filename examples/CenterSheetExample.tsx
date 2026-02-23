import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {hideSheet} from '../helpers';

/**
 * Sample sheet component with content positioned at CENTER.
 * Use this pattern for dialogs, confirmations, or centered popups.
 */
const CenterSheetExample = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Center Sheet</Text>
        <Text style={styles.subtitle}>Content at center</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
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

export default CenterSheetExample;
