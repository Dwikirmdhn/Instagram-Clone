import { useEffect, useState } from "react";
import { StyleSheet, View, Image, Text, Pressable, SafeAreaView, } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER_BY_ID, FOLLOW_OR_UNFOLLOW_USER } from "../queries";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

const ProfileScreen = ({ route }) => {
  const [storedUserId, setStoredUserId] = useState(null);
  const userId = route?.params?.userId;

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await SecureStore.getItemAsync("userId");
      setStoredUserId(id);
    };
    fetchUserId();
  }, []);

  const { loading, error, data, refetch } = useQuery(GET_USER_BY_ID, {
    variables: {
      input: {
        userId,
      },
    },
    skip: !userId,
  });

  const [
    followOrUnfollowMutation,
    { mutationLoading, mutationError, mutationData },
  ] = useMutation(FOLLOW_OR_UNFOLLOW_USER, {
    onCompleted: async () => {
      refetch();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onPressFollow = async () => {
    try {
      await followOrUnfollowMutation({
        variables: {
          input: {
            followingId: userId,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>Error loading profile</Text>
      </SafeAreaView>
    );
  }

  if (data) {
    return (
      <SafeAreaView style={styles.container}>
        <Image
          source={require("../assets/avatar.jpg")}
          style={styles.avatar}
        />

        {storedUserId !== userId && (
          <View style={styles.followContainer}>
            <Pressable style={styles.followButton} onPress={onPressFollow}>
              <Text style={styles.followButtonText}>Follow</Text>
            </Pressable>
          </View>
        )}

        <Text style={styles.name}>{data?.getUserById?.name}</Text>
        <Text style={styles.username}>{data?.getUserById?.username}</Text>

        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            Following: <Text style={styles.boldText}>{data.getUserById.Followings.length}</Text>
          </Text>
          <Text style={styles.statsText}>
            Followers: <Text style={styles.boldText}>{data.getUserById.Followers.length}</Text>
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#1DA1F2", // Blue border for the avatar
  },
  followContainer: {
    marginVertical: 16,
  },
  followButton: {
    backgroundColor: "#1DA1F2", // Blue background for the button
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 3,
  },
  followButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4
  },
  username: {
    fontSize: 20,
    color: 'gray',
    marginBottom: 12
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 16
  },
  statsText: {
    fontSize: 16,
    marginHorizontal: 20,
    color: '#555'
  },
  boldText: {
    fontWeight: 'bold',
    color: '#1DA1F2' // Blue text for follower counts
  }
});

export default ProfileScreen;