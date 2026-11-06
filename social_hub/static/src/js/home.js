/** @odoo-module **/

import { registry } from "@web/core/registry";
import { Component, useState } from "@odoo/owl";
const actionRegistry = registry.category("actions");
import { CreatePost } from "../components/Post/create_post";
import { PostCard } from "./components/Post/post_card";

class SocialHub extends Component {
    static props = ["*"];
    static components = { PostCard };
    static template = "social_hub.socialhub_dashboard_action";

    setup() {
        this.orm = useService("orm");
        this.dialog = useService("dialog");
        this.state = useState({
            posts: [],
            loading: true,
        });

        onWillStart(async () => {
            await this.loadPosts();
        });
    }

    async loadPosts() {
        this.state.loading = true;

        try {
            const posts = await this.orm.searchRead(
                "post.post",
                [],
                ["caption", "user_id", "create_date", "media_ids"],
                {
                    order: "create_date desc",
                }
            );

            this.state.posts = posts;
        } catch (error) {
            console.error("Unable to load posts:", error);
        } finally {
            this.state.loading = false;
        }
    }

     openCreatePost() {
        this.dialog.add(CreatePost, {
            onPostCreated: async () => {
                await this.loadPosts();
            },
        });
    }

    // onPublish(postData) {
    //     console.log("New post:", postData);
    //     // Later, save the post using the Odoo ORM.
    // }
}

// SocialHub.template = "social_hub.socialhub_dashboard_action";
// actionRegistry.add("social_hub_tag", SocialHub);
registry.category("actions").add("social_hub_tag", SocialHub);
