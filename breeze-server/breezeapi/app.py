from flask import Flask, g
from breezecore.db import create_session
from breezeapi.config import config
from breezeapi.core import Core


app = Flask('breezeapi')

def get_request_db_session():
    if g.__session is None:
        g.__session = create_session(config.DB_URL)
    return g.__session

@app.before_request
def set_core():
    g.current_user = None
    g.__session = None
    g.s = get_request_db_session
    g.core = Core(get_request_db_session)

@app.teardown_appcontext
def finish_session(error):
    if g.__session:
        if error:
            # rolling back changes on error
            g.__session.rollback()
        else:
            # commiting pending changes
            g.__session.commit()
        g.__session.close()
