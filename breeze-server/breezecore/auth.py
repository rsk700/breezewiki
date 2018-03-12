from werkzeug.security import generate_password_hash, check_password_hash
from breezecore import models as m


class Auth(object):

    """Docstring for Auth. """

    PASSWORD_SYMBOLS = 3
    PASSWORD_LENGTH = 5

    @staticmethod
    def is_password_ok(password):
        """TODO: Docstring for is_password_ok.

        :password: TODO
        :returns: TODO

        """
        if len(set(password)) < Auth.PASSWORD_SYMBOLS:
            return False
        if len(password) < Auth.PASSWORD_LENGTH:
            return False
        return True

    def __init__(self, session):
        """TODO: to be defined1.

        :session: TODO

        """
        self.s = session

    def signin_user(self, name, email, password):
        """TODO: Docstring for signin_user.

        :email: TODO
        :password: TODO
        :name: TODO
        :returns: TODO

        """
        if self.s.query(m.User).filter(m.User.email == email).first():
            return None
        user = m.User(
            name=name,
            email=email,
            password_hash=generate_password_hash(password)
        )
        self.s.add(user)
        self.s.flush()
        return user

    def get_user_by_email(self, email, password):
        """TODO: Docstring for get_user_by_email.

        :email: TODO
        :password: TODO
        :returns: TODO

        """
        user = self.s.query(m.User).filter(m.User.email == email).first()
        if not user:
            return None
        if not check_password_hash(user.password_hash, password):
            return None
        return user

    def get_user_by_full_token(self, full_token):
        """TODO: Docstring for get_user_by_full_token.

        :full_token: TODO
        :returns: TODO

        """
        if not m.User.is_full_token(full_token):
            return None
        user_id, token = m.User.split_full_token(full_token)
        user = self.s.query(m.User).get(user_id)
        if user:
            if user.token == token:
                return user
        return None
