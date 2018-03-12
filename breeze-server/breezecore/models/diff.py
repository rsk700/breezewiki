import uuid
from datetime import datetime
from sqlalchemy import Column, Unicode, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base


class Diff(Base):

    """Docstring for Diff. """

    __tablename__ = 'diffs'

    id = Column(String, primary_key=True, default=lambda: uuid.uuid4().hex, nullable=False)
    prev_diff_id = Column(String, ForeignKey('diffs.id'), nullable=True)
    diff = Column(Unicode, nullable=False)
    updated_time = Column(DateTime, nullable=False, onupdate=datetime.utcnow, default=datetime.utcnow)
    created_time = Column(DateTime, nullable=False, default=datetime.utcnow)

    prev_diff = relationship('Diff', remote_side=[id])
    page = relationship('Page', uselist=False, back_populates='diff')

    def __repr__(self):
        return 'Diff({})'.format(self.id)
