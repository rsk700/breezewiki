from breezecore import models as m
from .corebase import CoreBase


class Diffs(CoreBase):

    """Docstring for Diffs. """

    def get_diffs(self, diff, depth, cursor=None):
        """TODO: Docstring for get_diffs.

        :diff: first diff for diff history (will be included in result)
        :depth: positive integer, how many diffs get from history
        :cursor: TODO
        :returns: tuple (diffs, cursor)

        """
        diffs = []
        if diff is None:
            return [], None
        if cursor is not None:
            diff = self.s.query(m.Diff).get(cursor)
        diffs.append(diff)
        while len(diffs) < depth and diff.prev_diff is not None:
            diff = diff.prev_diff
            diffs.append(diff)
        cursor = None
        if diff.prev_diff:
            cursor = diff.prev_diff.id
        return diffs, cursor
