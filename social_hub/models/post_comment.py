# -*- coding: utf-8 -*-
from odoo import fields, models


class PostComment(models.Model):
    _name = 'post.comment'
    _description = 'Post Comment'

    post_id = fields.Many2one('post.post', string='Post')
    comment = fields.Text(string='Comment')
