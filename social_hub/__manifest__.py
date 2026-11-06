# -*- coding: utf-8 -*-
{
    "name": "SocialHub",
    "version": "19.0.1.0.0",
    "category": "Extra Tools",
    "summary": """ """,
    "description": """ """,
    "author": "Aysha Shalin",
    "depends": ["base"],
    "data": [
        "security/ir.model.access.csv",
        "views/post_views.xml",
        "views/menus.xml",
    ],
    "assets": {
        # "web.assets_frontend": [
        #     "social_hub/static/src/components/Post/create_post.scss",
        # ],
        "web.assets_backend": [
            "social_hub/static/src/js/home.js",
            "social_hub/static/src/xml/home_page_template.xml",
            "social_hub/static/src/components/Post/create_post.xml",
            "social_hub/static/src/components/Post/create_post.scss",
            "social_hub/static/src/components/Post/create_post.js",
            "social_hub/static/src/components/Post/post_card.js",
            "social_hub/static/src/components/Post/post_card.xml",
        ],
    },
    "images": ["static/description/banner.jpg"],
    "license": "LGPL-3",
    "installable": True,
    "auto_install": False,
    "application": False,
}
