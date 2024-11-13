import { useState, useContext } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LOGIN } from "../queries";
import * as SecureStore from "expo-secure-store"
import { useMutation } from "@apollo/client";
import { LoginContext } from "../context/LoginContext";

const LoginScreen = ({ navigation }) => {
  const { setIsLoggedIn } = useContext(LoginContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loginMutation, { loading, error, data }] = useMutation(LOGIN, {
    onCompleted: async (res) => {
      let access_token = null;

      if (res && res.login && res.login.access_token) {
        access_token = res.login.access_token;
      }

      await SecureStore.setItemAsync("access_token", access_token);

      let userId = null;

      if (res && res.login && res.login.userId) {
        userId = res.login.userId;
      }

      await SecureStore.setItemAsync("userId", userId);

      setIsLoggedIn(true);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onPressContinue = async () => {
    if (!username || !password) {
      console.error("Email or password is required");
      return;
    }

    const usernameWithoutSpace = username.replace(" ", "");

    try {
      await loginMutation({
        variables: {
          input: {
            username: usernameWithoutSpace,
            password,
          },
        },
      });
    } catch (err) {
      console.error("Error during login mutation:", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.logo}>Instagram</Text>

        <TextInput
          style={styles.input}
          placeholder="Phone number, username, or email"
          keyboardType="email-address"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.button} onPress={onPressContinue}>
          <Text style={styles.buttonText}>Log In</Text>
        </Pressable>

        {/* <Text style={styles.forgotPassword}>Forgot password?</Text> */}
      </View>

      <View style={styles.signupContainer}>
        <Text style={styles.signUpText} onPress={() => navigation.navigate("Register")}>
          Don't have an account? <Text style={styles.signupLink}>Sign up</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    fontFamily: 'Arial',
    fontSize: 40,
    fontWeight: '500',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 44,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 5,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#0095f6',
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    marginTop: 20,
    color: '#00376b',
    fontSize: 14,
  },
  signupContainer: {
    borderTopWidth: 1,
    borderTopColor: '#dbdbdb',
    padding: 20,
  },
  signupText: {
    fontSize: 14,
    textAlign: 'center',
  },
  signupLink: {
    color: '#0095f6',
    fontWeight: '600',
  },
});

export default LoginScreen;