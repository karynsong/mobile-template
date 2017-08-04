// canSend  可发送
// sending  正在发送
// sended   已发送
// sendFail 发送失败

const URLMAP = {
    sms: '/mobile/msg/verificationForSMS',
    voice: '/mobile/msg/verificationForVoice',
}

class VerifyCode {
    constructor({ cutDownTime = 60 } = {}) {
        this.cutDownTime = cutDownTime
        this.leftTime = cutDownTime
        this.sendStatus = 'canSend'
        this.sendType = ''
        this._customEvents = {}
    }

    getCode(phone, type = 'sms', scene = null) {
        if (!phone || phone.length !== 11) {
            $dialog.popup({
                content: '手机号格式错误，请更正后重试'
            });
            return
        }
        const info = this.getStatus()
        if (info.sendStatus == 'canSend') {
            this.sendType = type
            this._setStatus('sending')
            GLOBAL.ajax.get(URLMAP[type], {
                    params: {
                        phone,
                        scene
                    }
                }).then(res => {
                    this._setStatus('sended')
                    this._setCountDown(type)
                }, () => {
                    this._resetStatus(type)
                    this.emit('getVerifyAPIError', res)
                })
                // setTimeout(() => {
                //     this._setStatus('sended')
                //     this._setCountDown(type)
                // }, 1000)
        } else {
            this.emit('justSending', info)
        }
    }

    getStatus() {
        return {
            sendStatus: this.sendStatus,
            sendType: this.sendType,
            leftTime: this.leftTime,
            cutDownTime: this.cutDownTime
        }
    }
    _setCountDown(type) {
        this._cutDownTime()
        this._clearTimer()
        this.timer = setInterval(() => {
            if (this.leftTime < 1) {
                this._clearTimer()
                this._resetStatus(type)
            } else {
                this._cutDownTime()
            }
        }, 1000)
    }

    _cutDownTime() {
        this.leftTime--
            this.emit('timeChange', this.getStatus())
    }

    _resetStatus(type) {
        this.sendType = type
        this.leftTime = this.cutDownTime
        this._setStatus('canSend');
        this.sendType = ''
    }

    _setStatus(type) {
        this.sendStatus = type
        this.emit('statusChange', this.getStatus())
    }

    _clearTimer() {
        this.timer && clearInterval(this.timer)
        this.timer = null
    }

    emit(type, data) {
        if (this._customEvents[type]) {
            this._customEvents[type].forEach(fn => {
                fn.call(this, data)
            })
        }
    }

    on(type, fn) {
        if (!this._customEvents[type]) {
            this._customEvents[type] = []
        }
        this._customEvents[type].push(fn)
    }

    removeCustoms() {
        this._customEvents = {}
    }
}

export default {
    data() {
        return {
            verifyCodeInfo: {
                // 标识发送验证码类型
                type: '',
                // 发送状态
                status: 'canSend',
                // 是否在发送中
                codeSending: false,
                // 获取验证码变化文字描述
                smsDesc: '获取验证码'
            }
        }
    },
    methods: {
        $getverifyCode(...opts) {
            this.$verifyCode.getCode(...opts);
        }
    },
    mounted() {
        this.$verifyCode = new VerifyCode();
        this.$verifyCode.on('statusChange', (info) => {
            this.verifyCodeInfo.status = info.sendStatus;
            this.verifyCodeInfo.type = info.sendType;
            if (info.sendStatus === 'canSend') {
                this.verifyCodeInfo.smsDesc = '获取验证码';
                this.verifyCodeInfo.codeSending = false;
            } else if (info.sendStatus === 'sending') {
                this.verifyCodeInfo.smsDesc = '发送中';
                this.verifyCodeInfo.codeSending = true;
            } else if (info.sendStatus === 'sended') {
                this.verifyCodeInfo.codeSending = true;
            }
        })
        this.$verifyCode.on('timeChange', (info) => {
            this.verifyCodeInfo.smsDesc = `${info.leftTime}秒`;
        })
    }
}