import json
import flask
import cerberus
from functools import wraps
from breezeapi.encoder import Encoder
from breezeapi.app import app
from breezeapi.config import config
from breezeapi import errors


@app.errorhandler(errors.ApiError)
def api_error(e):
    error = {
        'error': e.message
    }
    if e.messages:
        error['errors'] = e.messages
    return api_response(error, e.error_code)

def api_response(data, code):
    """TODO: Docstring for api_response.

    :data: TODO
    :code: TODO
    :returns: TODO

    """
    data = json.dumps(data, cls=Encoder)
    response = flask.make_response(data, code)
    response.mimetype = 'application/json'
    return response

def api_resource(route, method, schema=None):
    """TODO: Docstring for api_resource.

    :route: TODO
    :method: TODO
    :schema: TODO
    :returns: TODO

    """
    route = config.API_ROOT + route
    validator = None
    if schema:
        validator = cerberus.Validator(schema, purge_unknown=True)
    def wrapper(f):
        @app.route(route, methods=[method])
        @wraps(f)
        def endpoint(*args, **kwargs):
            if validator:
                json_data = None
                if flask.request.is_json:
                    json_data = flask.request.get_json()
                elif not flask.request.is_json and flask.request.method == 'PUT':
                    json_data = {}
                if not validator.validate(json_data):
                    validator_errors = []
                    for prop, error in validator.errors.items():
                        validator_errors.append({prop: error})
                    raise errors.ApiError('Incorrect data format', 400, messages=validator_errors)
                flask.g.json = validator.document
            response = f(*args, **kwargs)
            return api_response(response, 200)
        return endpoint
    return wrapper

def auth(f):
    """TODO: Docstring for auth.

    :f: TODO
    :returns: TODO

    """
    @wraps(f)
    def wrapper(*args, **kwargs):
        if 'token' not in flask.request.args:
            raise errors.unauthorized_error
        user = flask.g.core.auth.get_user_by_full_token(flask.request.args['token'])
        if not user:
            raise errors.unauthorized_error
        flask.g.current_user = user
        return f(*args, **kwargs)
    return wrapper
