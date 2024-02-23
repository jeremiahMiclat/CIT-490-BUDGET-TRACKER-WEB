import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, counterSlice } from '../app/_layout';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
interface SignInScreenProps {
  signIn: any;
}

export default function SignInComponent({
  signIn,
  signOut,
  setLocal,
  deleteOnCloud,
}: SignInScreenProps & { signOut: () => Promise<void> } & { setLocal: any } & {
  deleteOnCloud: any;
}) {
  const userData = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const flData = userData.existingData;
  const renderItem = ({ item }: any) =>
    userData.isLoggedIn ? (
      <View style={styles.itemContainer}>
        <View style={styles.itemWrapper}>
          <Pressable style={styles.flPressable} onPress={() => setLocal(item)}>
            <Text style={styles.flatListItemText}>{item.fieldName}</Text>
          </Pressable>
          <Pressable
            style={styles.flPressable}
            onPress={() => deleteOnCloud(item)}
          >
            <MaterialIcons
              name="delete"
              size={24}
              color="#537B2F"
              style={styles.delBtn}
            />
          </Pressable>
        </View>
      </View>
    ) : (
      <View />
    );
  const handleSignInPress = async () => {
    if (!userData.isLoggedIn) {
      try {
        const result = await signIn();
      } catch (error) {
        // Handle any errors that occurred during the authentication process
        console.error('Authentication error:', error);
      }
    } else {
      console.log('user already logged in');
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const renderFlatListHeader = () => (
    <View>
      <View>
        <Pressable onPress={handleSignInPress} style={styles.signInBtn}>
          <Text>Sign In with Google</Text>
        </Pressable>
      </View>

      <View>
        <Pressable onPress={handleSignOut} style={styles.signOutBtn}>
          <Text>Sign Out</Text>
        </Pressable>
      </View>

      <View style={styles.paddingTB30} />
    </View>
  );
  return (
    <SafeAreaView style={styles.safeAreaView}>
      {userData.isLoggedIn ? (
        <View style={styles.container}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              Hello:{' '}
              {(userData as any)?.userProfile?.given_name ||
                'Error fetching name'}
            </Text>
            <Pressable onPress={handleSignOut} style={styles.signOutBtn}>
              <Text style={styles.signOutBtnText}>Sign Out</Text>
              <FontAwesome name="sign-out" size={24} color="#DCEDC8" />
            </Pressable>
          </View>
          <View style={styles.flatListContainer}>
            <Text style={styles.flatListContainerHeader}>
              Click to Load Saved Data:{' '}
            </Text>
            <FlatList
              data={flData}
              renderItem={renderItem}
              keyExtractor={item => item.fieldName}
            />
          </View>
        </View>
      ) : (
        <View style={styles.signInBtn}>
          {/* <Pressable onPress={handleSignInPress} style={styles.signInBtn}>
            <Text style={styles.signInBtn}>Sign In with Google</Text>
          </Pressable> */}
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={handleSignInPress}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marginTop30: {
    marginTop: 30,
  },
  paddingTB30: {
    paddingTop: 30,
    paddingBottom: 30,
  },
  flPressable: {
    padding: 20,
  },
  itemContainer: {
    justifyContent: 'space-between',
    margin: 5,
  },
  itemWrapper: {
    backgroundColor: '#eaf7da',
  },
  signInBtn: {
    alignSelf: 'center',
  },
  signOutBtn: {
    alignSelf: 'center',
    marginRight: 10,
    flexDirection: 'row',
  },
  signOutBtnText: { color: '#DCEDC8', marginRight: 10 },
  safeAreaView: {
    backgroundColor: '#8DA750',
    flex: 1,
  },
  text: {
    color: '#003300',
  },
  welcomeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  welcomeText: {
    color: '#DCEDC8',
    marginLeft: 10,
    fontSize: 20,
  },
  flatListContainer: {
    borderRadius: 10,
    backgroundColor: '#DCEDC8',
    padding: 10,
    margin: 10,
    flex: 1,
  },
  flatListContainerHeader: {
    color: '#003300',
    alignSelf: 'center',
    padding: 10,
  },
  flatListItemText: {
    fontSize: 12,
    color: '#003300',
  },
  delBtn: {
    alignSelf: 'center',
  },
});

const user = {
  additionalUserInfo: {
    isNewUser: false,
    profile: {
      aud: '774298954456-q1pplt57a5ho93g44512jjdofr8gfkja.apps.googleusercontent.com',
      azp: '774298954456-1t394j4to2ltj7apqb2it6erbvvvfpdv.apps.googleusercontent.com',
      email: 'eslpamore@gmail.com',
      email_verified: true,
      exp: 1708547221,
      family_name: '2.0',
      given_name: 'Leopold',
      iat: 1708543621,
      iss: 'https://accounts.google.com',
      locale: 'en',
      name: 'Leopold 2.0',
      picture:
        'https://lh3.googleusercontent.com/a/ACg8ocLKZZd4oDkFsH_98g23o2NYG0-5kMH2HUsXLQ-gvYe-_MY=s96-c',
      sub: '106814656356481153929',
    },
    providerId: 'google.com',
  },
  user: {
    displayName: 'Leopold 2.0',
    email: 'eslpamore@gmail.com',
    emailVerified: true,
    isAnonymous: false,
    metadata: [Object],
    multiFactor: [Object],
    phoneNumber: null,
    photoURL:
      'https://lh3.googleusercontent.com/a/ACg8ocLKZZd4oDkFsH_98g23o2NYG0-5kMH2HUsXLQ-gvYe-_MY=s96-c',
    providerData: [Array],
    providerId: 'firebase',
    tenantId: null,
    uid: 'epWCx7AV66O6Xwcq3Ll6zur4IP92',
  },
};
