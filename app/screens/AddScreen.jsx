import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation } from "@apollo/client";
import { ADD_POST } from "../queries";


const AddPostScreen = ({ navigation }) => {
  const [content, setContent] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [tagsString, setTagsString] = useState("");

  const [addPostMutation, { loading, error, data }] = useMutation(ADD_POST, {
    onCompleted: async (res) => {
      setContent("");
      setImgUrl("");
      setTagsString("");
      navigation.navigate("Home");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onPressPost = async () => {
    if (!content || !imgUrl) {
      console.log("Content or image URL is required");
      return;
    }

    let tags;
    if (tagsString.length > 0) {
      tags = tagsString.replace(" ", "");
      tags = tagsString.split(",");
    }

    try {
      await addPostMutation({
        variables: {
          input: {
            content,
            imgUrl,
            tags,
          },
        },
      });
    } catch (err) {
      console.error("Error during adding post:", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </Pressable>
        <Text style={styles.headerTitle}>New Post</Text>
        <Pressable style={styles.postButton} onPress={onPressPost}>
          <Text style={styles.postButtonText}>Post</Text>
        </Pressable>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.inputContainer}>
          {/* <Camera size={24} color="#666" /> */}
          <TextInput
            style={styles.imageInput}
            placeholder="Image URL"
            autoCapitalize="none"
            value={imgUrl}
            onChangeText={setImgUrl}
          />
        </View>
        <View style={styles.inputContainer}>
          {/* <Image size={24} color="#666" /> */}
          <TextInput
            style={styles.contentInput}
            placeholder="Content.."
            autoCapitalize="sentences"
            multiline
            value={content}
            onChangeText={setContent}
          />
        </View>
        <View style={styles.inputContainer}>
          {/* <Tag size={24} color="#666" /> */}
          <TextInput
            style={styles.tagsInput}
            placeholder="Tags#"
            autoCapitalize="none"
            value={tagsString}
            onChangeText={setTagsString}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    color: '#666',
    fontSize: 16,
  },
  postButton: {
    backgroundColor: '#0095f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
  },
  imageInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  contentInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    minHeight: 100,
  },
  tagsInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
});

export default AddPostScreen;