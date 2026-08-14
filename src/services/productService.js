import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    getDoc
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";


const productCollection = collection(db, "products");


// Add Product
export const addProduct = async (product) => {

    return await addDoc(
        productCollection,
        product
    );

};


// Get Products
export const getProducts = async () => {

    const snapshot = await getDocs(
        productCollection
    );


    return snapshot.docs.map((item) => ({

        id: item.id,

        ...item.data()

    }));

};



// Get Single Product
export const getProductById = async (id) => {

    const productRef = doc(
        db,
        "products",
        id
    );


    const productSnap = await getDoc(productRef);


    if(productSnap.exists()){

        return {

            id: productSnap.id,

            ...productSnap.data()

        };

    }


    return null;

};



// Update Product
export const updateProduct = async (id, product) => {


    const productRef = doc(
        db,
        "products",
        id
    );


    await updateDoc(

        productRef,

        product

    );

};



// Delete Product
export const deleteProduct = async (id) => {


    await deleteDoc(

        doc(
            db,
            "products",
            id
        )

    );

};