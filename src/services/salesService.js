import {
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    onSnapshot,
    query,
    orderBy
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";


const salesCollection = collection(
    db,
    "sales"
);



// Add Sale

export const addSale = async (sale) => {

    return await addDoc(
        salesCollection,
        sale
    );

};





// Get all sales (normal)

export const getSales = async () => {

    const q = query(
        salesCollection,
        orderBy("date", "desc")
    );


    const snapshot = await getDocs(q);


    return snapshot.docs.map((item) => ({

        id: item.id,

        ...item.data()

    }));

};






// Real-time sales update

export const listenToSales = (callback) => {


    const q = query(
        salesCollection,
        orderBy("date", "desc")
    );



    const unsubscribe = onSnapshot(
        q,
        (snapshot) => {


            const sales = snapshot.docs.map((item)=>({

                id: item.id,

                ...item.data()

            }));



            callback(sales);


        }
    );



    return unsubscribe;


};






// Get single sale

export const getSaleById = async(id)=>{


    const saleRef = doc(

        db,

        "sales",

        id

    );


    const saleSnap = await getDoc(
        saleRef
    );


    if(saleSnap.exists()){


        return {

            id: saleSnap.id,

            ...saleSnap.data()

        };

    }


    return null;

};