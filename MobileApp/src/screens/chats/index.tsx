import {Pressable, StyleSheet, View} from 'react-native';
import {Appbar, Avatar, Text} from 'react-native-paper';
import {useNavigate} from 'react-router-native';

const ChatsScreen = () => {
  const navigate = useNavigate();

  const friends = [
    {id: 1, name: 'John'},
    {id: 2, name: 'Larry'},
    {id: 3, name: 'Barry'},
    {id: 4, name: 'Joe'},
    {id: 5, name: 'Mary'},
    {id: 6, name: 'Joyce'},
  ];

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Messenger" />
      </Appbar.Header>
      {friends.map(friend => (
        <Pressable
          key={friend.id}
          onPress={() => navigate(`/chat/${friend.id}`)}>
          <View style={styles.friend}>
            <Avatar.Image
              size={72}
              style={styles.profilePicture}
              source={{
                uri: `https://randomuser.me/api/portraits/men/${friend.id}.jpg`,
              }}
            />
            <View>
              <Text>{friend.name}</Text>
              <Text>This was the last msg</Text>
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  friend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profilePicture: {
    marginRight: 8,
  },
});

export default ChatsScreen;
