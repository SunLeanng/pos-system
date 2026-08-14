#include <iostream>
#include <string>

using namespace std;

const int TABLE_SIZE = 200;

class HashTable {
private:
    string table[TABLE_SIZE];
    bool occupied[TABLE_SIZE];

    // Correct Hash Function to prevent negative indices
    int hashFunction(string key) {
        long long hash_value = 0;
        long long p = 31; 
        long long p_pow = 1;

        for (int i = key.length() - 1; i >= 0; i--) {
            
            hash_value = (hash_value + (key[i] - 'a' + 1) * p_pow) % TABLE_SIZE;
            p_pow = (p_pow * p) % TABLE_SIZE;
        }
        
        // Final safety check: ensure the result is positive
        int final_index = (int)(hash_value % TABLE_SIZE);
        if (final_index < 0) final_index += TABLE_SIZE;
        
        return final_index;
    }

public:
    HashTable() {
        for (int i = 0; i < TABLE_SIZE; i++) {
            occupied[i] = false;
            table[i] = "";
        }
    }
            
    void insert(string word) {
        if (word.length() < 1 || word.length() > 5) { 
            cout << "  -> Error: '" << word << "' must be between 1 and 5 characters!" << endl;
            return;
        }

        int index = hashFunction(word);
        int originalIndex = index;

        // Linear Probing for Collision Resolution
        while (occupied[index]) {
            index = (index + 1) % TABLE_SIZE;
            if (index == originalIndex) {
                cout << "  -> Error: Table is full!" << endl;
                return;
            }
        }

        table[index] = word;
        occupied[index] = true;
        cout << "  -> Success: '" << word << "' inserted at Index [" << index << "]" << endl;
    }

    void searchByIndex(int index) {
        if (index < 0 || index >= TABLE_SIZE) {
            cout << "Error: Invalid Index! Please use 0 to 199." << endl;
            return;
        }

        if (occupied[index]) {
            cout << "Data at Index [" << index << "] is: '" << table[index] << "'" << endl;
        } else {
            cout << "Index [" << index << "] is empty." << endl;
        }
    }
};

int main() {
    HashTable myHash;
    int choice;
    string inputWord;
    int inputIndex;

    while (true) {
        cout << "\n--- HASH TABLE (FIXED INDEX 0-199) ---" << endl;
        cout << "1. Insert 3 Words" << endl;
        cout << "2. Search by Index" << endl;
        cout << "3. Exit" << endl;
        cout << "Select Option: ";
        cin >> choice;

        if (choice == 1) {
            cout << "Enter 3 words (1-5 chars):" << endl;
            for (int i = 1; i <= 3; i++) {
                cout << "Word " << i << ": ";
                cin >> inputWord;
                myHash.insert(inputWord);
            }
        } 
        else if (choice == 2) {
            cout << "Enter Index (0-199): ";
            cin >> inputIndex;
            myHash.searchByIndex(inputIndex);
        } 
        else if (choice == 3) {
            break;
        } 
        else {
            cout << "Invalid choice!" << endl;
        }
    }
    return 0;
}