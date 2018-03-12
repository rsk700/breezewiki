import json
from json import JSONEncoder
from datetime import datetime, timezone
from .modelsmap import modelsmap
from breezecore import models as m

def model_to_dict(item):
    data = {}
    for prop in modelsmap[type(item)]:
        data[prop] = getattr(item, prop)
    if isinstance(item, m.Diff):
        data['diff'] = json.loads(data['diff'])
    return data

class Encoder(JSONEncoder):

    """Docstring for Encoder. """

    def default(self, o):
        if type(o) in modelsmap:
            return model_to_dict(o)
        if isinstance(o, datetime):
            if o.tzinfo is None:
                return o.replace(tzinfo=timezone.utc).isoformat()
            else:
                return o.isoformat()
        if isinstance(o, set):
            return list(o)
        return JSONEncoder.default(self, o)
