# -*- coding: utf-8 -*-
from odoo import api, fields, models


class PostPost(models.Model):
    _name = 'post.post'
    _description = 'Post Post'

    user_id = fields.Many2one('res.users')
    comment_ids = fields.One2many('post.comment', 'post_id')
    caption = fields.Text(string='Caption')
    media_ids = fields.One2many("post.media", "post_id",
        string="Media",
    )

    @api.model
    def create_post(self, caption, images):
        """Create posts from social hub UI"""
        post = self.create({
            'caption': caption,
            'user_id': self.env.user.id,
        })
        for image in images:
            self.env['post.media'].create({
                'post_id': post.id,
                'name': image['name'],
                'image': image['data'],
                'mimetype': image['mimetype'],
            })
        return post.id
