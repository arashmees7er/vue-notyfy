<template>
    <transition name="notification-transition" @after-leave="destroyElement">
        <div v-show="isActive" :style="positionStyle" :class="[this.type && `notification--${this.type}`, this.classes]" v-on="$listeners" ref="notification" class="notification">
            <div :style="wrapperStyle" class="notification__wrapper">
                <div class="notification__content">
                    <div class="notification__title">
                        <div>Apa apa jeeee</div>
                        <div class="notification__button">
                            <button class="notification__dropdown" type="button" @click="handleCollapse" v-if="description">
                                <svg :viewBox="NOTIFICATION_ICONS.chevronDown.viewBox" role="img" xmlns="http://www.w3.org/2000/svg" style="padding: 1.5px">
                                    <path fill="currentColor" :d="NOTIFICATION_ICONS.chevronDown.path" />
                                </svg>
                            </button>
                            <button v-if="showClose" class="notification__close" type="button" @click="close">
                                <svg :viewBox="NOTIFICATION_ICONS.close.viewBox" role="img" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="currentColor" :d="NOTIFICATION_ICONS.close.path" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <transition name="content" v-if="description">
                        <div style="margin-top: 5px" v-show="collapse">
                            <p>{{ description }}</p>
                        </div>
                    </transition>
                    <!-- <div class="text-truncate" v-html="customContent" v-if="customContent" />
                    <span class="notification__title" v-else>
                        <span v-if="Boolean(iconType) && !hideIcon" :style="iconStyle" class="notification__icon">
                            <svg :viewBox="iconType.viewBox" :width="iconType.width" :height="iconType.height" role="img" xmlns="http://www.w3.org/2000/svg">
                                <path fill="currentColor" :d="iconType.path" />
                            </svg>
                        </span>
                        <p class="notification__text">{{ message }}</p>
                    </span>
                    <button v-if="actionText" class="notification__action" type="button" @click="onActionClick">
                        {{ actionText }}
                    </button> -->
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import positionable from '../../mixins/positionable'
import toggleable from '../../mixins/toggleable'
import colorable from '../../mixins/colorable'

import { Z_INDEX_LIST, NOTIFICATION_ICONS, NOTIFICATION_THEME } from '../../constants'

