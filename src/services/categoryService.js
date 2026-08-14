import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    getDoc,
    updateDoc
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";


const categoryCollection = collection(
    db,
    "categories"
);


// Add Category
export const addCategory = async(category)=>{

    return await addDoc(
        categoryCollection,
        category
    );

};



// Get Categories
export const getCategories = async()=>{


    const snapshot = await getDocs(
        categoryCollection
    );


    return snapshot.docs.map((item)=>({

        id:item.id,

        ...item.data()

    }));

};



// Get one category
export const getCategoryById = async(id)=>{


    const categoryRef = doc(
        db,
        "categories",
        id
    );


    const categorySnap = await getDoc(
        categoryRef
    );


    if(categorySnap.exists()){


        return {

            id: categorySnap.id,

            ...categorySnap.data()

        };

    }


    return null;

};



// Update Category
export const updateCategory = async(id, category)=>{


    await updateDoc(

        doc(
            db,
            "categories",
            id
        ),

        category

    );

};



// Delete Category
export const deleteCategory = async(id)=>{


    await deleteDoc(

        doc(
            db,
            "categories",
            id
        )

    );

};