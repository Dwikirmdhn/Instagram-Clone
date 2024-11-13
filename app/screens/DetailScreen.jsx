import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Image, Text, TextInput, FlatList, Pressable, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COMMENT_POST, GET_POST_BY_ID, LIKE_OR_UNLIKE_POST } from "../queries";
import { useMutation, useQuery } from "@apollo/client";
import { useFocusEffect } from "@react-navigation/native";
import Comment from "../components/CommentsComp";

const PostDetail = ({ route }) => {
  const [content, setContent] = useState("");
  const postId = route?.params?.postId;

  const { loading, error, data, refetch } = useQuery(GET_POST_BY_ID, {
    variables: { input: { postId } },
    skip: !postId,
  });

  const [likeOrUnlikeMutation] = useMutation(LIKE_OR_UNLIKE_POST, {
    onCompleted: refetch,
    onError: (error) => console.log(error),
  });

  const onPressLike = async () => {
    if (postId) {
      await likeOrUnlikeMutation({
        variables: { input: { postId } },
      });
    }
  };

  const [commentMutation] = useMutation(COMMENT_POST, {
    onCompleted: () => {
      setContent("");
      refetch();
    },
    onError: (error) => console.log(error),
  });

  const onPressComment = async () => {
    await commentMutation({
      variables: { input: { content, postId } },
    });
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const tags = data?.getPostById?.tags?.map((tag) => `#${tag}`).join(" ");

  const [imageAspectRatio, setImageAspectRatio] = useState(1);

  useEffect(() => {
    if (data?.getPostById?.imgUrl) {
      Image.getSize(
        data.getPostById.imgUrl,
        (width, height) => setImageAspectRatio(width / height),
        (error) => console.error("Failed to load image", error)
      );
    }
  }, [data?.getPostById?.imgUrl]);

  if (loading) return <SafeAreaView style={styles.container}><Text>Loading post...</Text></SafeAreaView>;

  if (error || !data || !data.getPostById) return <Text>Error loading post</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data.getPostById.comments}
        renderItem={({ item }) => <Comment comment={item} />}
        keyExtractor={(item) => item.createdAt}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Image
                style={styles.avatar}
                source={require("../assets/avatar.jpg")}
                resizeMode="contain"
              />
              <Text style={styles.usernameText}>
                {data.getPostById.Author.username}
              </Text>
            </View>

            <View style={styles.body}>
              {data.getPostById.imgUrl && (
                <View style={styles.imageContainer}>
                  <Image
                    style={[styles.postImage, { aspectRatio: imageAspectRatio }]}
                    source={{ uri: data.getPostById.imgUrl }}
                    resizeMode="cover"
                  />
                </View>
              )}
              <Text style={styles.contentText}>{data.getPostById.content}</Text>
              <Text style={styles.tags}>
                Tags: <Text style={styles.boldText}>{tags}</Text>
              </Text>
            </View>

            <View style={styles.footer}>
              <Pressable onPress={onPressLike} style={styles.interactionContainer}>
                <Text>Like</Text>
                <Text style={styles.boldText}>{data.getPostById.likes.length}</Text>
              </Pressable>
              <View style={styles.interactionContainer}>
                <Text>Comment</Text>
                <Text style={styles.boldText}>{data.getPostById.comments.length}</Text>
              </View>
            </View>

            <TextInput
              placeholder="Add a comment"
              style={styles.commentInput}
              value={content}
              onChangeText={setContent}
            />

            <Pressable onPress={onPressComment} style={styles.commentButton}>
              <Text style={styles.commentButtonText}>Comment</Text>
            </Pressable>
          </>
        }
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
    paddingHorizontal: 12,
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  usernameText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#333",
  },
  body: {
    marginBottom: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    elevation: 2,
  },
  contentText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
  },
  tags: {
    marginBottom: 8,
    color: "#888",
  },
  boldText: {
    fontWeight: "bold",
    color: "#333",
  },
  imageContainer: {
    width: "100%",
    marginVertical: 16,
    borderRadius: 10,
    overflow: 'hidden'
  },
  postImage: {
    width: '100%',
    borderRadius: 10
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  interactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8
  },
  commentInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10
  },
  commentButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20
  },
  commentButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});

export default PostDetail;