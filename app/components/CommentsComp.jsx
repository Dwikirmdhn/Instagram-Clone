import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Comment = ({ comment }) => {
  return (
    <View style={styles.commentContainer}>
      <View style={styles.commentContent}>
        <Text style={styles.username}>
          <Text style={styles.bold}>{comment.username}</Text>
        </Text>
        <Text style={styles.content}>{comment.content}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  username: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  content: {
    fontSize: 16,
    color: "#333",
  },
});

export default Comment;