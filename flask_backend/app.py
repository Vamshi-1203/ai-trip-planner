from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = "ADD_YOUR_KEY"

@app.route("/generate-itinerary", methods=["POST"])
def generate_itinerary():
    data = request.json
    Dplace = data.get("Dplace")
    Splace = data.get("Splace")
    days = data.get("days")
    budget = data.get("price")
    mode = data.get("mode")
    type = data.get("type")
    companions = data.get("companions")
    members = data.get("members", "N/A")

    if companions in ["family", "friends"]:
        members = data.get("members",1)        

    if not Dplace or not Splace or not days or not budget or not mode or not type or not companions:
        return jsonify({"error": "All fields are required"}), 400

    mode_description = {
    "Self": "using their own vehicle (car/bike), allowing flexible road travel and sightseeing",
    "Air": "by flight (fastest travel time, suitable for distant locations)",
    "Ground": "by train (budget-friendly and suitable for long-distance travel)",
    "Road": "by bus or shared road transport (budget travel with limited flexibility)",
    "Sea": "via sea route or ferry, if applicable"
    }.get(mode, "using the most appropriate means of travel")

    prompt = f"""
    Generate a comprehensive and budget-conscious {days}-day itinerary for {companions} travelers ({members} members) going from {Splace} to {Dplace}, traveling {mode_description}, with a total budget of ₹{budget} for {type}.
    The itinerary should include:
    - Travel suggestions (optimize time and cost)
    - Sightseeing and local food recommendations
    - Daily breakdown of activities
    - Consider safety and comfort for {companions} type
    """

    url = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "model": "gemini-1.5-pro",
        "contents": [{"role": "user", "parts": [{"text": prompt}]}]
    }

    response = requests.post(url, json=payload, headers=headers)
    result = response.json()

    if "candidates" in result and len(result["candidates"]) > 0:
        itinerary = result["candidates"][0]["content"]["parts"][0]["text"]
        return jsonify({"itinerary": itinerary})

    return jsonify({"error": "Failed to generate itinerary"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
