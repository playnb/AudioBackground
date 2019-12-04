import CustomShaderUpdate from "../RenderComponent/CustomShaderUpdate";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AudioManger extends cc.Component {
    @property({ type: cc.AudioClip })
    BackgroundSound: cc.AudioClip = null

    @property({ type: CustomShaderUpdate })
    shader: CustomShaderUpdate = null

    backgroundSoundChannel: cc.Texture2D = null
    private _backgroundSoundChannelBuffer: Uint8Array = null
    private _backgroundSoundAnalyser: AnalyserNode = null
    private _touchPlay: boolean = false
    private _bufferSourceList: Array<AudioBufferSourceNode> = []
    playBackgroundSound() {
        if (!this.BackgroundSound) { return }

        if (window.AudioContext || window["webkitAudioContext"]) {
            let self = this
            let audioCtx: AudioContext = null
            if (window.AudioContext) {
                audioCtx = new window.AudioContext()
            } else {
                audioCtx = new window["webkitAudioContext"]()
            }
            let bufferSource = audioCtx.createBufferSource()
            let gainnode = audioCtx.createGain()
            self._backgroundSoundAnalyser = audioCtx.createAnalyser()
            self._backgroundSoundAnalyser.fftSize = 1024
            bufferSource.buffer = this.BackgroundSound["_audio"]
            bufferSource.loop = true
            bufferSource.onended = function () {
                cc.log("playBackgroundSound:onended", this)
            }

            if (self._touchPlay) {
                bufferSource.start()
            } else {
                self._bufferSourceList.push(bufferSource)
            }

            bufferSource.connect(self._backgroundSoundAnalyser)
            self._backgroundSoundAnalyser.connect(gainnode)
            gainnode.connect(audioCtx.destination)
            setInterval(() => {
                if (!self._touchPlay) {
                    return
                }
                if (self._backgroundSoundChannelBuffer == null) {
                    self._backgroundSoundChannelBuffer = new Uint8Array(self._backgroundSoundAnalyser.frequencyBinCount)
                    self.backgroundSoundChannel = new cc.Texture2D()
                }
                this.shader.channel0 = self.backgroundSoundChannel
                self._backgroundSoundAnalyser.getByteFrequencyData(self._backgroundSoundChannelBuffer)
                self.backgroundSoundChannel.initWithData(self._backgroundSoundChannelBuffer,
                    cc.Texture2D.PixelFormat.RGBA8888,
                    self._backgroundSoundChannelBuffer.length / 4 / 1,
                    1)
                //cc.log(self._backgroundSoundChannelBuffer)
            }, 30)
        } else {
            cc.log("不支持 window.AudioContext||window.webkitAudioContext... 太可怜啦!!!!!")
            cc.audioEngine.playMusic(this.BackgroundSound, true)
        }
    }

    onLoad() {
        let self = this
        let touchEventName = ('ontouchend' in window) ? 'touchend' : 'mousedown';
        // Listen to the touchstart body event and play the audio when necessary.
        cc.game.canvas.addEventListener(touchEventName, function () {
            if (self._touchPlay) {
                return
            }
            cc.log("AudioContext:Start===================>")
            self._touchPlay = true
            self._bufferSourceList.forEach((s: AudioBufferSourceNode) => {
                s.start()
            })
            self._bufferSourceList = []
        })
        cc.audioEngine.setMusicVolume(0.5)
        cc.audioEngine.setEffectsVolume(0.5)
        /*
        let audioCtx = new window.AudioContext()
        let oscillator = audioCtx.createOscillator()
        oscillator.type = 'triangle' //设置波形，可选值：'square','triangle','sawtooth','sine'
        var gainNode = audioCtx.createGain()
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.01)
        oscillator.connect(gainNode)
        gainNode.connect(audioCtx.destination)
        oscillator.start(audioCtx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1)
        oscillator.stop(audioCtx.currentTime + 1)
        */
    }

    start() {

    }

    update(dt: number) { }
}

