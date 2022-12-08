# uniapp 集成小程序自定义组件

## 允许在 uniapp 组件级使用小程序原生平台组件

## 环境

uniapp + webpack

## 支持平台

暂只支持 微信, 字节, qq 和 支付宝, 通过第二个参数区分平台

wx | tt | ax | q

## 使用

```ts
plugins: [
    ...
    new UniappCustomizeComponent({
        'components/audio/index': { 'wx-pay-button': '/wxcomponent/WxPayButton/index' }
      }, 'wx')
  ],
```

## 说明

如有疑问, 辛苦提一下 issue, 目前仅自测字节和微信小程序, 其余小程序平台未知
