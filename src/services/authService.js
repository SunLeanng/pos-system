import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";

import {
    doc,
    setDoc,
    getDoc
} from "firebase/firestore";

import {
    auth,
    db
} from "../firebase/firebaseConfig";



// Register User

export const registerUser = async (
    email,
    password,
    name,
    role
) => {


    const result = await createUserWithEmailAndPassword(

        auth,

        email,

        password

    );


    const uid = result.user.uid;



    await setDoc(

        doc(
            db,
            "users",
            uid
        ),

        {

            name: name,

            email: email,

            role: role

        }

    );



    return {

        uid: uid,

        name: name,

        email: email,

        role: role

    };


};




// Login User

export const loginUser = async (
    email,
    password
) => {


    const result = await signInWithEmailAndPassword(

        auth,

        email,

        password

    );


    const uid = result.user.uid;



    const userDoc = await getDoc(

        doc(
            db,
            "users",
            uid
        )

    );



    if(userDoc.exists()){


        return {

            uid: uid,

            ...userDoc.data()

        };


    }



    throw new Error(
        "User role not found"
    );


};




// Logout

export const logoutUser = async()=>{


    await signOut(auth);


};