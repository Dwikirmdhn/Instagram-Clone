import { StyleSheet, View, Text, Image, Pressable } from "react-native";

const Search = ({ user, navigation }) => {
  return (
    <Pressable
      onPress={() =>
        navigation.navigate("ProfileScreen", { userId: user["_id"] })
      }
    >
      <View style={styles.container}>
        <View>
          <Text style={{ fontWeight: "bold" }}>{user.name}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 5,
    gap: 10,
  },
});

export default Search;