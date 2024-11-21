  
import os
from flask_admin import Admin
from api.models import db, User, Match, GymPreference, ExerciseInterests, Like, WorkoutSchedule, Subscriber
from flask_admin.form import Select2Widget
from flask_admin.contrib.sqla import ModelView


class UserView(ModelView):
    column_list = ('id', 'name', 'email', 'city', 'state', 'gender', 'age')
    column_searchable_list = ['name', 'email', 'city']
    column_filters = ['state', 'gender', 'age']
    form_widget_args = {
        'gender': {'widget': Select2Widget()}
    }
    column_display_all_relations = True
    inline_models = [(WorkoutSchedule, dict(form_columns=['day_of_week', 'time_slot']))]

class MatchView(ModelView):
    column_list = ('id', 'user1', 'user2', 'created_at', 'status', 'last_interaction')
    column_filters = ['status', 'created_at']
    column_searchable_list = ['status']

class GymPreferenceView(ModelView):
    column_list = ('id', 'name', 'city', 'state', 'address')
    column_searchable_list = ['name', 'city', 'state']
    column_filters = ['state', 'city']

class ExerciseInterestsView(ModelView):
    column_list = ('id', 'name', 'description')
    column_searchable_list = ['name', 'description']
    form_widget_args = {
        'name': {'widget': Select2Widget()}
    }

class WorkoutScheduleView(ModelView):
    column_list = ('id', 'user', 'day_of_week', 'time_slot')
    column_filters = ['day_of_week', 'time_slot']
    form_widget_args = {
        'day_of_week': {'widget': Select2Widget()},
        'time_slot': {'widget': Select2Widget()}
    }

class LikeView(ModelView):
    column_list = ('id', 'liker', 'liked', 'created_at')
    column_filters = ['created_at']



def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='Gym buddy Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    # admin.add_view(ModelView(User, db.session))
    # admin.add_view(ModelView(Match, db.session))
    # admin.add_view(ModelView(GymPreference, db.session))
    # admin.add_view(ModelView(ExerciseInterests, db.session))

    admin.add_view(UserView(User, db.session))
    admin.add_view(MatchView(Match, db.session))
    admin.add_view(GymPreferenceView(GymPreference, db.session))
    admin.add_view(ExerciseInterestsView(ExerciseInterests, db.session))
    admin.add_view(WorkoutScheduleView(WorkoutSchedule, db.session))
    admin.add_view(LikeView(Like, db.session))
    admin.add_view(ModelView(Subscriber, db.session))

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))

