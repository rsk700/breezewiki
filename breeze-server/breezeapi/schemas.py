email_auth = {
    'email': {
        'type': 'string',
        'empty': False,
        'minlength': 5,
        'maxlength': 255,
        'required': True
    },
    'password': {
        'type': 'string',
        'empty': False,
        'minlength': 5,
        'required': True
    },
}

page = {
    'title': {
        'type': 'string',
        'empty': False,
        'minlength': 1,
        'maxlength': 100,
        'required': True
    },
    'text': {
        'type': 'string'
    },
}

page_update = {
    'diff_id': {
        'type': 'string',
        'required': True,
        'nullable': True
    },
    'text': {
        'type': 'string',
        'required': True
    }
}
