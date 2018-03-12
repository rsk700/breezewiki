import json
from sqlalchemy.exc import IntegrityError
from diffmatchpatch.diff_match_patch import diff_match_patch
from breezecore import models as m


class Pages(object):

    """Docstring for Pages. """

    def __init__(self, session):
        """TODO: to be defined1.

        :session: TODO

        """
        self.s = session

    def create_page(self, user, title, text):
        """TODO: Docstring for create_page.

        :user: TODO
        :title: TODO
        :text: TODO
        :returns: TODO

        """
        page = m.Page(
            title = title,
            text = text,
            user_id = user.id
        )
        page.set_normal_title()
        self.s.add(page)
        self.s.flush()
        return page

    def modify_page(self, page_id, diff_id, new_text):
        """TODO: Docstring for modify_page.

        :page_id: TODO
        :diff_id: TODO
        :new_text: TODO
        :returns: TODO

        """
        page = self.s.query(m.Page).get(page_id)
        if not page:
            return None
        if page.diff_id != diff_id:
            return None
        if page.text == new_text:
            return page

        dmp = diff_match_patch()
        # compute diff on how to convert current page text to new text
        # diff contains all information required to build original and new text
        diff = dmp.diff_main(page.text, new_text)
        dmp.diff_cleanupSemantic(diff)

        new_diff = m.Diff(
            prev_diff_id=diff_id,
            diff=json.dumps(diff)
        )
        self.s.add(new_diff)
        self.s.flush()
        page.text = new_text
        page.diff_id = new_diff.id
        self.s.flush()
        return page
# 
#     def rewind(self, page, steps):
#         """TODO: Docstring for rewind.
# 
#         :page: TODO
#         :steps: TODO
#         :returns: TODO
# 
#         """
#         if page.diff is None:
#             return page.text
#         dmp = diff_match_patch()
#         text = page.text
#         next_diff = page.diff
#         for _ in range(steps):
#             if next_diff is None:
#                 break
#             diff = json.loads(next_diff.diff)
#             patches = dmp.patch_make(text, diff)
#             text, _ = dmp.patch_apply(patches, text)
#             next_diff = next_diff.prev_diff
#         return text
