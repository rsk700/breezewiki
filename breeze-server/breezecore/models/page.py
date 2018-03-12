import re
import uuid
from datetime import datetime
from sqlalchemy import Column, Unicode, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from .base import Base


class Page(Base):

    """Docstring for Page. """

    @staticmethod
    def get_normal_title(title):
        title = title.strip()
        title = title.lower()
        # replace all space-like characters with "_"
        title = re.sub(r'\s', '_', title)
        # replace ASCII symbol used in formatting for defining links with "_"
        title = re.sub('--->', '_', title)
        return title

    __tablename__ = 'pages'
    __table_args__ = (
        UniqueConstraint('title', 'user_id', name='user_page'),
    )

    id = Column(String, primary_key=True, default=lambda: uuid.uuid4().hex, nullable=False)
    title = Column(Unicode, nullable=False, unique=True)
    normal_title = Column(Unicode, nullable=False, unique=True)
    text = Column(Unicode, nullable=False)
    updated_time = Column(DateTime, nullable=False, onupdate=datetime.utcnow, default=datetime.utcnow)
    created_time = Column(DateTime, nullable=False, default=datetime.utcnow)

    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    diff_id = Column(String, ForeignKey('diffs.id'), nullable=True)

    user = relationship('User', back_populates='pages', foreign_keys=user_id)
    diff = relationship('Diff', back_populates='page')

    def __repr__(self):
        return 'Page({})'.format(self.id)

    def set_normal_title(self):
        """TODO: Docstring for set_normal_title.
        :returns: TODO

        """
        self.normal_title = self.get_normal_title(self.title)
