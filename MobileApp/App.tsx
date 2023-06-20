/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {PaperProvider} from 'react-native-paper';
import {QueryClient, QueryClientProvider} from 'react-query';
import Screens from './src/screens';
import {AuthProvider} from './src/shared/auth/contexts/auth.context';
import {FriendsProvider} from './src/shared/friends/contexts/friends.context';

function App(): JSX.Element {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
        <FriendsProvider>
          <PaperProvider>
            <Screens />
          </PaperProvider>
        </FriendsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
