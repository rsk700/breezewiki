from breezecore import models as m


class Diffs(object):

    """Docstring for Diffs. """

    def __init__(self, session):
        """TODO: to be defined1.

        :session: TODO

        """
        self.s = session

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