export default {
    name: 'NotificationItem',
    mixins: [positionable, toggleable, colorable],
    props: {
        // Can be : success / info / warning / error
        type: { type: String },
        customContent: { type: String },
        hideIcon: { type: Boolean, default: false },
        // Text to show on notification
        message: { type: String, default: String },
        // A position name like (top-left) only used to categorize notification emplacement
        position: { type: String, default: String },
        // Makes the notification higher (mobile)
        multiLine: { type: Boolean, default: false },
        // Makes the notification full width like in mobile
        fullWidth: { type: Boolean, default: false },
        // Offset to show notification
        verticalOffset: { type: Number, default: 16 },
        // Delay before closing notification
        closeDelay: { type: Number, default: 4500 },
        // Action button
        actionText: { type: String, default: undefined },
        onActionClick: { type: Function, default: undefined },
        // show a close button
        showClose: { type: Boolean, default: false },
        // Theme
        theme: { type: Object, default: () => NOTIFICATION_THEME },
        // zindex
        zIndex: { type: Number, default: Z_INDEX_LIST.notification },
        // description
        description: { type: String }
    },
    data: () => ({
        NOTIFICATION_ICONS,
        activeTimeout: -1,
        collapse: false
    }),
    computed: {
        classes() {
            return {
                'notification--active': this.isActive,
                'notification--multi-line': this.multiLine,
                'notification--absolute': this.absolute,
                'notification--bottom': this.bottom || !this.top,
                'notification--left': this.left,
                'notification--right': this.right,
                'notification--top': this.top,
                'notification--full-width': this.fullWidth
            }
        },
        verticalProperty() {
            return /^top/.test(this.position) ? 'top' : 'bottom'
        },
        positionStyle() {
            return {
                zIndex: this.zIndex,
                [this.verticalProperty]: `${this.verticalOffset}px`
            }
        },
        wrapperStyle() {
            const { colors } = this.theme
            return {
                ...(colors && this.setBackgroundColor(colors[this.type]))
            }
        },
        iconStyle() {
            const { colors } = this.theme
            return {
                ...(colors && this.setBackgroundColor(colors[`${this.type}Darken`]))
            }
        },
        iconType() {
            return this.type && NOTIFICATION_ICONS[this.type]
        }
    },
    watch: {
        isActive: {
            async handler() {
                await this.$nextTick()
                this.setTimeout()
            },
            immediate: true
        }
    },
    methods: {
        handleCollapse() {
            const { firstChild: element } = this.$el.querySelector('.notification__dropdown')
            element.style.transition = 'all 0.5s'
            element.style.transform = !this.collapse ? 'rotate(-180deg)' : 'rotate(0deg)'

            this.collapse = !this.collapse
        },
        collapseMessage() {
            const { nextElementSibling: content } = this.$el.querySelector(`.collapsible`)

            if (content.style.display === 'block') content.style.display = 'none'
            else content.style.display = 'block'
        },
        setTimeout() {
            clearTimeout(this.activeTimeout)
            if (!this.isActive || !this.closeDelay) return
            this.activeTimeout = setTimeout(() => {
                this.isActive = false
            }, this.closeDelay)
        },
        destroyElement() {
            this.$destroy(true)
            this.$el.parentNode.removeChild(this.$el)
        },
        close() {
            this.isActive = false
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../styles/abstracts/functions', '../../styles/abstracts/variables', '../../styles/abstracts/mixins';

.text-truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.notification .notification *,
.notification ::before,
.notification ::after {
    box-sizing: border-box;
}

.notification {
    position: fixed;
    display: flex;
    align-items: center;
    left: 0;
    right: 0;
    font-size: 14px;
    color: white;
    pointer-events: none;
    transition: all 0.4s get-easing(swing);
    transition-property: transform, top, bottom, opacity;

    &--absolute {
        position: absolute;
    }

    &--top {
        top: 0;
    }

    &--bottom {
        bottom: 0;
    }

    &--left,
    &--right {
        @include mq(phone) {
            &:not(.notification--full-width) {
                margin: 0 ($gutter * 3);

                &.notification--top {
                    transform: translateY($gutter * 3);
                }
                &.notification--bottom {
                    transform: translateY(0 - ($gutter * 3));
                }
            }
        }
    }

    &__wrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        background-color: black;
        pointer-events: auto;

        @include mq(phone) {
            max-width: 400px;
            margin: 0 auto;
            border-radius: get-border-radius(1);

            .notification--left & {
                margin-left: 0;
            }
            .notification--right & {
                margin-right: 0;
            }

            .notification--full-width & {
                width: 100%;
                max-width: 100%;
                border-radius: 0;
            }
        }
    }

    &__content {
        position: relative;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        min-height: 48px;
        padding: $gutter ($gutter * 3);
        overflow: hidden;
    }

    &--multi-line &__content {
        min-height: 80px;
        padding: ($gutter * 2) ($gutter * 3);
    }

    &__title {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        p {
            font-stretch: normal;
            letter-spacing: 0.23px;
            line-height: inherit;
            font-weight: 400;
            margin: 0;
        }
    }

    &__button {
        position: relative;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    &__close,
    &__dropdown {
        svg {
            position: relative;
            height: 20px;
            width: 20px;
        }
    }

    button {
        @include reset-button();
        position: relative;
        display: inline-flex;
        flex: 0 0 auto;
        align-items: center;
        justify-content: center;
        border-radius: get-border-radius(1);
        cursor: pointer;

        padding: $gutter;
        // margin: 0 0 0 $gutter * 2;
        height: auto;
        color: white;
        font-size: 14px;
        font-weight: 500;
        outline: 0;
        text-decoration: none;
        transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), color 1ms;
        user-select: none;

        &:hover {
            background-color: transparentize(black, 0.9);
        }

        &:first-of-type {
            margin: 0 0 0 $gutter * 3;
        }

        &.notification__close,
        &.notification__dropdown {
            border-radius: 50%;
        }
        &.notification__action {
            background-color: transparentize(black, 0.9);
            &:hover {
                background-color: transparentize(black, 0.7);
            }
        }
    }

    &__icon {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: get-border-radius(1);
        width: 26px;
        min-width: 26px;
        height: 26px;
        min-height: 26px;
        margin-right: ($gutter * 2);

        svg {
            position: relative;
            width: auto;
        }
    }
}

.notification-transition {
    &-enter-active,
    &-leave-active {
        transition: transform 0.4s get-easing(swing);

        .notification__content {
            transition: opacity 0.3s linear 0.1s;
        }
    }

    &-enter {
        .notification__content {
            opacity: 0;
        }
    }

    &-enter-to,
    &-leave {
        .notification__content {
            opacity: 1;
        }
    }

    &-enter,
    &-leave-to {
        &.notification.notification--top {
            // Extra 8px to hide the bottom shadow
            transform: translateY(calc(-100% - 8px));

            @include mq(phone) {
                &.notification--right:not(.notification--full-width) {
                    transform: translateY($gutter * 3) translateX(calc(100% + 8px));
                }
                &.notification--left:not(.notification--full-width) {
                    transform: translateY($gutter * 3) translateX(calc(-100% - 8px));
                }
            }
        }
        &.notification.notification--bottom {
            transform: translateY(100%);

            @include mq(phone) {
                &.notification--right:not(.notification--full-width) {
                    transform: translateY(0 - ($gutter * 3)) translateX(calc(100% + 8px));
                }
                &.notification--left:not(.notification--full-width) {
                    transform: translateY(0 - ($gutter * 3)) translateX(calc(-100% - 8px));
                }
            }
        }
    }
}

.content {
    &-enter-active,
    &-leave-active {
        transition: all 0.15s;
    }

    &-enter,
    &-leave-to {
        transform: translateY(-10px);
        opacity: 0;
    }
}

.arrow {
    border: solid white;
    border-width: 0 2px 2px 0;
    display: inline-block;
    padding: 3px;
}

.up {
    transform: rotate(-135deg);
    -webkit-transform: rotate(-135deg);
}

.down {
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
}
</style>
