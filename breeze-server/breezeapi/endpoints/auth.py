from flask import g
from breezeapi import wrappers, schemas, errors


@wrappers.api_resource('/auth/token', 'POST', schema=schemas.email_auth)
def post_auth_token():
    """TODO: Docstring for post_auth_token.
    :returns: TODO

    """
    user = g.core.auth.get_user_by_email(g.json['email'], g.json['password'])
    if not user:
        raise errors.not_found_error
    if not user.token:
        user.update_token()
    return {
        'token': user.get_full_token(),
        'user': user
    }

@wrappers.api_resource('/auth/logout', 'PUT')
@wrappers.auth
def put_auth_logout():
    """TODO: Docstring for put_auth_logout.
    :returns: TODO

    """
    g.current_user.forget_token()
    return {}
