from flask import g
from breezeapi import wrappers

@wrappers.api_resource('/me', 'GET')
@wrappers.auth
def get_me():
    """TODO: Docstring for get_me.
    :returns: TODO

    """
    return g.current_user
