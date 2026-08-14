import {
    collection,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";


// Get all users
export const getUsers = async () => {

    const snapshot = await getDocs(
        collection(db, "users")
    );


    return snapshot.docs.map((item) => ({

        id: item.id,

        ...item.data()

    }));

};



// Get one user by UID
export const getUserById = async (uid) => {

    const userRef = doc(
        db,
        "users",
        uid
    );


    const userSnap = await getDoc(userRef);


    if(userSnap.exists()) {

        return {

            id: userSnap.id,

            ...userSnap.data()

        };

    }


    return null;

};



// Update user role
export const updateUserRole = async (
    uid,
    role
) => {

    await updateDoc(

        doc(
            db,
            "users",
            uid
        ),

        {
            role: role
        }

    );

};



// Delete user
export const deleteUser = async (uid) => {

    await deleteDoc(

        doc(
            db,
            "users",
            uid
        )

    );

};