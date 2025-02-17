// import React from 'react';
// import { render, fireEvent, waitFor } from '@testing-library/react-native';
// import LoginScreen from '../login';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import apiClient from '../../config/axios';
// import { useRouter } from 'expo-router';

// jest.mock('@react-native-async-storage/async-storage', () => ({
//   setItem: jest.fn(),
//   getItem: jest.fn(),
// }));

// jest.mock('expo-router', () => ({
//   useRouter: jest.fn(() => ({ replace: jest.fn() })),
// }));

// jest.mock('../../config/axios', () => ({
//   get: jest.fn(),
// }));

// describe('LoginScreen', () => {
//   it('renders correctly', () => {
//     const { getByPlaceholderText, getByText } = render(<LoginScreen />);
//     expect(getByPlaceholderText('Enter Authentication Key')).toBeTruthy();
//     expect(getByText('Login')).toBeTruthy();
//   });

//   it('updates authentication key input', () => {
//     const { getByPlaceholderText } = render(<LoginScreen />);
//     const input = getByPlaceholderText('Enter Authentication Key');
//     fireEvent.changeText(input, 'testKey');
//     expect(input.props.value).toBe('testKey');
//   });

//   it('toggles password visibility', () => {
//     const { getByTestId, getByPlaceholderText } = render(<LoginScreen />);
//     const eyeIcon = getByTestId('eye-icon');
//     const input = getByPlaceholderText('Enter Authentication Key');
    
//     expect(input.props.secureTextEntry).toBe(true);
//     fireEvent.press(eyeIcon);
//     expect(input.props.secureTextEntry).toBe(false);
//   });

//   it('disables login button when input is empty', () => {
//     const { getByText } = render(<LoginScreen />);
//     const loginButton = getByText('Login');
//     expect(loginButton.props.accessibilityState.disabled).toBe(true);
//   });

//   it('calls handleLogin on button press', async () => {
//     apiClient.get.mockResolvedValue({ data: [{ secretKey: 'testKey' }] });
//     const { getByText, getByPlaceholderText } = render(<LoginScreen />);
//     const input = getByPlaceholderText('Enter Authentication Key');
//     const loginButton = getByText('Login');
    
//     fireEvent.changeText(input, 'testKey');
//     fireEvent.press(loginButton);

//     await waitFor(() => {
//       expect(apiClient.get).toHaveBeenCalledWith('warehousemans');
//       expect(AsyncStorage.setItem).toHaveBeenCalledWith('isLoggedIn', 'true');
//       expect(useRouter().replace).toHaveBeenCalledWith('/(tabs)');
//     });
//   });
// });
