import breezecore


class Core(object):

    """Docstring for Core. """

    _session = None
    _auth = None
    _pages = None
    _diffs = None

    @property
    def session(self):
        if self._session is None:
            self._session = self.session_fab()
        return self._session

    @property
    def auth(self):
        if self._auth is None:
            self._auth = breezecore.Auth(self.session)
        return self._auth

    @property
    def pages(self):
        if self._pages is None:
            self._pages = breezecore.Pages(self.session)
        return self._pages

    @property
    def diffs(self):
        """TODO: Docstring for diffs.
        :returns: TODO

        """
        if self._diffs is None:
            self._diffs = breezecore.Diffs(self.session)
        return self._diffs

    def __init__(self, session_fab):
        """TODO: to be defined1.

        :session_fab: TODO

        """
        self.session_fab = session_fab
