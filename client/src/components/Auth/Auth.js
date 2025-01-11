import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { LoginRounded, AppRegistration } from '@mui/icons-material';
import axios from 'axios';
import './Auth.css';

const Auth = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loginstatus, setLoginStatus] = useState({
    isLogin: true,
    isRegister: false,
  });

  const navigate = useNavigate();

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleMobile = (e) => {
    setMobile(e.target.value);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const base64 = await convertImageToBase64(file);
      setImage(base64);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleLogin = () => {
    setLoginStatus((prevState) => ({ ...prevState, isLogin: true, isRegister: false }));
    setName('');
    setEmail('');
    setPassword('');
    setMobile('');
    setImage(null);
    setImagePreview(null);
  };

  const handleRegister = () => {
    setLoginStatus((prevState) => ({ ...prevState, isLogin: false, isRegister: true }));
    setName('');
    setEmail('');
    setPassword('');
    setMobile('');
    setImage(null);
    setImagePreview(null);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/user/login', { email, password });
      console.log(response);
      const token = response.data.token;
      localStorage.setItem('jwtToken', token);
      Swal.fire('Login Successful', 'Welcome!', 'success');
      navigate('/main');
    } catch (error) {
      Swal.fire('Error', 'Login failed. Please try again.', 'error');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: name,
        email: email,
        password: password,
        mobile: mobile,
        profilePicture: image || null,
        metadata: ""
      };
      await axios.post('http://localhost:5000/user/register', data);
      Swal.fire('Registration Successful', 'You can now log in.', 'success');
      handleLogin(); 
    } catch (error) {
      Swal.fire('Error', 'Registration failed. Please try again.', 'error');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 main-container">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg flex overflow-hidden">
        <div className="hidden md:block w-1/2 bg-gray-200 loginimg">
        </div>
        <div className="w-full md:w-1/2 p-6">
          <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
            {loginstatus.isLogin ? 'LOGIN' : 'REGISTRATION'}
          </h3>

          <div className="flex justify-center space-x-4 mb-6">
            <button
              className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 flex items-center space-x-2"
              onClick={handleLogin}
            >
              Login <LoginRounded />
            </button>
            <button
              className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 flex items-center space-x-2"
              onClick={handleRegister}
            >
              Register <AppRegistration />
            </button>
          </div>

          {loginstatus.isLogin ? (
            <form className="space-y-4" onSubmit={handleLoginSubmit}>
              <div>
                <label className="block text-gray-600 font-medium mb-1" htmlFor="loginEmail">
                  Email address
                </label>
                <input
                  id="loginEmail"
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
                  value={email}
                  onChange={handleEmail}
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1" htmlFor="loginPassword">
                  Password
                </label>
                <input
                  id="loginPassword"
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Password"
                  value={password}
                  onChange={handlePassword}
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Login
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleRegisterSubmit}>
              <div>
                <label className="block text-gray-600 font-medium mb-1" htmlFor="registerName">
                  Name
                </label>
                <input
                  id="registerName"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter name"
                  value={name}
                  onChange={handleName}
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1" htmlFor="registerPhone">
                  Phone
                </label>
                <input
                  id="registerPhone"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone"
                  value={mobile}
                  onChange={handleMobile}
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1" htmlFor="registerEmail">
                  Email address
                </label>
                <input
                  id="registerEmail"
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
                  value={email}
                  onChange={handleEmail}
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1" htmlFor="registerPassword">
                  Password
                </label>
                <input
                  id="registerPassword"
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Password"
                  value={password}
                  onChange={handlePassword}
                />
              </div>
              <div>
                <label className="block text-gray-600 font-medium mb-1" htmlFor="registerImage">
                  Profile Picture (optional)
                </label>
                <input
                  id="registerImage"
                  type="file"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleImageUpload}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 w-24 h-24 object-cover rounded"
                  />
                )}
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Register
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;