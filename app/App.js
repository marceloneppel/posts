import React, {Component} from "react";
import {Button, FlatList, Text, TextInput, View} from "react-native";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import {ApolloProvider} from "react-apollo";
import {Dialog} from 'react-native-simple-dialogs';

const apolloClient = new ApolloClient({
    //uri: 'http://10.0.2.2:3000/graphql'
    uri: 'http://172.22.0.100:3000/graphql'
});

export default class App extends Component {
    state = {};

    componentDidMount() {
        this.setState({
            posts: [],
        });
        this.loadPosts();
    }

    addPost = () => {
        if (this.state.newPostText === "") {
            this.setState({
                alertDialogVisible: true,
                alertMessage: "Please type the post text!",
            });
        } else {
            apolloClient
                .mutate({
                    mutation: gql`
                        mutation CreatePost($text: String!) {
                            createPost(
                                text: $text,
                            ) {
                                id
                            }
                        }
                    `,
                    variables: {
                        text: this.state.newPostText,
                    }
                })
                .then(result => {
                    this.setState({
                        addPostDialogVisible: false,
                        alertDialogVisible: true,
                        alertMessage: "Post created.",
                        newPostText: "",
                    });
                    this.loadPosts();
                }, error => {
                    this.setState({
                        alertDialogVisible: true,
                        alertMessage: error.toString(),
                    });
                });
        }
    };

    addPostDialog = () => {
        this.setState({
            addPostDialogVisible: true,
            newPostText: "",
        });
    };

    loadPosts = () => {
        apolloClient
            .query({
                query: gql`
                  {
                    posts {
                      id
                      text
                      upvotes
                    }
                  }
                `,
                fetchPolicy: 'network-only',
            })
            .then(result => {
                if (result.error !== undefined) {
                    this.setState({
                        posts: (<Text>{result.error.toString()}</Text>),
                    });
                } else {
                    this.setState({
                        posts: result.data.posts,
                    });
                }
            }, error => {
                this.setState({
                    alertDialogVisible: true,
                    alertMessage: error.toString(),
                });
            });
    };

    postKeyExtractor = (item, index) => item.id;

    renderPost = ({item}) => {
        if (item !== undefined) {
            return (
                <View key={`${item.id}`} style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 10,
                }}>
                    <Text>{`${item.text}`}</Text>
                    <Button
                        title={`${item.upvotes}`}
                        onPress={() => this.upvotePost(`${item.id}`)}
                    />
                </View>
            );
        } else {
            return (
                <Text>
                    undefined man!
                </Text>
            );
        }
    };

    upvotePost = (postId) => {
        apolloClient
            .mutate({
                mutation: gql`
                            mutation UpvotePost($id: ID!) {
                            upvotePost(
                            id: $id,
                            ) {
                            id
                        }
                        }
                            `,
                variables: {
                    id: postId,
                },
            })
            .then(result => {
                this.setState({
                    alertDialogVisible: true,
                    alertMessage: "Post upvoted.",
                });
                this.loadPosts();
            }, error => {
                this.setState({
                    alertDialogVisible: true,
                    alertMessage: error.toString(),
                });
            });
    };

    render() {
        return <ApolloProvider client={apolloClient}>
            <View style={{
                flex: 1,
                flexDirection: 'column',
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 10,
                }}>
                    <Text style={{
                        fontSize: 25,
                        fontWeight: "bold",
                    }}>
                        Posts
                    </Text>
                    <Button
                        onPress={this.addPostDialog}
                        title="Add Post"
                        color="#841584"
                    />
                </View>
                <View style={{
                    padding: 10,
                    paddingBottom: 60,
                }}>
                    <FlatList
                        data={this.state.posts}
                        keyExtractor={this.postKeyExtractor}
                        renderItem={this.renderPost}
                    />
                </View>
            </View>
            <Dialog
                visible={this.state.addPostDialogVisible}
                title="Add Post"
                onTouchOutside={() => this.setState({
                    addPostDialogVisible: false,
                    newPostText: "",
                })}>
                <View>
                    <Text>
                        Type the post text:
                    </Text>
                    <TextInput
                        onChangeText={(text) => this.setState({
                            newPostText: text,
                        })}/>
                    <View style={{
                        padding: 10,
                    }}>
                        <Button
                            onPress={this.addPost}
                            title="Add Post"
                            color="#841584"
                        />
                    </View>
                </View>
            </Dialog>
            <Dialog
                visible={this.state.alertDialogVisible}
                title="Alert"
                onTouchOutside={() => this.setState({
                    alertDialogVisible: false,
                })}>
                <View>
                    <Text>
                        {this.state.alertMessage}
                    </Text>
                    <View style={{
                        padding: 10,
                    }}>
                        <Button
                            onPress={() => this.setState({
                                alertDialogVisible: false,
                            })}
                            title="OK"
                            color="#841584"
                        />
                    </View>
                </View>
            </Dialog>
        </ApolloProvider>;
    }
}
