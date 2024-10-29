"""empty message

Revision ID: 534d62bb5772
Revises: a6753f65ba19
Create Date: 2024-10-24 15:47:32.025986

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '534d62bb5772'
down_revision = 'a6753f65ba19'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('longitude', sa.Float(), nullable=False))
        batch_op.add_column(sa.Column('latitude', sa.Float(), nullable=False))
        batch_op.add_column(sa.Column('gender', sa.String(length=80), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('gender')
        batch_op.drop_column('latitude')
        batch_op.drop_column('longitude')

    # ### end Alembic commands ###
