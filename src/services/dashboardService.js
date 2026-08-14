import {
    collection,
    getDocs
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";



// Count Products

export const getProductCount = async()=>{


    const snapshot = await getDocs(
        collection(db,"products")
    );


    return snapshot.size;

};





// Count Categories

export const getCategoryCount = async()=>{


    const snapshot = await getDocs(
        collection(db,"categories")
    );


    return snapshot.size;

};





// Count Users

export const getUserCount = async()=>{


    const snapshot = await getDocs(
        collection(db,"users")
    );


    return snapshot.size;

};





// Sales data

export const getSalesData = async()=>{


    const snapshot = await getDocs(
        collection(db,"sales")
    );


    let revenue = 0;


    snapshot.forEach((doc)=>{


        const sale = doc.data();


        revenue += sale.total || 0;


    });



    return {

        count: snapshot.size,

        revenue: revenue

    };


};