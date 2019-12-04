# AudioBackground for CocosCreator

#### [在线示例](https://ltp.gitee.io/gym/cocos-creator/ShaderSample/wave-show/web-mobile/index.html)

---

- 使用[WebAudio API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Audio_API)播放音乐
- 使用[AnalyserNode](https://developer.mozilla.org/zh-CN/docs/Web/API/AnalyserNode)获取声音频域采用数据
- 将声音频域采用数据作为 cc.Texture2D 的 buffer 数据,并传给 shader 的 uChannel0 变量
- AudioManger: WebAudio 封装
- CustomRenderComponent: 自定义渲染组件,也可用 cc.Sprite 代替
- CustomShaderUpdate: Shader 的 uniform 数据更新组件
