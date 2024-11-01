"""empty message

Revision ID: 0fce229057d6
Revises: 
Create Date: 2024-10-29 20:24:16.149280

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0fce229057d6'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('day_of_week',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('gender',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('time_of_day',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('password_hash', sa.String(), nullable=False),
    sa.Column('age', sa.Integer(), nullable=True),
    sa.Column('gender_id', sa.Integer(), nullable=True),
    sa.Column('preferred_day_id', sa.Integer(), nullable=True),
    sa.Column('preferred_time_id', sa.Integer(), nullable=True),
    sa.Column('profile_image', sa.String(), nullable=True),
    sa.Column('fitness_level', sa.String(), nullable=True),
    sa.Column('gym_membership', sa.String(), nullable=True),
    sa.Column('preferred_spotting_style', sa.String(), nullable=True),
    sa.Column('bio', sa.String(), nullable=True),
    sa.Column('date_joined', sa.DateTime(), nullable=True),
    sa.Column('is_verified', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['gender_id'], ['gender.id'], ),
    sa.ForeignKeyConstraint(['preferred_day_id'], ['day_of_week.id'], ),
    sa.ForeignKeyConstraint(['preferred_time_id'], ['time_of_day.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('match',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user1_id', sa.Integer(), nullable=True),
    sa.Column('user2_id', sa.Integer(), nullable=True),
    sa.Column('is_accepted', sa.Boolean(), nullable=True),
    sa.Column('created_on', sa.DateTime(), nullable=True),
    sa.Column('last_interaction', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['user1_id'], ['user.id'], ),
    sa.ForeignKeyConstraint(['user2_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('match')
    op.drop_table('user')
    op.drop_table('time_of_day')
    op.drop_table('gender')
    op.drop_table('day_of_week')
    # ### end Alembic commands ###
