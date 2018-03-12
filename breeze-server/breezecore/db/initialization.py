from sqlalchemy import create_engine
from breezecore import models as m
from breezecore.models.base import Base


def init_db(db_url, echo=False):
    """TODO: Docstring for init_db.

    :db_url: TODO
    :echo: TODO
    :returns: TODO

    """
    engine = create_engine(db_url, echo=echo)
    Base.metadata.create_all(engine)
