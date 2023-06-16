/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  BottomNavigation as Screens,
  PaperProvider,
  Text,
} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import ChatsScreen from './src/screens/chats';
import {NativeRouter, Route, Routes} from 'react-router-native';
import ChatScreen from './src/screens/chat';

const ChatsRoute = () => <ChatsScreen />;

const CallsRoute = () => <Text>Calls</Text>;

const PeopleRoute = () => <Text>People</Text>;

const StoriesRoute = () => <Text>Stories</Text>;

interface NavRoutes {
  key: string;
  title: string;
}

function App(): JSX.Element {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState<NavRoutes[]>([
    {
      key: 'chats',
      title: 'Chats',
    },
    {key: 'calls', title: 'Calls'},
    {key: 'people', title: 'People'},
    {
      key: 'stories',
      title: 'Stories',
    },
  ]);

  const renderScene = Screens.SceneMap({
    chats: ChatsRoute,
    calls: CallsRoute,
    people: PeopleRoute,
    stories: StoriesRoute,
  });

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NativeRouter>
          <Routes>
            <Route
              path="/"
              element={
                <Screens
                  navigationState={{index, routes}}
                  onIndexChange={setIndex}
                  renderScene={renderScene}
                />
              }
            />
            <Route path="/chat/:chatId" element={<ChatScreen />} />
          </Routes>
        </NativeRouter>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default App;
