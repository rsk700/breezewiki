from flask import g, request
from breezeapi import wrappers, errors
from breezecore import models as m


@wrappers.api_resource('/pages/<page_id>/diffs', 'GET')
@wrappers.auth
def get_pages_by_id_diffs(page_id):
    """TODO: Docstring for get_pages_by_id_diffs.

    :page_id: TODO
    :returns: TODO

    """
    page = g.s().query(m.Page).get(page_id)
    if not page:
        raise errors.not_found_error
    cursor = request.args.get('next')
    if cursor:
        if g.s().query(m.Diff).get(cursor) is None:
            raise errors.not_found_error
    diffs, cursor = g.core.diffs.get_diffs(page.diff, 10, cursor=cursor)
    return {
        'data': diffs,
        'next': cursor
    }
