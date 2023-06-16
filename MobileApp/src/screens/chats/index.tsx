import {useContext} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Appbar, Avatar, Button, Text} from 'react-native-paper';
import {useNavigate} from 'react-router-native';
import {AuthContext} from '../../shared/auth/contexts/auth.context';
import {useQuery} from 'react-query';
import {baseUrl, get} from '../../shared/request';

const ChatsScreen = () => {
  const {jwt, onLogout} = useContext(AuthContext);

  useQuery(
    'presence',
    async () => {
      const {data: presence} = await get(baseUrl + '/presence');
      console.log(1, presence);
      console.log(5, jwt);
      return presence;
    },
    {
      enabled: !!jwt,
    },
  );

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

      <Button onPress={onLogout}>Sign Out</Button>
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
