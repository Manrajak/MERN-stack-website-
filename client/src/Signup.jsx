import Axios from "axios";
import { Link } from "react-router-dom";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

function Signup(){
    const [name,setName] = useState();
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault()
        Axios.post('https://mern-stack-website-59no.onrender.com/register', { name, email, password })
        .then(result => {console.log(result)
            if(result.data === "email alredy there!")alert("email alredy there!");
            navigate('/login')
        })
        .catch(err =>console.log('hii ', err))
    }

    return(
        <>

        <div>
            <h1>Register</h1>
        <form onSubmit ={handleSubmit}>
            <label htmlFor="Name">
                name : 
            </label>
            <input type="text" 
             onChange = {(e) => setName(e.target.value)}/>

            <br>
            </br>
            <label htmlFor="Name">
                Email : 
            </label>
            <input type="Email" 
            onChange = {(e) => setEmail(e.target.value)}/>

<br>
</br>
            <label htmlFor="Password">
                Password : 
            </label>
            <input type="password"
             onChange = {(e) => setPassword(e.target.value)}/>
<br/>
            <button type = "submit">Submit</button>

        </form>

        <p>Already have a account </p>

        <Link to="/login">
        Login</Link>
    </div>
        </>
    );
}

export default Signup;