import uuid
from datetime import datetime
from random import SystemRandom
from sqlalchemy import Column, Unicode, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

choice = SystemRandom().choice


class User(Base):

    """Docstring for User. """

    TOKEN_SYMBOLS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    TOKEN_LENGTH = 100

    __tablename__ = 'users'

    id = Column(String, primary_key=True, default=lambda: uuid.uuid4().hex, nullable=False)
    email = Column(Unicode(255), nullable=False, unique=True, index=True)
    name = Column(Unicode(128), nullable=False)
    token = Column(String(100), nullable=True)
    password_hash = Column(String(128), nullable=False)
    default_page_id = Column(String, ForeignKey('pages.id'))
    updated_time = Column(DateTime, nullable=False, onupdate=datetime.utcnow, default=datetime.utcnow)
    created_time = Column(DateTime, nullable=False, default=datetime.utcnow)

    pages = relationship('Page', back_populates='user', foreign_keys='Page.user_id')
    default_page = relationship('Page', foreign_keys=default_page_id)

    @staticmethod
    def is_full_token(full_token):
        if not isinstance(full_token, str):
            return False
        if not '.' in full_token:
            return False
        return True

    @staticmethod
    def split_full_token(full_token):
        user_id, token = full_token.split('.', 1)
        return user_id, token

    @staticmethod
    def gen_code():
        code = ''
        for _ in range(User.TOKEN_LENGTH):
            code += choice(User.TOKEN_SYMBOLS)
        return code

    def __repr__(self):
        return 'User({})'.format(self.id)

    def update_token(self):
        """TODO: Docstring for update_token.
        :returns: TODO

        """
        self.token = self.gen_code()

    def get_full_token(self):
        """TODO: Docstring for get_full_token.
        :returns: TODO

        """
        return '{}.{}'.format(self.id, self.token)

    def forget_token(self):
        """TODO: Docstring for forget_token.
        :returns: TODO

        """
        self.token = None
