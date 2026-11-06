# -*- coding: utf-8 -*-
from odoo import fields, models


class PostMedia(models.Model):
    _name = 'post.media'
    _description = 'Post Media'

    post_id = fields.Many2one("post.post", required=True,
        ondelete="cascade",
    )
    name = fields.Char(required=True)
    image = fields.Binary(string="Image", attachment=True, required=True)
    mimetype = fields.Char()
