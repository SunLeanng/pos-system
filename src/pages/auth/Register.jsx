import { useState } from "react";
import { registerUser } from "../../services/authService";

function Register() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {

        try {

            await registerUser(email, password);

            alert("Register success");

        } catch (error) {

            alert(error.message);

        }

    };


    return (
        <div className="login-container">

            <h1>Register</h1>


            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
            />


            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
            />


            <button onClick={handleRegister}>
                Register
            </button>

        </div>
    );
}


export default Register;