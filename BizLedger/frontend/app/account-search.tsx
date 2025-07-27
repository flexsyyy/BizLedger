import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView,
  FlatList
} from 'react-native';
import { useRouter } from 'expo-router';

// Mock data for accounts
const ACCOUNTS = [
  { id: '1', name: 'Talib' },
  { id: '2', name: 'John' },
  { id: '3', name: 'Sarah' },
  { id: '4', name: 'Michael' },
  { id: '5', name: 'Emma' },
];

export default function AccountSearchScreen(): JSX.Element {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  // Filter accounts based on search text
  const filteredAccounts = ACCOUNTS.filter(account => 
    account.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCancel = () => {
    router.back();
  };

  const handleView = () => {
    if (selectedAccount) {
      // Navigate to account details or perform action with selected account
      console.log(`Viewing account: ${selectedAccount}`);
      router.back();
    }
  };

  const renderAccount = ({ item }: { item: { id: string, name: string } }) => (
    <TouchableOpacity 
      style={styles.accountItem}
      onPress={() => setSelectedAccount(item.id)}
    >
      <View style={styles.radioContainer}>
        <View style={styles.radioOuter}>
          {selectedAccount === item.id && <View style={styles.radioInner} />}
        </View>
      </View>
      <Text style={styles.accountName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Blue header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>SELECT ACCOUNT</Text>
        </View>

        {/* Search input */}
        <View style={styles.searchContainer}>
          <Image 
            source={require('../assets/images/icon-search.png')} 
            style={styles.searchIcon} 
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search account name"
            placeholderTextColor="#515151"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <View style={styles.divider} />

        {/* Account list */}
        <FlatList
          data={filteredAccounts}
          renderItem={renderAccount}
          keyExtractor={item => item.id}
          style={styles.accountList}
        />

        <View style={styles.bottomDivider} />

        {/* Bottom buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCancel}
          >
            <Text style={styles.cancelText}>cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.viewButton, 
              !selectedAccount && styles.disabledButton
            ]}
            onPress={handleView}
            disabled={!selectedAccount}
          >
            <Text style={styles.viewText}>view</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03216d',
  },
  content: {
    flex: 1,
    marginTop: 57,
    marginHorizontal: 30,
    backgroundColor: '#ffffff',
    borderRadius: 39,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 47.1,
    elevation: 10,
  },
  header: {
    backgroundColor: '#002ea3',
    height: 92,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 39,
    borderTopRightRadius: 39,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#515151',
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  divider: {
    height: 1,
    backgroundColor: '#d9d9d9',
    marginHorizontal: 20,
    marginTop: 10,
  },
  accountList: {
    flex: 1,
    marginTop: 10,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  radioContainer: {
    marginRight: 30,
  },
  radioOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#002ea3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  accountName: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000000',
  },
  bottomDivider: {
    height: 1,
    backgroundColor: '#d9d9d9',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
  },
  cancelButton: {
    backgroundColor: '#d9d9d9',
    borderColor: '#6f6f6f',
    borderWidth: 1,
    borderRadius: 18.5,
    height: 37,
    width: 109,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8a8888',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
  },
  viewButton: {
    backgroundColor: '#002ea3',
    borderColor: '#1759ff',
    borderWidth: 1,
    borderRadius: 18.5,
    height: 37,
    width: 109,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8a8888',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  cancelText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  viewText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
