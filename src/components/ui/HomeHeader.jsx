import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const HomeHeader = ({ searchQuery, setSearchQuery, navigation, userName }) => (
  <View>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.openDrawer()} activeOpacity={0.7}>
        <Icon name="menu" size={28} color="#FFF" />
      </TouchableOpacity>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.greeting}>
          {userName ? `Welcome, ${userName}!` : 'Welcome!'}
        </Text>
        <Text style={styles.subHeading}>Let's start an order</Text>
      </View>
      <TouchableOpacity
        style={styles.profileIconContainer}
        onPress={() => navigation.navigate('Settings')}
        activeOpacity={0.7}
      >
        <Image source={require('../../imgs/logo.png')} style={{ width: '100%', height: '100%', borderRadius: 8 }} resizeMode="contain" />
      </TouchableOpacity>
    </View>

    <View style={styles.searchBar}>
      <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
      <TextInput
        placeholder="Search products"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchTextInput}
        returnKeyType="search"
        placeholderTextColor="#95a5a6"
      />
      {searchQuery ? (
        <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.searchClearButton}>
          <Icon name="x" size={18} color="#888" />
        </TouchableOpacity>
      ) : null}
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#030303ff',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 15,
  },
  greeting: {
    fontSize: 13,
    color: '#ecf0f1',
    fontWeight: '400',
    marginBottom: 2,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  profileIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    borderRadius: 12,
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ecf0f1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchTextInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 14,
    color: '#2c3e50',
  },
  searchClearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});

export default HomeHeader;