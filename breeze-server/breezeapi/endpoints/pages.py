from flask import g
from sqlalchemy.exc import IntegrityError
from breezeapi import wrappers, schemas, errors
from breezecore import models as m

@wrappers.api_resource('/pages', 'POST', schema=schemas.page)
@wrappers.auth
def post_pages():
    """TODO: Docstring for post_pages.
    :returns: TODO

    """
    try:
        page = g.core.pages.create_page(
            g.current_user,
            g.json['title'],
            g.json.get('text', '')
        )
    except IntegrityError:
        g.s().rollback()
        raise errors.ApiError('Page already exists', 400)
    return page

@wrappers.api_resource('/pages/<page_id>', 'GET')
@wrappers.auth
def get_pages_by_id(page_id):
    """TODO: Docstring for get_pages_by_id.

    :page_id: TODO
    :returns: TODO

    """
    page = g.s().query(m.Page).get(page_id)
    if not page:
        raise errors.not_found_error
    return page

@wrappers.api_resource('/pages/title/<title>', 'GET')
@wrappers.auth
def get_pages_by_title(title):
    """TODO: Docstring for get_pages_by_title.

    :title: TODO
    :returns: TODO

    """
    page = g.s().query(m.Page).filter(m.Page.title == title).first()
    if not page:
        page = g.s().query(m.Page).filter(m.Page.normal_title == m.Page.get_normal_title(title)).first()
    if not page:
        raise errors.not_found_error
    return page

@wrappers.api_resource('/pages/<page_id>', 'PUT', schema=schemas.page_update)
@wrappers.auth
def put_pages_by_id(page_id):
    """TODO: Docstring for put_pages_by_id.

    :page_id: TODO
    :returns: TODO

    """
    page = g.core.pages.modify_page(page_id, g.json['diff_id'], g.json['text'])
    if not page:
        raise errors.ApiError('Can not modify page', 400)
    return page
