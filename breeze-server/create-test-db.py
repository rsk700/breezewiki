#!/usr/bin/env python3

import sys
import breezecore as core
from breezecore.db import initialization
from breezecore.db import create_session

url = 'sqlite:///{}'.format(sys.argv[1])
initialization.init_db(url, echo=True)
s = create_session(url)
auth = core.Auth(s)
pages = core.Pages(s)
user_props = ['Test', 'test@local', '12345']
user = auth.signin_user(*user_props)
print('User: {}'.format(user_props))
page = pages.create_page(user, 'Default page', 'test page text')
user.default_page = page
print('Page: {}'.format(page))
s.commit()
