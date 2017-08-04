<template>
	<div v-show="isShow">
	<!-- <div v-show="isShow" style="opacity: 0"> -->
		<div class="yo-mask" @click.stop="hide"></div>
		<div class="yo-actionsheet" :class='className' ref="container">
			<div class="menu">
				<h3 v-if="title" class="title" v-html="title"></h3>
				<slot name="title"></slot>
				<div ref="actionList" class="main">
                	<div>
						<slot name="list"></slot>
					</div>
        		</div>
			</div>
			<ul class="action">
				<li class="item item-light" @click.stop="hide">取消</li>
			</ul>
        </div>
    </div>
</template>
<script>
export default {
	$config: {
        hasScroll: true
    },
	props: {
		title: {
			type: String,
			defalut: ''
		},
		// 自定义样式
		className: {
			type: String,
			defalut: ''
		}
	},
	data () {
		return {
			isShow: false
		}
	},
	methods: {
		show() {
			this.isShow = true;
			this.$nextTick(() => {
				var self = this;
				this.containerHeight = this.$refs.container.clientHeight;
				this.$refs.container.style.bottom = -1 * this.containerHeight + 'px';
				// TweenMax.to(this.$el, .1, {
				// 	opacity: 1
				// });
				TweenMax.to(this.$refs.container, .2, {
					delay: 0.1,
					bottom: 0,
					onComplete(){
						self.$emit('show');
					}
				});
				this.$scrollDisable();
				this.scroll.enable();
				this.scroll.scrollTo(0,0);
				this.scroll.refresh();
			});
		},
		hide() {
			var self = this;
			TweenMax.to(this.$el, .1, {
				delay: 0.1,
				// opacity: 0,
				onComplete(){
					self.isShow = false;
					self.$emit('hide');
				}
			});
			TweenMax.to(this.$refs.container, .2, {
				bottom: -1 * this.containerHeight + 'px'
			});
			this.$scrollAble();
			this.scroll.disable();
		}
	},
    mounted() {
		this.scroll = new IScroll(this.$refs.actionList, {
            preventDefault: false,
            scrollbars: true,
            shrinkScrollbars: 'scale',
            interactiveScrollbars:true
        });
        this.$config.scrollArr.push(this.scroll);
    }
}
</script>