import React, { useState } from "react";
import { database, collection, addDoc } from "../firebase";

function TripForm({ addTrip }) {
  const [Dplace, setDPlace] = useState("");
  const [Splace, setSPlace] = useState("");
  const [days, setDays] = useState("");
  const [price, setPrice] = useState("");
  const [companions, setCompanions] = useState("");
  const [mode, setMode] = useState("");
  const [type, setType] = useState("");
  const [numMembers, setNumMembers] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);

  const formatItineraryText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\#\#\#\#\#\s(.*)/g, "<h5>$1</h5>")
      .replace(/\#\#\#\#\s(.*)/g, "<h4>$1</h4>")
      .replace(/\#\#\#\s(.*)/g, "<h3>$1</h3>")
      .replace(/\#\#\s(.*)/g, "<h2>$1</h2>")
      .replace(/\#\s(.*)/g, "<h1>$1</h1>")
      .replace(/\n/g, "<br>");
  };

  const generateItinerary = async () => {
    setLoading(true);
    setItinerary("");

    const requestBody = {
      Dplace,
      Splace,
      days,
      price,
      mode,
      type,
      companions,
      numMembers,
    };

    try {
      const response = await fetch("http://localhost:5000/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (data.itinerary) {
        setItinerary(data.itinerary);
        setLoading(false);
        return data.itinerary;
      } else {
        const errorMsg = "Failed to generate itinerary. Please try again.";
        setItinerary(errorMsg);
        setLoading(false);
        return errorMsg;
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMsg = "Error generating itinerary.";
      setItinerary(errorMsg);
      setLoading(false);
      return errorMsg;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !Dplace.trim() ||
      !Splace.trim() ||
      !days ||
      !price ||
      !companions ||
      !mode ||
      !type
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const generatedItinerary = await generateItinerary();
    const newTrip = {
      Dplace,
      Splace,
      days,
      price,
      mode,
      type,
      companions,
      numMembers,
      itinerary: generatedItinerary,
    };

    try {
      const docRef = await addDoc(collection(database, "trips"), newTrip);
      console.log("Document written with ID: ", docRef.id);
      addTrip(newTrip);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div className="trip-form-container">
      <div className="trip-form-intro">
        <h2 className="form-heading">✈️ Let's Plan Your Dream Trip!</h2>
        <p className="form-description">
          Welcome to your personal travel planning assistant! Whether you're
          dreaming of a serene beach getaway, an adventurous mountain trek, or a
          cultural city exploration, we're here to make it happen. Our
          AI-powered system will craft a personalized itinerary based on your
          preferences, ensuring every moment of your journey is perfectly
          tailored to your desires. Just fill in a few details below, and let us
          create the perfect travel plan for you!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="trip-form">
        <h4 className="form-heading">
          Tell us a bit about your ideal getaway, and we'll craft a custom
          itinerary just for you!
        </h4>

        <label className="input-label">🏙️ Where are you starting from?</label>
        <input
          type="text"
          placeholder="Enter departure city"
          value={Splace}
          onChange={(e) => setSPlace(e.target.value)}
          className="input-field"
        />

        <label className="input-label">🌍 Where are you headed?</label>
        <input
          type="text"
          placeholder="Enter a destination (e.g., Manali, Goa)"
          value={Dplace}
          onChange={(e) => setDPlace(e.target.value)}
          className="input-field"
        />

        <label className="input-label">
          📅 How many days do you want to travel?
        </label>
        <input
          type="number"
          placeholder="Number of days (e.g., 5)"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="input-field"
        />

        <label className="input-label">💰 What's your budget?</label>
        <input
          type="number"
          placeholder="Budget in ₹ (e.g., 15000)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="input-field"
        />

        <label className="input-label">🚗 Mode of travel?</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="input-field"
        >
          <option value="">Select Mode</option>
          <option value="Self">Self Vehicle</option>
          <option value="Road">Bus</option>
          <option value="Ground">Train</option>
          <option value="Air">Flight</option>
          <option value="Sea">Ship</option>
        </select>

        <label className="input-label">🧑‍🤝‍🧑 Who's traveling with you?</label>
        <select
          value={companions}
          onChange={(e) => setCompanions(e.target.value)}
          className="input-field"
        >
          <option value="">Select Companion</option>
          <option value="Solo">Solo</option>
          <option value="Spouse">Spouse</option>
          <option value="Family">Family</option>
          <option value="Friends">Friends</option>
        </select>

        {(companions === "Family" || companions === "Friends") && (
          <>
            <label className="input-label">
              👨‍👩‍👧‍👦 How many people are in your group?
            </label>
            <input
              type="number"
              placeholder="Number of members"
              value={numMembers}
              onChange={(e) => setNumMembers(e.target.value)}
              className="input-field"
            />
          </>
        )}

        <label className="input-label">↔️ Type of Travel?</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="input-field"
        >
          <option value="">Select Type</option>
          <option value="Single">Single trip</option>
          <option value="Round">Round Trip</option>
        </select>

        <button type="submit" className="submit-button">
          {loading ? "Generating..." : "Generate Itinerary"}
        </button>
      </form>

      {itinerary && (
        <div className="itinerary-container">
          <div className="itinerary-header">
            <h2>Your Personalized Travel Plan</h2>
            <p className="destination-title">Destination: {Dplace}</p>
            <div className="trip-meta">
              <span>🗓️ {days} Days</span>
              <span>👥 {companions}</span>
              <span>💰 ₹{price}</span>
            </div>
          </div>
          <div
            className="itinerary-content"
            dangerouslySetInnerHTML={{ __html: formatItineraryText(itinerary) }}
          />
          <style jsx>{`
            .itinerary-container {
              background: var(--itinerary-bg, white);
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              padding: 2rem;
              margin-top: 2rem;
              max-width: 800px;
              margin-left: auto;
              margin-right: auto;
              color: var(--itinerary-text, #444);
            }

            .itinerary-header {
              text-align: center;
              margin-bottom: 2rem;
              padding-bottom: 1rem;
              border-bottom: 2px solid var(--itinerary-border, #f0f0f0);
            }

            .itinerary-header h2 {
              color: var(--itinerary-title, #2c3e50);
              margin-bottom: 0.5rem;
              font-size: 1.8rem;
            }

            .destination-title {
              font-size: 1.4rem;
              color: var(--itinerary-accent, #3498db);
              margin: 0.5rem 0;
            }

            .trip-meta {
              display: flex;
              justify-content: center;
              gap: 2rem;
              margin-top: 1rem;
            }

            .trip-meta span {
              background: var(--itinerary-meta-bg, #f8f9fa);
              padding: 0.5rem 1rem;
              border-radius: 20px;
              font-size: 0.9rem;
              color: var(--itinerary-meta-text, #666);
            }

            .itinerary-content {
              line-height: 1.6;
            }

            .itinerary-content h1 {
              font-size: 2rem;
              color: var(--itinerary-title, #2c3e50);
              margin: 2rem 0 1rem;
              border-bottom: 2px solid var(--itinerary-border, #eee);
              padding-bottom: 0.5rem;
            }

            .itinerary-content h2 {
              font-size: 1.6rem;
              color: var(--itinerary-title, #2c3e50);
              margin: 1.5rem 0 1rem;
            }

            .itinerary-content h3 {
              font-size: 1.4rem;
              color: var(--itinerary-accent, #3498db);
              margin: 1.2rem 0 0.8rem;
            }

            .itinerary-content h4 {
              font-size: 1.2rem;
              color: var(--itinerary-title, #2c3e50);
              margin: 1rem 0 0.6rem;
            }

            .itinerary-content h5 {
              font-size: 1.1rem;
              color: var(--itinerary-meta-text, #666);
              margin: 0.8rem 0 0.5rem;
            }

            .itinerary-content strong {
              color: var(--itinerary-title, #2c3e50);
              font-weight: 600;
            }

            .itinerary-content em {
              font-style: italic;
              color: var(--itinerary-meta-text, #666);
            }

            [data-theme="light"] {
              --itinerary-bg: white;
              --itinerary-text: #444;
              --itinerary-title: #2c3e50;
              --itinerary-accent: #3498db;
              --itinerary-border: #f0f0f0;
              --itinerary-meta-bg: #f8f9fa;
              --itinerary-meta-text: #666;
            }

            [data-theme="dark"] {
              --itinerary-bg: #2d2d2d;
              --itinerary-text: #e0e0e0;
              --itinerary-title: #ffffff;
              --itinerary-accent: #64b5f6;
              --itinerary-border: #404040;
              --itinerary-meta-bg: #404040;
              --itinerary-meta-text: #b0b0b0;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

export default TripForm;
