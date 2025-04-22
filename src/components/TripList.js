import React, { useState } from "react";

function TripList({ trips, deleteTrip }) {
  const [expandedTrip, setExpandedTrip] = useState(null);

  const toggleExpand = (tripId) => {
    setExpandedTrip(expandedTrip === tripId ? null : tripId);
  };

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

  return (
    <div className="trip-list-container">
      <div className="trip-list-intro">
        <h2 className="list-heading">📜 Your Travel Chronicles</h2>
        <p className="list-description">
          Welcome to your personal travel archive! Here you'll find all your
          carefully crafted itineraries, each one a unique story waiting to be
          told. From spontaneous weekend getaways to meticulously planned
          adventures, every journey holds its own magic. Relive your past trips,
          get inspired for future ones, or simply reminisce about the wonderful
          memories you've created. Your next great adventure is just a click
          away!
        </p>
      </div>

      {trips.length === 0 ? (
        <div className="no-trips-container">
          <p className="no-trips">No trips planned yet.</p>
          <p className="no-trips-suggestion">
            Ready to start your next adventure? Head back to create your first
            personalized itinerary!
          </p>
        </div>
      ) : (
        <div className="trip-cards">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className={`trip-card ${
                expandedTrip === trip.id ? "expanded" : ""
              }`}
            >
              <div
                className="trip-card-header"
                onClick={() => toggleExpand(trip.id)}
              >
                <div className="trip-info">
                  <h3>
                    ✈️ Trip to {trip.Dplace} from {trip.Splace}
                  </h3>
                  <div className="trip-meta">
                    <span>🗓️ {trip.days} Days</span>
                    <span>👥 {trip.companions}</span>
                    <span>💰 ₹{trip.price}</span>
                  </div>
                </div>
                <button className="expand-btn">
                  {expandedTrip === trip.id ? "▼" : "▶"}
                </button>
              </div>

              {expandedTrip === trip.id && (
                <div className="trip-details">
                  <div
                    className="itinerary-content"
                    dangerouslySetInnerHTML={{
                      __html: formatItineraryText(trip.itinerary),
                    }}
                  />
                  <button
                    className="delete-btn"
                    onClick={() => deleteTrip(trip.id)}
                  >
                    Delete Trip
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <style jsx>{`
        .trip-list-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }

        .trip-list-container h2 {
          text-align: center;
          color: var(--heading-color);
          margin-bottom: 2rem;
        }

        .no-trips {
          text-align: center;
          color: var(--text-muted-color);
          font-size: 1.2rem;
        }

        .trip-cards {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .trip-card {
          background: var(--card-background);
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .trip-card.expanded {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .trip-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          cursor: pointer;
          background: var(--header-background);
        }

        .trip-info h3 {
          margin: 0;
          color: var(--heading-color);
          font-size: 1.4rem;
        }

        .trip-meta {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .trip-meta span {
          background: var(--meta-background);
          padding: 0.3rem 0.8rem;
          border-radius: 15px;
          font-size: 0.9rem;
          color: var(--meta-text-color);
        }

        .expand-btn {
          background: none;
          border: none;
          font-size: 1.2rem;
          color: var(--button-text-color);
          cursor: pointer;
          padding: 0.5rem;
        }

        .trip-details {
          padding: 1.5rem;
          border-top: 1px solid var(--border-color);
        }

        .itinerary-content {
          line-height: 1.6;
          color: var(--text-color);
          margin-bottom: 1.5rem;
        }

        .itinerary-content h1 {
          font-size: 1.8rem;
          color: var(--heading-color);
          margin: 1.5rem 0 1rem;
          border-bottom: 2px solid #eee;
          padding-bottom: 0.5rem;
        }

        .itinerary-content h2 {
          font-size: 1.6rem;
          color: var(--heading-color);
          margin: 1.2rem 0 0.8rem;
        }

        .itinerary-content h3 {
          font-size: 1.4rem;
          color: var(--highlight-color);
          margin: 1rem 0 0.6rem;
        }

        .itinerary-content h4 {
          font-size: 1.2rem;
          color: var(--heading-color);
          margin: 0.8rem 0 0.5rem;
        }

        .itinerary-content h5 {
          font-size: 1.1rem;
          color: var(--text-muted-color);
          margin: 0.6rem 0 0.4rem;
        }

        .itinerary-content strong {
          color: var(--strong-text-color);
          font-weight: 600;
        }

        .itinerary-content em {
          font-style: italic;
          color: var(--italic-text-color);
        }

        .delete-btn {
          background: var(--delete-btn-bg);
          color: var(--delete-btn-bg);
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.3s;
        }

        .delete-btn:hover {
          background: var(--delete-btn-hover-bg);
        }

        /* Light theme */
        .light-theme {
          --heading-color: #2c3e50;
          --text-muted-color: #666;
          --card-background: white;
          --header-background: #f8f9fa;
          --meta-background: #f1f3f5;
          --meta-text-color: #495057;
          --button-text-color: #495057;
          --text-color: #444;
          --highlight-color: #3498db;
          --strong-text-color: #2c3e50;
          --italic-text-color: #666;
          --border-color: #f1f3f5;
          --delete-btn-bg: #ff4444;
          --delete-btn-hover-bg: #cc0000;
        }

        /* Dark theme */
        .dark-theme {
          --heading-color: #ecf0f1;
          --text-muted-color: #aaa;
          --card-background: #2c3e50;
          --header-background: #34495e;
          --meta-background: #34495e;
          --meta-text-color: #ecf0f1;
          --button-text-color: #ecf0f1;
          --text-color: #ecf0f1;
          --highlight-color: #2980b9;
          --strong-text-color: #ecf0f1;
          --italic-text-color: #aaa;
          --border-color: #34495e;
          --delete-btn-bg: #ff4444;
          --delete-btn-hover-bg: #cc0000;
        }

        @media (max-width: 768px) {
          .trip-list-container {
            padding: 1rem;
          }

          .trip-card-header {
            padding: 1rem;
          }

          .trip-meta {
            flex-wrap: wrap;
          }

          .trip-meta span {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}

export default TripList;
