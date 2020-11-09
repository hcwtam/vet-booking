import os
from functools import wraps
from flask import request, jsonify
import jwt
from app.models import User


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        # noinspection PyBroadException
        try:
            data = jwt.decode(token, os.environ.get("SECRET_KEY"))
            current_user = User.query.filter_by(uid=data['uid']).first()
        except:
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(current_user, *args, **kwargs)

    return decorated
