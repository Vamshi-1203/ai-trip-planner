import React, { useState, useEffect, createContext, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";
import TripForm from "./components/TripForm";
import TripList from "./components/TripList";
import Auth from "./components/Auth";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, push, onValue, remove } from "firebase/database";
import "./App.css";
import { app } from "./firebase";
import useLocalStorage from "use-local-storage-state";

const ThemeContext = createContext();

function App() {
  const [trips, setTrips] = useState([]);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const auth = getAuth(app);
  const database = getDatabase(app);
  const [theme, setTheme] = useLocalStorage("theme", "system");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      const profileContainer = document.querySelector(".profile-container");
      if (profileContainer && !profileContainer.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset dropdown state when user changes
  useEffect(() => {
    setDropdownOpen(false);
  }, [user]);

  const loadTrips = useCallback(
    (uid) => {
      const tripsRef = ref(database, `trips/${uid}`);
      onValue(tripsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const tripList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setTrips(tripList);
        } else {
          setTrips([]);
        }
      });
    },
    [database]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        loadTrips(user.uid);
      } else {
        setUser(null);
        setTrips([]);
      }
    });

    return () => unsubscribe();
  }, [auth, loadTrips]);

  const addTrip = async (trip) => {
    if (user) {
      const tripsRef = ref(database, `trips/${user.uid}`);
      push(tripsRef, trip);
    }
  };

  const deleteTrip = async (id) => {
    if (user) {
      const tripRef = ref(database, `trips/${user.uid}/${id}`);
      remove(tripRef);
    }
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        navigate("/");
      })
      .catch((error) => {
        console.error("Sign-out error:", error);
      });
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className="App">
        {/* Show navbar only when user is logged in */}
        {user && (
          <nav className="navbar">
            <div className="navbar-brand">
              <Link to="/" className="navbar-title">
                ✈️ AI Trip Planner
              </Link>
            </div>
            <div className="navbar-buttons">
              {user && (
                <button
                  onClick={() =>
                    navigate(
                      window.location.pathname === "/previous-trips"
                        ? -1
                        : "/previous-trips"
                    )
                  }
                >
                  {window.location.pathname === "/previous-trips"
                    ? "🏠 Home"
                    : "📜 History"}
                </button>
              )}
              <button className="theme-toggle" onClick={toggleTheme}>
                {theme === "dark" ? <FaSun /> : <FaMoon />}
              </button>
              {/* Profile Dropdown */}
              {user && (
                <div className="profile-container">
                  <div
                    className="profile-icon"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="User"
                        className="profile-img"
                      />
                    ) : user.displayName ? (
                      user.displayName[0]
                    ) : (
                      user.email[0]
                    )}
                  </div>

                  {dropdownOpen && (
                    <div className="profile-card">
                      <div className="profile-card-header">
                        <div className="profile-img-container">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt="User"
                              className="profile-card-img"
                            />
                          ) : (
                            <div className="profile-initials">
                              {user.displayName
                                ? user.displayName[0]
                                : user.email[0]}
                            </div>
                          )}
                        </div>
                        <div className="profile-card-header-info">
                          <h3>{user.displayName || "User"}</h3>
                          <p>{user.email}</p>
                        </div>
                      </div>

                      <div className="profile-card-body">
                        <p>
                          <strong>Email:</strong> {user.email}
                        </p>
                        <p>
                          <strong>Joined:</strong> {user.metadata.creationTime}
                        </p>
                      </div>

                      <div className="profile-card-footer">
                        <button className="logout-btn" onClick={handleSignOut}>
                          🚪 Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>
        )}

        <div className="main-content">
          {/* Show this when user is NOT logged in */}
          {!user && (
            <div className="login-container">
              <h1>Welcome to AI Trip Planner ✈️</h1>
              <p>Your AI-powered assistant for planning the perfect trip.</p>
              <p>
                Sign in to generate personalized itineraries based on your
                preferences and budget.
              </p>
              <Auth />
            </div>
          )}

          {/* Routes for logged-in users */}
          {user && (
            <Routes>
              <Route path="/" element={<TripForm addTrip={addTrip} />} />
              <Route
                path="/previous-trips"
                element={<TripList trips={trips} deleteTrip={deleteTrip} />}
              />
            </Routes>
          )}
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default function ThemedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
