from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()


def create_app():
    """Construct the core application."""
    app = Flask(__name__, instance_relative_config=False)
    CORS(app)
    app.config.from_object('config.Config')

    db.init_app(app)

    with app.app_context():
        # Import routes
        from app.routes.user.user import user_bp
        from app.routes.pet.pet import pet_bp

        # Create sql tables for our data models
        db.create_all()

        # Register Blueprints
        app.register_blueprint(user_bp)
        app.register_blueprint(pet_bp)

        return app
