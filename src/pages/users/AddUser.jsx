import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

function AddUser() {

    const [uid, setUid] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("staff");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await setDoc(doc(db, "users", uid), {

                name,
                email,
                role

            });

            alert("User added successfully.");

            setUid("");
            setName("");
            setEmail("");
            setRole("staff");

        } catch (error) {

            alert(error.message);

        }

    };

    return (

        <div className="dashboard-content">

            <h1>Add User</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    placeholder="Firebase UID"
                    value={uid}
                    onChange={(e) => setUid(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                </select>

                <button type="submit">
                    Save User
                </button>

            </form>

        </div>

    );

}

export default AddUser;