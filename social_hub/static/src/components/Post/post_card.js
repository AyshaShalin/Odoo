/** @odoo-module **/
import { Component } from "@odoo/owl";

export class PostCard extends Component {
    static template = "social_hub.PostCard";
    static props = {
        post: Object,
    };

    get userId() {
        return this.props.post.user_id?.[0];
    }
    get username() {
        return this.props.post.user_id?.[1] || "Unknown User";
    }
    get mediaIds() {
        return this.props.post.media_ids || [];
    }
    get formattedDate() {
        if (!this.props.post.create_date) {
            return "";
        }
        return new Date(
            this.props.post.create_date.replace(" ", "T") + "Z"
        ).toLocaleString();
    }
    get avatarUrl() {
        return this.userId
            ? `/web/image/res.users/${this.userId}/avatar_128`
            : "";
    }
    getImageUrl(mediaId) {
        return `/web/image/post.media/${mediaId}/image`;
    }
}
