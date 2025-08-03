from flask import Blueprint, request, jsonify
from extensions import db, mail
from models import Todo, User
from flask_mail import Message
from functools import wraps
import jwt, os

todo_bp = Blueprint('todo', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split()[1]
        if not token:
            return jsonify({'message': 'Token is missing'}), 403
        try:
            data = jwt.decode(token, os.getenv('JWT_SECRET'), algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'message': 'Token is invalid'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

@todo_bp.route('/todos', methods=['GET'])
@token_required
def get_todos(current_user):
    todos = Todo.query.filter_by(user_id=current_user.id).all()
    return jsonify([{'id': t.id, 'content': t.content} for t in todos])

@todo_bp.route('/todos', methods=['POST'])
@token_required
def add_todo(current_user):
    data = request.json
    if not data.get('content'):
        return jsonify({'error': 'Content is required'}), 400

    todo = Todo(content=data['content'], user_id=current_user.id)
    db.session.add(todo)
    db.session.commit()

    msg = Message("New Todo Created", sender=os.getenv('EMAIL_USER'), recipients=[current_user.email])
    msg.body = f"Todo Created: {data['content']}"
    mail.send(msg)
    return jsonify({'message': 'Todo added'}), 201

@todo_bp.route('/todos/<int:id>', methods=['PUT'])
@token_required
def update_todo(current_user, id):
    data = request.json
    todo = Todo.query.get(id)
    if not todo or todo.user_id != current_user.id:
        return jsonify({'message': 'Unauthorized'}), 403
    todo.content = data['content']
    db.session.commit()
    return jsonify({'message': 'Todo updated'})

@todo_bp.route('/todos/<int:id>', methods=['DELETE'])
@token_required
def delete_todo(current_user, id):
    todo = Todo.query.get(id)
    if not todo or todo.user_id != current_user.id:
        return jsonify({'message': 'Unauthorized'}), 403
    db.session.delete(todo)
    db.session.commit()
    return jsonify({'message': 'Todo deleted'})
