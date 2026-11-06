/** @odoo-module **/
import { Component, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { session } from "@web/session";
import { Dialog } from "@web/core/dialog/dialog";

export class CreatePost extends Component {
    static template = "social_hub.CreatePost";
    static components = { Dialog };

    static props = {
        close: Function,
        onPostCreated: { type: Function, optional: true },
    };

    setup() {
        this.orm = useService("orm");
        this.notification = useService("notification");

        this.state = useState({
            username: session.partner_display_name,
            avatar: "/web/static/img/user_menu_avatar.png",
            caption: "",
            images: [],
            isPublishing: false,
        });
    }

    onCaptionChange(event) {
        this.state.caption = event.target.value;
    }

    onImagesSelected(event) {
        const files = Array.from(event.target.files || []);
        for (const file of files) {
            if (!file.type.startsWith("image/")) {
                continue;
            }
            this.state.images.push({
                file,
                url: URL.createObjectURL(file),
            });
        }
        // Allow selecting the same file again.
        event.target.value = "";
    }

    removeImage(index) {
        const image = this.state.images[index];
        URL.revokeObjectURL(image.url);
        this.state.images.splice(index, 1);
    }

    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                resolve({
                    name: file.name,
                    mimetype: file.type,
                    data: reader.result.split(",")[1],
                });
            };

            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    onImageSelect(event) {
        const files = Array.from(event.target.files || []);
        const validFiles = files.filter(
            file => file.type.startsWith("image/")
        );
        for (const file of validFiles) {
            const imageUrl = URL.createObjectURL(file);
            this.state.images.push({
                id: crypto.randomUUID(),
                file: file,
                url: imageUrl,
            });
        }
        event.target.value = "";
    }

    removeImage(imageId) {
        const image = this.state.images.find(
            img => img.id === imageId
        );
        if (image) {
            URL.revokeObjectURL(image.url);
        }
        this.state.images = this.state.images.filter(
            img => img.id !== imageId
        );
    }

    async publishPost() {
        if (!this.state.caption.trim() && !this.state.images.length) {
            this.notification.add("Please add a caption or image.", {
                type: "warning",
            });
            return;
        }
        if (this.state.isPublishing) {
            return;
        }
        this.state.isPublishing = true;
        try {
            // Convert selected images into Base64
            const images = await Promise.all(
                this.state.images.map(image =>
                    this.fileToBase64(image.file)
                )
            );

            const postId = await this.orm.call(
                "post.post",
                "create_post",
                [this.state.caption, images]
            );

            this.notification.add("Post published successfully!", {
                type: "success",
            });

            // Release temporary preview URLs.
            this.state.images.forEach((image) => {
                URL.revokeObjectURL(image.url);
            });

            // Refresh the homepage feed.
            if (this.props.onPostCreated) {
                await this.props.onPostCreated(postId);
            }

            this.props.close()

        } catch (error) {
            console.error("Post creation failed:", error);
            this.notification.add(
                error.data?.message || "Unable to publish post.",
                {
                    title: "Post Creation Failed",
                    type: "danger",
                }
            );

        } finally {
            this.state.isPublishing = false;
        }
    }
    cancel() {
        this.state.images.forEach((image) => {
            URL.revokeObjectURL(image.url);
        });

        this.props.close();
    }
}
