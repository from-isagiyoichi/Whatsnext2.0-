# Flask Backend for WhatNext? (WN?) Events App
# This file should be deployed separately on a Python hosting service


from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
import secrets
import qrcode
import io
import base64
from functools import wraps

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///whatsnext.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')

db = SQLAlchemy(app)

# ============================================================================
# DATABASE MODELS
# ============================================================================

class Student(db.Model):
    __tablename__ = 'students'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password = db.Column(db.String(200), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    roll_number = db.Column(db.String(50), nullable=True)
    department = db.Column(db.String(50), default='EEE')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    bookings = db.relationship('Booking', backref='student', lazy=True, cascade='all, delete-orphan')
    notifications = db.relationship('Notification', backref='student', lazy=True, cascade='all, delete-orphan')

class Event(db.Model):
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    subtitle = db.Column(db.String(200))
    description = db.Column(db.Text)
    date = db.Column(db.String(50), nullable=False)
    time = db.Column(db.String(50), nullable=False)
    venue = db.Column(db.String(200), nullable=False)
    image_url = db.Column(db.String(500))
    category = db.Column(db.String(20), default='live')  # 'live' or 'coming-soon'
    early_bird_price = db.Column(db.Float, default=0)
    regular_price = db.Column(db.Float, default=0)
    early_bird_deadline = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    coordinators = db.relationship('Coordinator', backref='event', lazy=True, cascade='all, delete-orphan')
    bookings = db.relationship('Booking', backref='event', lazy=True, cascade='all, delete-orphan')

class Coordinator(db.Model):
    __tablename__ = 'coordinators'
    
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100))
    email = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    image_url = db.Column(db.String(500))
    linkedin = db.Column(db.String(200))
    instagram = db.Column(db.String(200))
    twitter = db.Column(db.String(200))

class Booking(db.Model):
    __tablename__ = 'bookings'
    
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    ticket_type = db.Column(db.String(20), nullable=False)  # 'earlyBird' or 'regular'
    quantity = db.Column(db.Integer, default=1)
    total_price = db.Column(db.Float, nullable=False)
    qr_code = db.Column(db.Text)  # Base64 encoded QR code
    booking_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='confirmed')  # confirmed, cancelled

class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text)
    type = db.Column(db.String(20), default='info')  # success, info, warning
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# ============================================================================
# AUTHENTICATION MIDDLEWARE
# ============================================================================

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            # Simple token validation (email-based)
            # In production, use JWT tokens
            email = token.replace('Bearer ', '')
            current_user = Student.query.filter_by(email=email).first()
            
            if not current_user:
                return jsonify({'error': 'Invalid token'}), 401
                
        except Exception as e:
            return jsonify({'error': 'Token validation failed'}), 401
            
        return f(current_user, *args, **kwargs)
    
    return decorated

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def generate_qr_code(booking_id, event_title, student_name):
    """Generate QR code for ticket"""
    qr_data = f"BOOKING:{booking_id}|EVENT:{event_title}|STUDENT:{student_name}"
    
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(qr_data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Convert to base64
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    img_str = base64.b64encode(buffer.getvalue()).decode()
    
    return f"data:image/png;base64,{img_str}"

def load_authorized_students(file_path='student-list.txt'):
    """Load authorized students from text file"""
    students = []
    try:
        with open(file_path, 'r') as f:
            lines = f.readlines()
            for i in range(0, len(lines), 2):
                if i + 1 < len(lines):
                    email = lines[i].strip()
                    password = lines[i + 1].strip()
                    if email and password:
                        students.append({'email': email, 'password': password})
    except FileNotFoundError:
        print(f"Warning: {file_path} not found")
    
    return students

def init_database():
    """Initialize database with students and events"""
    with app.app_context():
        # Create tables
        db.create_all()
        
        # Check if students already exist
        if Student.query.count() == 0:
            # Load students from file
            authorized_students = load_authorized_students()
            
            for student_data in authorized_students:
                # Extract name from email
                name_part = student_data['email'].split('.')[0]
                name = name_part.replace('b25ee', '').title()
                
                student = Student(
                    email=student_data['email'],
                    password=generate_password_hash(student_data['password']),
                    name=name,
                    department='EEE'
                )
                db.session.add(student)
            
            db.session.commit()
            print(f"Added {len(authorized_students)} students to database")
        
        # Add sample events if none exist
        if Event.query.count() == 0:
            events_data = [
                {
                    'title': 'CROSSROADS',
                    'subtitle': 'TECHNO-CULTURAL FEST OF MBCET',
                    'description': 'Join us for the biggest techno-cultural fest of the year!',
                    'date': 'March 15, 2026',
                    'time': '10:00 AM - 8:00 PM',
                    'venue': 'MBCET Main Auditorium, Trivandrum',
                    'category': 'live',
                    'early_bird_price': 199,
                    'regular_price': 299,
                    'early_bird_deadline': 'March 12, 2026',
                    'image_url': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'
                },
                {
                    'title': 'TRYDAN',
                    'subtitle': 'EEE DEPARTMENT TECH FEST',
                    'description': 'A national level technical fest conducted by EEE Department.',
                    'date': 'April 5, 2026',
                    'time': '9:00 AM - 5:00 PM',
                    'venue': 'MBCET Campus, Trivandrum',
                    'category': 'live',
                    'early_bird_price': 199,
                    'regular_price': 299,
                    'early_bird_deadline': 'April 2, 2026',
                    'image_url': 'https://images.unsplash.com/photo-1717962690206-2d2f6ddac9db'
                }
            ]
            
            for event_data in events_data:
                event = Event(**event_data)
                db.session.add(event)
            
            db.session.commit()
            print(f"Added {len(events_data)} events to database")

# ============================================================================
# API ROUTES - AUTHENTICATION
# ============================================================================

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login endpoint"""
    data = request.get_json()
    email = data.get('email', '').strip()
    password = data.get('password', '').strip()
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    
    student = Student.query.filter_by(email=email).first()
    
    if not student or not check_password_hash(student.password, password):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # Return user data (in production, return JWT token)
    return jsonify({
        'user': {
            'id': student.id,
            'name': student.name,
            'email': student.email,
            'department': student.department
        },
        'token': student.email  # Simple token (use JWT in production)
    }), 200

@app.route('/api/auth/validate', methods=['GET'])
@token_required
def validate_token(current_user):
    """Validate authentication token"""
    return jsonify({
        'valid': True,
        'user': {
            'id': current_user.id,
            'name': current_user.name,
            'email': current_user.email,
            'department': current_user.department
        }
    }), 200

# ============================================================================
# API ROUTES - EVENTS
# ============================================================================

@app.route('/api/events', methods=['GET'])
@token_required
def get_events(current_user):
    """Get all events"""
    events = Event.query.all()
    
    events_list = []
    for event in events:
        coordinators = []
        for coord in event.coordinators:
            coordinators.append({
                'id': coord.id,
                'name': coord.name,
                'role': coord.role,
                'email': coord.email,
                'phone': coord.phone,
                'image': coord.image_url,
                'social': {
                    'linkedin': coord.linkedin,
                    'instagram': coord.instagram,
                    'twitter': coord.twitter
                }
            })
        
        events_list.append({
            'id': str(event.id),
            'title': event.title,
            'subtitle': event.subtitle,
            'description': event.description,
            'date': event.date,
            'time': event.time,
            'venue': event.venue,
            'image': event.image_url,
            'category': event.category,
            'price': {
                'earlyBird': event.early_bird_price,
                'regular': event.regular_price
            },
            'earlyBirdDeadline': event.early_bird_deadline,
            'coordinators': coordinators
        })
    
    return jsonify(events_list), 200

@app.route('/api/events/<int:event_id>', methods=['GET'])
@token_required
def get_event(current_user, event_id):
    """Get single event by ID"""
    event = Event.query.get_or_404(event_id)
    
    coordinators = []
    for coord in event.coordinators:
        coordinators.append({
            'id': coord.id,
            'name': coord.name,
            'role': coord.role,
            'email': coord.email,
            'phone': coord.phone,
            'image': coord.image_url,
            'social': {
                'linkedin': coord.linkedin,
                'instagram': coord.instagram,
                'twitter': coord.twitter
            }
        })
    
    return jsonify({
        'id': str(event.id),
        'title': event.title,
        'subtitle': event.subtitle,
        'description': event.description,
        'date': event.date,
        'time': event.time,
        'venue': event.venue,
        'image': event.image_url,
        'category': event.category,
        'price': {
            'earlyBird': event.early_bird_price,
            'regular': event.regular_price
        },
        'earlyBirdDeadline': event.early_bird_deadline,
        'coordinators': coordinators
    }), 200

# ============================================================================
# API ROUTES - BOOKINGS
# ============================================================================

@app.route('/api/bookings', methods=['POST'])
@token_required
def create_booking(current_user):
    """Create new booking(s)"""
    data = request.get_json()
    cart_items = data.get('items', [])
    
    if not cart_items:
        return jsonify({'error': 'Cart is empty'}), 400
    
    bookings = []
    
    for item in cart_items:
        event = Event.query.get(item['eventId'])
        if not event:
            continue
        
        ticket_type = item['ticketType']
        quantity = item['quantity']
        
        # Calculate total price
        if ticket_type == 'earlyBird':
            total_price = event.early_bird_price * quantity
        else:
            total_price = event.regular_price * quantity
        
        # Generate unique booking ID
        booking_id = f"BK{datetime.now().strftime('%Y%m%d')}{secrets.token_hex(4).upper()}"
        
        # Generate QR code
        qr_code = generate_qr_code(booking_id, event.title, current_user.name)
        
        # Create booking
        booking = Booking(
            booking_id=booking_id,
            student_id=current_user.id,
            event_id=event.id,
            ticket_type=ticket_type,
            quantity=quantity,
            total_price=total_price,
            qr_code=qr_code
        )
        
        db.session.add(booking)
        bookings.append(booking)
    
    # Create notification
    notification = Notification(
        student_id=current_user.id,
        title='Booking Confirmed',
        message=f'You have successfully booked {len(bookings)} ticket(s). Check your tickets section.',
        type='success'
    )
    db.session.add(notification)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Bookings created successfully',
        'count': len(bookings)
    }), 201

@app.route('/api/bookings', methods=['GET'])
@token_required
def get_bookings(current_user):
    """Get all bookings for current user"""
    bookings = Booking.query.filter_by(student_id=current_user.id).order_by(Booking.booking_date.desc()).all()
    
    bookings_list = []
    for booking in bookings:
        event = booking.event
        bookings_list.append({
            'bookingId': booking.booking_id,
            'event': {
                'id': str(event.id),
                'title': event.title,
                'subtitle': event.subtitle,
                'image': event.image_url,
                'date': event.date,
                'time': event.time,
                'venue': event.venue
            },
            'ticketType': booking.ticket_type,
            'quantity': booking.quantity,
            'totalPrice': booking.total_price,
            'qrCode': booking.qr_code,
            'bookingDate': booking.booking_date.isoformat(),
            'status': booking.status
        })
    
    return jsonify(bookings_list), 200

@app.route('/api/bookings/<booking_id>', methods=['DELETE'])
@token_required
def cancel_booking(current_user, booking_id):
    """Cancel a booking"""
    booking = Booking.query.filter_by(booking_id=booking_id, student_id=current_user.id).first_or_404()
    
    booking.status = 'cancelled'
    db.session.commit()
    
    # Create notification
    notification = Notification(
        student_id=current_user.id,
        title='Booking Cancelled',
        message=f'Your booking for {booking.event.title} has been cancelled.',
        type='info'
    )
    db.session.add(notification)
    db.session.commit()
    
    return jsonify({'message': 'Booking cancelled successfully'}), 200

# ============================================================================
# API ROUTES - NOTIFICATIONS
# ============================================================================

@app.route('/api/notifications', methods=['GET'])
@token_required
def get_notifications(current_user):
    """Get all notifications for current user"""
    notifications = Notification.query.filter_by(student_id=current_user.id).order_by(Notification.created_at.desc()).all()
    
    notifications_list = []
    for notif in notifications:
        notifications_list.append({
            'id': notif.id,
            'title': notif.title,
            'message': notif.message,
            'type': notif.type,
            'isRead': notif.is_read,
            'createdAt': notif.created_at.isoformat()
        })
    
    return jsonify(notifications_list), 200

@app.route('/api/notifications/<int:notif_id>/read', methods=['PUT'])
@token_required
def mark_notification_read(current_user, notif_id):
    """Mark notification as read"""
    notification = Notification.query.filter_by(id=notif_id, student_id=current_user.id).first_or_404()
    
    notification.is_read = True
    db.session.commit()
    
    return jsonify({'message': 'Notification marked as read'}), 200

@app.route('/api/notifications/unread-count', methods=['GET'])
@token_required
def get_unread_count(current_user):
    """Get count of unread notifications"""
    count = Notification.query.filter_by(student_id=current_user.id, is_read=False).count()
    
    return jsonify({'count': count}), 200

# ============================================================================
# API ROUTES - USER PROFILE
# ============================================================================

@app.route('/api/user/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    """Get user profile"""
    return jsonify({
        'id': current_user.id,
        'name': current_user.name,
        'email': current_user.email,
        'department': current_user.department,
        'rollNumber': current_user.roll_number,
        'createdAt': current_user.created_at.isoformat()
    }), 200

@app.route('/api/user/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    """Update user profile"""
    data = request.get_json()
    
    if 'name' in data:
        current_user.name = data['name']
    if 'rollNumber' in data:
        current_user.roll_number = data['rollNumber']
    
    db.session.commit()
    
    return jsonify({'message': 'Profile updated successfully'}), 200

# ============================================================================
# HEALTH CHECK
# ============================================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'WhatNext API is running'
    }), 200

# ============================================================================
# MAIN
# ============================================================================

if __name__ == '__main__':
    # Initialize database
    init_database()
    
    # Run app
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
