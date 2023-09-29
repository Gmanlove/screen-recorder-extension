import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthDetails = () => {
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        navigate("/gallery"); // Redirect to images display if authenticated
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    };
  }, [navigate]);

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out successful");
        navigate("/signin"); // Redirect to signin after sign out
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          {authUser ? (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{`Signed In as ${authUser.email}`}</h5>
                <button className="btn btn-primary" onClick={userSignOut}>
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body">
                <p className="card-text">Signed Out</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthDetails;