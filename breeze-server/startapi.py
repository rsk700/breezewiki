#!/usr/bin/env python3

import sys
from breezeapi.config import config
from breezeapi.app import app
from breezeapi import endpoints

config.DB_URL = sys.argv[1]

app.run(debug=True)
