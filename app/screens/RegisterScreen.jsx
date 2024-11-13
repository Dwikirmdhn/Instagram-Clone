import { useState } from "react"
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { REGISTER } from "../queries";
import { useMutation } from "@apollo/client";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")

  const [Mutation, { loading, error, data }] = useMutation(REGISTER, {
    onCompleted: async (res) => {
      navigation.navigate("Login");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleRegister = async () => {
    if (!name || !username || !email || !password) {
      console.error("Name, username, email or password is required");
      return;
    }

    try {
      await Mutation({
        variables: {
          input: {
            name,
            username,
            email,
            password,
          },
        },
      });
    } catch (err) {
      console.error("Error during register:", err);
    }
  };
  const onLoginPress = () => {
    navigation.navigate("Login");
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.logo}>Instagram</Text>

        <Text style={styles.subtitle}>Sign up to see photos and videos from your friends.</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.buttonText}>Sign up</Text>
        </Pressable>

        <Text style={styles.termsText}>
          By signing up, you agree to our Terms, Data Policy and Cookies Policy.
        </Text>
      </View>

      <View style={styles.loginContainer}>
        <Text onPress={onLoginPress}>
          Have an account? <Text style={styles.loginLink}>Log in</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}
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
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 17,
    color: '#8e8e8e',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 44,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#dbdbdb',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  registerButton: {
    width: '100%',
    backgroundColor: '#0095f6',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    color: '#8e8e8e',
    textAlign: 'center',
    marginTop: 20,
  },
  loginContainer: {
    borderTopWidth: 1,
    borderTopColor: '#dbdbdb',
    padding: 20,
  },
  loginText: {
    fontSize: 14,
    textAlign: 'center',
  },
  loginLink: {
    color: '#0095f6',
    fontWeight: '600',
  },
});

export default RegisterScreen;