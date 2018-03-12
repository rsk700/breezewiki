from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

def create_session(db_url):
    """TODO: Docstring for create_session.

    :db_url: TODO
    :returns: TODO

    """
    engine = create_engine(db_url, poolclass=NullPool)
    Session = sessionmaker(bind=engine)
    return Session()
