import axios from "axios";
import { Link } from "react-router-dom";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import './Form.css';

// const API_BASE = "https://mern-stack-website-2ku3.onrender.com";

function Login(){

    const [email,setEmail] = useState(); 
    const [password,setPassword] = useState();
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post(`https://mern-stack-website-59no.onrender.com/login`, { email, password })
        .then(result => {
            if (result.data.success) {
              localStorage.setItem('token', result.data.token);
              navigate('/add-agent');
            } else {
              setError(result.data.error);
            }
          })
          .catch(err => setError('Login failed'));
    }

    return(
        <>

        <div className="container mt-5 form-container">
          <h1 className="mb-4">Login</h1>
          <form onSubmit={handleSubmit} className="p-4 rounded shadow-sm bg-light">
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-100">Submit</button>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </form>
          {/* <p className="mt-3">Create an account <Link to="/register">SignUp</Link></p> */}
        </div>
        </>
        

    );
}
export default Login;