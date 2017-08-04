<template>
    <div class="item" @click="inputClick">
        <span class="mark">{{ label }}</span>
        <div class="login-input">
            <input ref="input" :type="type" :class="inputClass" :value="currentValue" :disabled="disabled" :readonly="readonly" :minlength="minlength" :maxlength="maxlength" :placeholder="placeholder" :autofocus="autofocus" @keyup.enter="handleEnter" @focus="handleFocus" @blur="handleBlur" @input="handleInput" @change="handleChange" />
        </div>
        <a v-show="currentValue && isFocus" @click.stop="cleanValue" href="javascript:;" :class="iconClass" class="input-del-box">
            <i class="ff-icon ff-del"></i>
        </a>
        <slot name="right"></slot>
    </div>
</template>
<script>
export default {
    props: {
        type: {
            type: String,
            default: 'text'
        },
        label: {
            type: String,
            default: false
        },
        value: {
            type: [String, Number],
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        },
        maxlength: {
            type: Number
        },
        minlength: {
            type: Number
        },
        disabled: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        autofocus: {
            type: Boolean,
            default: false
        },
        inputClass: {
            type: String,
            default: ''
        },
        iconClass: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isFocus: false,
            currentValue: ''
        }
    },
    watch: {
        value(value) {
            this.setCurrentValue(value);
        }
    },
    methods: {
        cleanValue() {
            this.$emit('clean', event);
            this.$emit('input', '');
            this.setCurrentValue('');
            this.$emit('change', event);
        },
        handleEnter() {
            this.$emit('enter', event);
        },
        handleFocus() {
            this.isFocus = true;
            this.$emit('focus', event);
        },
        handleBlur() {
            // 安卓机上，点击“x”会先失焦，无法清空input
            setTimeout(() => {
                this.isFocus = false;
                this.$emit('blur', event);
            }, 100)
        },
        handleInput(event) {
            let value = event.target.value;
            this.$emit('input', value);
            this.setCurrentValue(value);
            this.$emit('change', event);
        },
        handleChange() {
            this.$emit('change', event);
        },
        setCurrentValue(value) {
            if (value === this.currentValue) return;
            this.currentValue = value;
        },
        inputClick() {
            if (this.disabled || this.readonly) {
                return;
            }
            this.$refs.input.focus();
        },
        focus() {
            this.$refs.input.focus();
        }
    }
}
</script>
