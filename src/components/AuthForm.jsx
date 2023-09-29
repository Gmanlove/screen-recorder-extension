import React, { useState } from "react";
import { auth } from ".././firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import "font-awesome/css/font-awesome.min.css";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);

  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFacebookSignIn = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignUp) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log(userCredential);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log(userCredential);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="container mt-6">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className=" p-4 rounded">
            <h1 className="mb-5">Create an Account</h1>
            <p>
              Join millions of others in sharing successful moves on HelpMeOut.
            </p>

            <button
              type="button"
              className="btn btn-outline-dark btn-block mb-4 d-flex align-items-center justify-content-center w-100"
              onClick={handleGoogleSignIn}
            >
              <img
                src="/images/google.png"
                alt="Google Logo"
                className="me-2"
                style={{ width: "30px", height: "30px" }}
              />
              Continue with Google
            </button>
            <button
              type="button"
              className="btn btn-outline-dark btn-block mb-4 d-flex align-items-center justify-content-center w-100"
              onClick={handleFacebookSignIn}
            >
              <img
                src="/images/facebook.png"
                alt="Facebook Logo"
                className="me-2"
                style={{ width: "30px", height: "30px" }}
              />
              Continue with Facebook
            </button>

            <div className="mb-4 d-flex align-items-center">
              <hr className="flex-grow-1" />
              <span className="px-3">or</span>
              <hr className="flex-grow-1" />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-success mb-4 w-100" style={{ backgroundColor: '#120B48' }}>
              Create Account
            </button>

          </form>
          <div className="text-center mb-2">
  <p style={{ textDecoration: 'underline', display: 'inline-block' }}>
    Continue as a Guest
  </p>
</div>

        </div>
      </div>
    </div>
  );
};

export default AuthForm;
