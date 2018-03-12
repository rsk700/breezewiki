#!/usr/bin/env python3

import sys
import IPython
import breezecore as core
from breezecore import models as m
from breezecore.db import create_session

s = create_session(sys.argv[1])
auth = core.Auth(s)
pages = core.Pages(s)

IPython.embed()
