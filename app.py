from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_socketio import SocketIO, join_room, leave_room, send, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = ''
app.config['SQLALCHEMY_DATABASE_URI'] = ''
db = SQLAlchemy(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Apply CORS to the app
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

class UserPreference(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    activities = db.Column(db.String(200), nullable=False)
    dietary_restrictions = db.Column(db.String(200), nullable=False)
    budget_min = db.Column(db.Integer, nullable=False)
    budget_max = db.Column(db.Integer, nullable=False)
    family_friendly = db.Column(db.Boolean, nullable=False)
    pet_friendly = db.Column(db.Boolean, nullable=False)

# Wrap the database creation in the application context
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return "Welcome to the Travel Planner Application API"

@app.route('/api/user-preferences', methods=['POST'])
def save_preferences():
    data = request.get_json()
    new_preference = UserPreference(
        activities=data.get('activities', ''),
        dietary_restrictions=data.get('dietaryRestrictions', ''),
        budget_min=data.get('budget', [0, 0])[0],
        budget_max=data.get('budget', [0, 0])[1],
        family_friendly=data.get('familyFriendly', False),
        pet_friendly=data.get('petFriendly', False)
    )
    db.session.add(new_preference)
    db.session.commit()
    return jsonify({'message': 'Preferences saved successfully'}), 201

@app.route('/api/user-preferences', methods=['GET'])
def get_preferences():
    preferences = UserPreference.query.all()
    return jsonify([{
        'id': pref.id,
        'activities': pref.activities,
        'dietaryRestrictions': pref.dietary_restrictions,
        'budget': [pref.budget_min, pref.budget_max],
        'familyFriendly': pref.family_friendly,
        'petFriendly': pref.pet_friendly
    } for pref in preferences])

@app.route('/api/generate-itinerary', methods=['POST'])
def generate_itinerary():
    user_preferences = UserPreference.query.order_by(UserPreference.id.desc()).first()
    
    if not user_preferences:
        return jsonify({'message': 'No user preferences found'}), 404
    
    # Mock logic to generate itinerary based on user preferences
    itinerary = {
        'Day1': [
            {'activity': 'Visit museum', 'cost': 20, 'suitableFor': 'all'},
            {'activity': 'Lunch at a restaurant', 'cost': 50, 'suitableFor': 'all'},
            {'activity': 'Evening walk in the park', 'cost': 0, 'suitableFor': 'all'}
        ],
        'Day2': [
            {'activity': 'Go to the beach', 'cost': 0, 'suitableFor': 'all'},
            {'activity': 'Dinner at a family-friendly restaurant', 'cost': 50, 'suitableFor': 'families' if user_preferences.family_friendly else 'all'}
        ]
    }
    return jsonify(itinerary)

# Maintain the current itinerary state on the server
current_itinerary = []
current_users = []

# SocketIO events for collaborative itinerary planning
@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    current_users.append(username)
    send(username + ' has entered the room.', to=room)
    emit('update_itinerary', current_itinerary, to=request.sid)
    emit('update_users', current_users, to=room)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    current_users.remove(username)
    send(username + ' has left the room.', to=room)
    emit('update_users', current_users, to=room)

@socketio.on('update_itinerary')
def handle_update_itinerary(data):
    global current_itinerary
    current_itinerary = data['itinerary']
    room = data['room']
    send(current_itinerary, to=room)

if __name__ == '__main__':
    socketio.run(app, debug=True)
