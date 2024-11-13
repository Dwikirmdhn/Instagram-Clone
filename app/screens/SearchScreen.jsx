import { StyleSheet, Text, TextInput, Pressable, FlatList, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useCallback, useState } from "react";

import { SEARCH_USERS } from "../queries";
import { useLazyQuery } from "@apollo/client";
import SearchResult from "../components/SearchComp";

const SearchUsers = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const [searchUsers, { loading, data, error }] = useLazyQuery(SEARCH_USERS);

  const handleSearch = useCallback(
    (text) => {
      setSearchTerm(text);
      if (text.length > 0) {
        searchUsers({ variables: { input: { keyword: text } } });
      }
    },
    [searchUsers]
  );

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={() => navigation.navigate("HomeScreen")}>
        <Text style={styles.backText}>{`Cancel`}</Text>
      </Pressable>
      <TextInput
        style={styles.textInput}
        placeholder="Search.."
        value={searchTerm}
        onChangeText={handleSearch}
      />

      {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error.message}</Text>}

      {data && data.searchUsers.length > 0 ? (
        <FlatList
          data={data.searchUsers}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <SearchResult user={item} navigation={navigation} />
          )}
          contentContainerStyle={styles.list}
        />
      ) : (
        searchTerm.length > 0 &&
        !loading && <Text style={{ color: "gray" }}>No results found</Text>
      )}

      {searchTerm.length < 1 && <Text></Text>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    paddingTop: 20,
    paddingHorizontal: 15,
    backgroundColor: "white",
  },
  backText: {
    color: "gray",
    fontWeight: "bold",
    fontSize: 25,
  },
  textInput: {
    width: "100%",
    height: 50,
    backgroundColor: "#f6f7f8",
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: "#333",
  },
  list: {
    paddingBottom: 20,
  },
});

export default SearchUsers;