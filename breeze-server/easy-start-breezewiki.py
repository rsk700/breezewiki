#!/usr/bin/env python3

import os
import logging
import getpass
from argparse import ArgumentParser
import breezecore as core
from breezecore.db import initialization
from breezecore.db import create_session
from breezecore import models as m
from breezeapi.config import config
from breezeapi.app import app
from breezeapi import endpoints

_readme = """
"""
_readme = _readme.strip()

logging.basicConfig(level=logging.INFO, format='%(asctime)s:%(levelname)s:%(name)s:%(message)s')
log = logging.getLogger('easy-start-breezewiki')

def get_conf():
    parser = ArgumentParser(description='', usage=_readme)
    parser.add_argument('--public', action='store_true')
    parser.add_argument('db')
    return parser.parse_args()

# serving static files
@app.route('/', methods=['GET'], defaults={'path': ''})
@app.route('/<path:path>', methods=['GET'])
def serve_static(path):
    return app.send_static_file('index.html')

def main():
    conf = get_conf()
    url = 'sqlite:///{}'.format(conf.db)
    if not os.path.exists(conf.db):
        print('App first start, please enter user details...')
        name = input('User name: ')
        email = input('User email: ')
        password = getpass.getpass(prompt='User password: ')
        initialization.init_db(url, echo=False)
        session = create_session(url)
        auth = core.Auth(session)
        pages = core.Pages(session)
        user = auth.signin_user(name, email, password)
        page = pages.create_page(user, 'Default page', 'Page text...')
        user.default_page = page
        session.commit()
        session.close()
    config.DB_URL = url
    if conf.public:
        app.run(host='0.0.0.0')
    else:
        app.run()

if __name__ == '__main__':
    main()
