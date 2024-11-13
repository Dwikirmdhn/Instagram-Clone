import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { useMutation } from "@apollo/client";
import { LIKE_OR_UNLIKE_POST } from "../queries";

export default function Post({ post, navigation, refetch }) {
  const [imageAspectRatio, setImageAspectRatio] = useState(1);

  const tags = post?.tags?.map((tag) => `#${tag}`).join(" ");

  useEffect(() => {
    Image.getSize(
      post.imgUrl,
      (width, height) => {
        setImageAspectRatio(width / height);
      },
      (error) => {
        console.error("Failed to load image", error);
      }
    );
  }, [post.imgUrl]);

  const [likeOrUnlikeMutation] = useMutation(LIKE_OR_UNLIKE_POST, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onPressLike = async (postId) => {
    try {
      if (postId) {
        await likeOrUnlikeMutation({
          variables: {
            input: {
              postId,
            },
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Pressable
      onPress={() => navigation.navigate("ProfileScreen", { userId: post.Author["_id"] })}
      style={styles.header}
    >
      <View style={styles.container}>
        <Image
          style={styles.avatar}
          source={require("../assets/avatar.jpg")}
          resizeMode="cover"
        />
        <Text style={styles.usernameText}>{post.Author.username}</Text>

        <Image
          style={[styles.postImage, { aspectRatio: imageAspectRatio }]}
          source={{ uri: post.imgUrl }}
          resizeMode="cover"
        />

        <View style={styles.actionsContainer}>
          <Pressable onPress={() => onPressLike(post._id)} style={styles.actionButton}>
            <Text style={styles.actionIcon}>Like</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate("PostDetail", { postId: post["_id"] })} style={styles.actionButton}>
            <Text style={styles.actionIcon}>Comment</Text>
          </Pressable>
        </View>

        <Text style={styles.likesText}>{post.likes.length} likes</Text>

        <View style={styles.captionContainer}>
          <Text style={[styles.boldText, { fontWeight: 'bold' }]}>Content:</Text>
          <Text style={styles.captionText}>{post.content}</Text>
        </View>

        {tags && <Text style={styles.tagsText}>{tags}</Text>}
        <Pressable onPress={() => navigation.navigate("PostDetail", { postId: post["_id"] })} style={styles.actionButton}>
          <Text style={styles.commentsText}>View all {post.comments.length} comments</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  usernameText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  postImage: {
    width: '100%',
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 8,
  },
  actionButton: {
    marginRight: 16,
  },
  actionIcon: {
    fontSize: 20,
  },
  likesText: {
    fontWeight: 'bold',
    fontSize: 14,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  captionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  captionText: {
    fontSize: 14,
    marginLeft: 4,
  },
  tagsText: {
    fontSize: 14,
    color: '#003569',
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  commentsText: {
    fontSize: 14,
    color: 'gray',
    paddingHorizontal: 8,
  },
});