 
import CustomRenderComponent from './CustomRenderComponent'
 
const { ccclass, property } = cc._decorator
 
/*
uTime: 时间参数(秒)
uResolution: 画布尺寸
 */
@ccclass
export default class CustomShaderUpdate extends cc.Component {
 
    @property({ type: cc.RenderComponent })
    private _component: cc.RenderComponent = null
    @property({ type: cc.RenderComponent })
    get component(): cc.RenderComponent {
        return this._component
    }
    set component(comp: cc.RenderComponent) {
        this._component = comp
    }
 
    @property({ type: cc.RenderComponent })
    componentList: cc.RenderComponent[] = []
 
    @property()
    enableTimer: boolean = true
 
    @property()
    _channel0: cc.Texture2D = null
    @property()
    _channel1: cc.Texture2D = null
    @property()
    _channel2: cc.Texture2D = null
    @property()
    _channel3: cc.Texture2D = null
 
    @property({ type: cc.Texture2D, tooltip: "Shader纹理参数" })
    set channel0(tex: cc.Texture2D) {
        this._channel0 = tex
        if (this._channel0 != null) {
            this.setProperty("uChannel0", this.channel0)
        }
    }
    get channel0(): cc.Texture2D { return this._channel0 }
    @property({ type: cc.Texture2D, tooltip: "Shader纹理参数" })
    set channel1(tex: cc.Texture2D) {
        this._channel1 = tex
        if (this._channel1 != null) {
            this.setProperty("uChannel1", this.channel1)
        }
    }
    get channel1(): cc.Texture2D { return this._channel1 }
    @property({ type: cc.Texture2D, tooltip: "Shader纹理参数" })
    set channel2(tex: cc.Texture2D) {
        this._channel2 = tex
        if (this._channel2 != null) {
            this.setProperty("uChannel2", this.channel2)
        }
    }
    get channel2(): cc.Texture2D { return this._channel2 }
    @property({ type: cc.Texture2D, tooltip: "Shader纹理参数" })
    set channel3(tex: cc.Texture2D) {
        this._channel3 = tex
        if (this._channel3 != null) {
            this.setProperty("uChannel3", this.channel3)
        }
    }
    get channel3(): cc.Texture2D { return this._channel3 }
 
    //_material: cc.Material = null
    _time = 0
    public get material(): cc.Material {
        if (this._component && this._component.sharedMaterials.length > 0) {
            return this._component.sharedMaterials[0]
        }
        return null
    }
 
    public uMouse: cc.Vec2 = cc.v2()
 
    _allProperty: Map<string, boolean> = new Map<string, boolean>()
    protected hasProperty(name: string, material?: cc.Material): boolean {
        if (!material) { material = this.material }
        if (material) {
            return !!material.effect._properties[name]
        }
        return false
 
        //尝试设置属性,主要是为了避免调试阶段的warn
        if (this._allProperty.has(name)) {
            return this._allProperty.get(name)
        }
        if (this.material) {
            this._allProperty.set(name, !!this.material.effect._properties[name])
            return this._allProperty.get(name)
        }
        return false
    }
 
    setProperty(name: string, value: any, material?: cc.Material) {
        if (!material) { material = this.material }
        if (this.hasProperty(name, material)) {
            material.setProperty(name, value, false)
        }
    }
 
    protected onEnable() {
        if (this.component != null) {
            //this._material.setProperty('uResolution', cc.v2(this.node.width, this.node.height), false)
        } else if (this.node.getComponent(cc.RenderComponent)) {
            this.component = this.node.getComponent(cc.RenderComponent)
        }
    }
 
    protected start() {
        this._time = 0
        this.refresh()
    }
 
    //更改material,或者texture之类的东西的时候调用
    public refresh() {
        let material = this.material
        this._allProperty.clear()
        if (this.channel0 != null) {
            this.setProperty("uChannel0", this.channel0, material)
        }
        if (this.channel1 != null) {
            this.setProperty("uChannel1", this.channel1, material)
        }
        if (this.channel2 != null) {
            this.setProperty("uChannel2", this.channel2, material)
        }
        if (this.channel3 != null) {
            this.setProperty("uChannel3", this.channel3, material)
        }
        this.setProperty('uResolution', cc.v2(this.node.width, this.node.height), material)
    }
 
    protected update(dt: number) {
        if (this.component) {
            this.setTime(dt)
            //this._material.setProperty('uMouse', this.uMouse, true)
            this.setProperty('uMouse', this.uMouse.clone())
        }
    }
 
    protected setTime(dt: number) {
        if (!this.enableTimer) { return }
        this._time += dt
        //this._material.setProperty('uTime', this._time, false)
        this.setProperty('uTime', this._time, this.material)
    }
 
    protected onDisable() {
        this._component = null
    }
}
 
