import React, { useCallback, useContext } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, Pressable } from "react-native";
import Post from "../components/PostComp";
import { useQuery } from "@apollo/client";
import { GET_POSTS } from "../queries";
import { useFocusEffect } from "@react-navigation/native";
import { LoginContext } from "../context/LoginContext"
import * as SecureStore from "expo-secure-store";

export default function HomeScreen({ navigation }) {
  const { loading, error, data, refetch } = useQuery(GET_POSTS);
  const { setIsLoggedIn } = useContext(LoginContext);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("access_token");
    setIsLoggedIn(false);
    navigation.navigate("Login");
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
      // console.log(data.getPosts)
    }, [refetch])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: "center" }}>loading...</Text>
      </SafeAreaView>
    );
  }

  if (!loading && error) {
    console.log(error);
    return (
      <SafeAreaView style={styles.container}>
        <Text>{error.message}</Text>
      </SafeAreaView>
    );
  }

  if (!loading && data) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.boldText, { fontWeight: 'bold', fontSize: 32 }]}>Instagram</Text>
          <Pressable onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </Pressable>
        </View>
        <FlatList
          data={data.getPosts}
          renderItem={({ item }) => (
            <Post post={item} navigation={navigation} refetch={refetch} />
          )}
          keyExtractor={(item) => item._id}
          style={{ paddingTop: 20 }}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row", // Align items in a row
    justifyContent: "space-between", // Space between title and logout button
    alignItems: "center", // Center items vertically
    height: 60, // Set a fixed height for the header
    paddingHorizontal: 16, // Horizontal padding for the header
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  logoutButton: {
    backgroundColor: '#1DA1F2', // Example color for the button
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  headerImage: {
    width: 120,
    height: 40,
  },
  post: {
    marginBottom: 15,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  username: {
    fontWeight: "bold",
  },
  postImage: {
    width: "100%",
    height: 400,
  },
  postActions: {
    flexDirection: "row",
    padding: 10,
  },
  likes: {
    fontWeight: "bold",
    marginLeft: 10,
  },
  caption: {
    marginLeft: 10,
    marginRight: 10,
  },
  viewComments: {
    color: "gray",
    marginLeft: 10,
    marginTop: 5,
  },
  timestamp: {
    color: "gray",
    fontSize: 12,
    marginLeft: 10,
    marginTop: 5,
  },
});
