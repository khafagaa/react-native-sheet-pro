import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 48,
  },
  toastWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  content: {
    // backgroundColor: 'rgba(0, 0, 0, 0.85)',
    backgroundColor: 'rgba(122, 122, 122, 0.85)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    maxWidth: '90%',
  },
  message: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default styles;
