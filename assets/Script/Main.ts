import CustomRenderComponent from "../components/RenderComponent/CustomRenderComponent";
import CustomShaderUpdate from "../components/RenderComponent/CustomShaderUpdate";
import AudioManger from "../components/Audio/AudioManger";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    start() {
        cc.game.setFrameRate(30)
    }

    // update (dt) {}

    private _change: number = undefined
    change() {
        if (this._change == undefined) {
            this._change = 0
            this.getComponentInChildren(AudioManger).playBackgroundSound()
            this.getComponentInChildren(cc.Button).node.getComponentInChildren(cc.Label).string = "点击按钮更换背景"
        }
        let path = ""
        this._change++
        if (this._change % 2 == 0) {
            path = "Shader/SquaresBackground/ltp-SquaresBackground"
        } else {
            path = "Shader/NeonLines/ltp-NeonLines"
        }
        cc.loader.loadRes(path, cc.Material, (err: Error, res: cc.Material) => {
            this.getComponentInChildren(CustomRenderComponent).setMaterial(0, res)
            this.getComponentInChildren(CustomShaderUpdate).refresh()
        })
    }
}
