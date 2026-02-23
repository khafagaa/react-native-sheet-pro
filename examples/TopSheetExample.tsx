import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {hideSheet} from '../helpers';

/**
 * Sample sheet component with content positioned at TOP (flex-start).
 * Use this pattern when you want sheet content to appear at the top of the modal.
 */
const TopSheetExample = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Top Sheet</Text>
        <Text style={styles.subtitle}>Content at flex-start</Text>
        <TouchableOpacity onPress={() => hideSheet()}>
          <Text style={styles.button}>Close</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 48,
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

export default TopSheetExample;
