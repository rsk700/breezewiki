# -*- coding: utf-8 -*-
"""
"""

from __future__ import division
from __future__ import absolute_import
from __future__ import print_function

from breezecore import models as m

modelsmap = {
    m.User: [
        'id',
        'email',
        'name',
        'default_page_id',
        'updated_time',
        'created_time',
    ],
    m.Page: [
        'id',
        'title',
        'normal_title',
        'text',
        'updated_time',
        'created_time',
        'diff_id',
    ],
    m.Diff: [
        'id',
        'prev_diff_id',
        'diff',
        'updated_time',
        'created_time',
    ]
}
