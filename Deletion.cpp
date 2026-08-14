#include <iostream>
#include <string>
#include <vector>

using namespace std;

class HashTable {
private:
    int TABLE_SIZE;
    vector<string> table;
    const string TOMBSTONE = "TOMSTONE";
    const string EMPTY = "";


    int hashFunction(string key) {
        if (key == "phone" || key == "car" || key == "watch" || key == "printer") {
            return 20 % TABLE_SIZE;
        }
        
        // Default basic hash for other strings
        int sum = 0;
        for (char ch : key) {
            sum += ch;
        }
        return sum % TABLE_SIZE;
    }

public:
    HashTable(int size) {
        TABLE_SIZE = size;
        table.resize(TABLE_SIZE, EMPTY);
    }

    // INSERT FUNCTION
    void insert(string key) {
        int index = hashFunction(key);
        int originalIndex = index;
        
        // Loop to find an empty slot or a TOMBSTONE to reuse
        while (table[index] != EMPTY && table[index] != TOMBSTONE) {
            if (table[index] == key) {
                cout << "Key \"" << key << "\" already exists.\n";
                return;
            }
            index = (index + 1) % TABLE_SIZE; // Linear probing
            
            if (index == originalIndex) {
                cout << "Hash Table is Full!\n";
                return;
            }
        }
        
        table[index] = key;
        cout << "Inserted \"" << key << "\" at index " << index << "\n";
    }

    //  DELETE FUNCTION
    void deleteFromTable(string key) {
        int index = hashFunction(key);
        int originalIndex = index;

        // Loop to find the key to delete
        while (table[index] != EMPTY) {
            if (table[index] == key) {
                table[index] = TOMBSTONE; // Replace deleted element with Tombstone
                cout << "Deleted \"" << key << "\" and marked index " << index << " as TOMBSTONE.\n";
                return;
            }
            index = (index + 1) % TABLE_SIZE; // Keep probing

            if (index == originalIndex) {
                break; // Looped through the whole table
            }
        }
        cout << "Key \"" << key << "\" not found to delete.\n";
    }

    // 3. SEARCH FUNCTION
    bool search(string key) {
        int index = hashFunction(key);
        int originalIndex = index;

        // Skip occupied entries and TOMBSTONES, stop only at a pure EMPTY cell
        while (table[index] != EMPTY) {
            if (table[index] == key) {
                cout << "Found \"" << key << "\" at index " << index << "\n";
                return true;
            }
            index = (index + 1) % TABLE_SIZE; // Probing forward

            if (index == originalIndex) {
                break;
            }
        }
        cout << "\"" << key << "\" not found in the table.\n";
        return false;
    }

    // Helper to print the states of our index block
    void displayRange(int start, int end) {
        cout << "\n--- Hash Table Status (Index " << start << " to " << end << ") ---\n";
        for (int i = start; i <= end; i++) {
            cout << "Index " << i << ": " << (table[i] == "" ? "[EMPTY]" : table[i]) << "\n";
        }
        cout << "-------------------------------------------\n";
    }
};

int main() {
    // Creating a hash table of size 30
    HashTable ht(30);

    // Initial sequential insertions building a collision chain
    ht.insert("phone"); // goes to 20
    ht.insert("car");   // collides -> goes to 21
    ht.insert("watch"); // collides -> goes to 22
    ht.displayRange(20, 23);

    // Test Deletion (Your homework target)
    ht.deleteFromTable("car"); // Index 21 becomes TOMBSTONE
    ht.displayRange(20, 23);

    ht.search("watch");

    
    ht.insert("printer"); // Hashes to 20 -> hits 21 (TOMBSTONE) -> Reuses index 21!
    ht.displayRange(20, 23);

    return 0;
}