import { View, ViewStyle } from './View'
import { formatWebPureNumberPxUnit, formatPureNumberPxUnit } from '../../common/utils'
export interface CanvasStyle extends ViewStyle { }

export class CanvasView extends View {
    protected _style: CanvasStyle
    private ctx: any
    private textFillStyle: string = '#000000'
    private fillStyle: string = '#000000'
    private resolution!: number
    constructor() {
        super()
        this._style = new Proxy(this._style, {
            get: (target, key) => {
                // 获取style
                return target[key] || this.node.style[key]
            },
            set: (target, key, value) => {
                // 设置style
                // @ts-ignore
                target[key] = value
                switch (key) {
                    case 'width':
                        this.node.style[key] = value
                        if (value.indexOf('%') !== -1) {
                            console.error('canvas宽高不支持设置百分比')
                        }
                        this.node.width = formatWebPureNumberPxUnit(value) * this.resolution
                        break
                    case 'height':
                        this.node.style[key] = value
                        if (value.indexOf('%') !== -1) {
                            console.error('canvas宽高不支持设置百分比')
                        }
                        this.node.height = formatWebPureNumberPxUnit(value) * this.resolution
                        break
                }
                return true
            }
        })
    }
    protected createNode() {
        this.node = document.createElement('canvas')
        this.resolution = window.devicePixelRatio
        this.ctx = this.node.getContext('2d');
    }
    /**
    * 设置stroke的线粗细
    * @param widthValue 粗细值，支持px，hm 单位， 如果不写单位就是dp
    */
    lineWidth(widthValue) {
        this.ctx.lineWidth = formatPureNumberPxUnit(widthValue)
    }
    /**
     * 设置线头样式
     * @param value 0 : LineCapButt, ， 1:LineCapRound   2:LineCapSquare
     */
    lineCap(value) {
        switch (value) {
            case 0:
                this.ctx.lineCap = 'butt'
                break;
            case 1:
                this.ctx.lineCap = 'round'
                break;
            case 2:
                this.ctx.lineCap = 'square'
                break;
            default:
                this.ctx.lineCap = 'butt'
                break;
        }
    }
    /**
     * 设置折线折点样式
     * @param value 0 : LineJoinMiter, ， 1: LineJoinRound  2:LineJoinBevel
     */
    lineJoin(value) {
        switch (value) {
            case 0:
                this.ctx.lineCap = 'miter'
                break;
            case 1:
                this.ctx.lineCap = 'round'
                break;
            case 2:
                this.ctx.lineCap = 'bevel'
                break;
            default:
                this.ctx.lineCap = 'miter'
                break;
        }
    }
    /**
     * 设置stroke的线颜色
     * @param colorHex 色值
     */
    lineColor(colorHex) {
        this.ctx.strokeStyle = colorHex
    }
    /**
     * 根据入参，在起始点与终点之间画一条线段
     * @param fromX 起点的x值，支持px，hm 单位， 如果不写单位就是dp
     * @param fromY 起点的y值，支持px，hm 单位， 如果不写单位就是dp
     * @param toX 终点的x值，支持px，hm 单位， 如果不写单位就是dp
     * @param toY 终点的y值，支持px，hm 单位， 如果不写单位就是dp
     */
    drawLine(fromX, fromY, toX, toY) {
        this.ctx.beginPath()
        this.ctx.moveTo(formatPureNumberPxUnit(fromX) * this.resolution, formatPureNumberPxUnit(fromY) * this.resolution)
        this.ctx.lineTo(formatPureNumberPxUnit(toX) * this.resolution, formatPureNumberPxUnit(toY) * this.resolution)
        this.ctx.stroke()
    }
    /**
     * 画矩形
     * @param x 矩形左上角坐标点的x值，支持px，hm 单位， 如果不写单位就是dp
     * @param y 矩形左上角坐标点的y值，支持px，hm 单位， 如果不写单位就是dp
     * @param w 矩形宽，支持px，hm 单位， 如果不写单位就是dp
     * @param h 矩形高，支持px，hm 单位， 如果不写单位就是dp
     */
    strokeRect(x, y, w, h) {
        this.ctx.beginPath()
        this.ctx.strokeRect(formatPureNumberPxUnit(x) * this.resolution, formatPureNumberPxUnit(y) * this.resolution, formatPureNumberPxUnit(w) * this.resolution, formatPureNumberPxUnit(h) * this.resolution)
    }
    /**
     * 画椭圆
     * @param x 椭圆所在矩形左上角坐标点的x值，支持px，hm 单位， 如果不写单位就是dp
     * @param y 椭圆所在矩形左上角坐标点的y值，支持px，hm 单位， 如果不写单位就是dp
     * @param trailX 椭圆所在矩形右下角坐标点的x值，支持px，hm 单位， 如果不写单位就是dp
     * @param trailY 椭圆所在矩形右下角坐标点的y值，支持px，hm 单位， 如果不写单位就是dp
     */
    strokeEllipse(x, y, trailX, trailY) {
        x = formatPureNumberPxUnit(x)
        y = formatPureNumberPxUnit(y)
        trailX = formatPureNumberPxUnit(trailX)
        trailY = formatPureNumberPxUnit(trailY)
        let centerX = x + (trailX - x) / 2
        let centerY = y + (trailY - y) / 2
        let radiusX = (trailX - x) / 2
        let radiusY = (trailY - y) / 2
        this.ctx.beginPath()
        this.ctx.ellipse(centerX * this.resolution, centerY * this.resolution, radiusX * this.resolution, radiusY * this.resolution, 0, 0, 2 * Math.PI)
        this.ctx.stroke()
    }
    /**
     * 画圆形
     * @param x 圆心坐标点的x值，支持px，hm 单位， 如果不写单位就是dp
     * @param y 圆心坐标点的y值，支持px，hm 单位， 如果不写单位就是dp
     * @param radius 半径 ， 支持px，hm 单位， 如果不写单位就是dp
     */
    strokeCircle(x, y, radius) {
        this.ctx.beginPath()
        this.ctx.arc(formatPureNumberPxUnit(x) * this.resolution, formatPureNumberPxUnit(y) * this.resolution, formatPureNumberPxUnit(radius) * this.resolution, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    /**
     * 画弧形
     * @param x 圆心坐标点的x值，支持px，hm 单位， 如果不写单位就是dp
     * @param y 圆心坐标点的y值，支持px，hm 单位， 如果不写单位就是dp
     * @param raduis 半径 ， 支持px，hm 单位， 如果不写单位就是dp
     * @param startAngle 起始弧度 ， 
     * @param endAngle 结束弧度 ，
     * @param clockwise ture 顺时针 ， false 逆时针
     */
    arc(x, y, radius, startAngle, endAngle, clockwise) {
        this.ctx.beginPath()
        this.ctx.arc(formatPureNumberPxUnit(x) * this.resolution, formatPureNumberPxUnit(y) * this.resolution, formatPureNumberPxUnit(radius) * this.resolution, startAngle, endAngle, clockwise);
        this.ctx.stroke();
    }
    /**
     * 设置填充颜色
     * @param colorHex 颜色16进制
     */
    fillColor(colorHex) {
        this.fillStyle = colorHex
        this.ctx.fillStyle = this.fillStyle
        // this.ctx.fill();
    }
    /**
     * 填充矩形
     * @param x 矩形左上角坐标点的x值，支持px，hm 单位， 如果不写单位就是dp
     * @param y 矩形左上角坐标点的y值，支持px，hm 单位， 如果不写单位就是dp
     * @param w 矩形宽，支持px，hm 单位， 如果不写单位就是dp
     * @param h 矩形高，支持px，hm 单位， 如果不写单位就是dp
     */
    fillRect(x, y, w, h) {
        this.ctx.beginPath()
        this.fillColor(this.fillStyle || '#000000')
        this.ctx.fillRect(formatPureNumberPxUnit(x) * this.resolution, formatPureNumberPxUnit(y) * this.resolution, formatPureNumberPxUnit(w) * this.resolution, formatPureNumberPxUnit(h) * this.resolution)
    }
    /**
     * 填充椭圆
     * @param x 椭圆所在矩形左上角坐标点的x值，支持px，hm 单位， 如果不写单位就是dp
     * @param y 椭圆所在矩形左上角坐标点的y值，支持px，hm 单位， 如果不写单位就是dp
     * @param trailX 椭圆所在矩形右下角坐标点的x值，支持px，hm 单位， 如果不写单位就是dp
     * @param trailY 椭圆所在矩形右下角坐标点的y值，支持px，hm 单位， 如果不写单位就是dp
     */
    fillEllipse(x, y, trailX, trailY) {
        x = formatPureNumberPxUnit(x)
        y = formatPureNumberPxUnit(y)
        trailX = formatPureNumberPxUnit(trailX)
        trailY = formatPureNumberPxUnit(trailY)
        let centerX = x + (trailX - x) / 2
        let centerY = y + (trailY - y) / 2
        let radiusX = (trailX - x) / 2
        let radiusY = (trailY - y) / 2
        let lineColor = this.ctx.strokeStyle
        this.ctx.beginPath()
        this.lineColor('rgba(0,0,0,0)')
        this.ctx.ellipse(centerX * this.resolution, centerY * this.resolution, radiusX * this.resolution, radiusY * this.resolution, 0, 0, 2 * Math.PI)
        this.fillColor(this.fillStyle || '#000000')
        this.ctx.fill();
        this.ctx.stroke()
        this.lineColor(lineColor)
    }
    /**
     * 填充圆形
     * @param x 圆心坐标点的x值，支持px，hm 单位， 如果不写单位就是dp
     * @param y 圆心坐标点的y值，支持px，hm 单位， 如果不写单位就是dp
     * @param raduis 半径 ， 支持px，hm 单位， 如果不写单位就是dp
     */
    fillCircle(x, y, radius) {
        x = formatPureNumberPxUnit(x)
        y = formatPureNumberPxUnit(y)
        radius = formatPureNumberPxUnit(radius)
        let lineColor = this.ctx.strokeStyle
        this.ctx.beginPath()
        this.lineColor('rgba(0,0,0,0)')
        this.ctx.arc(x * this.resolution, y * this.resolution, radius * this.resolution, 0, 2 * Math.PI);
        this.fillColor(this.fillStyle || '#000000')
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
        this.lineColor(lineColor)
    }
    /**
     * 设置绘制文本字号
     * @param size 字号大小
     */
    fontSize(size) {
        this.ctx.font = `${size * this.resolution}px sans-serif`
    }
    /**
     * 设置绘制文本颜色
     * @param colorHex 字号色值
     */
    textColor(colorHex) {
        this.textFillStyle = colorHex
    }
    /**
     * 绘制文字
     * @param text 文案
     * @param x 文本左上角坐标x值 , 支持px，hm 单位， 如果不写单位就是dp
     * @param y 文本左上角坐标点的y值，支持px，hm 单位， 如果不写单位就是dp
     * @param maxWidth 文本换行的最大宽度, 0 代表不换行,支持px，hm 单位， 如果不写单位就是dp
     */
    fillText(text, x, y, maxWidth) {
        x = formatPureNumberPxUnit(x)
        y = formatPureNumberPxUnit(y)
        maxWidth = formatPureNumberPxUnit(maxWidth)
        this.ctx.beginPath()
        this.ctx.textBaseline = "top"
        this.ctx.fillStyle = this.textFillStyle
        this.ctx.fillText(text, x * this.resolution, y * this.resolution, maxWidth * this.resolution)
    }
    /**
     * 绘制图片
     * @param src 图片资源链接,远程url或本地图片名
     * @param x 图片左上角坐标x值 , 支持px，hm 单位， 如果不写单位就是dp
     * @param y 图片左上角坐标点的y值，支持px，hm 单位， 如果不写单位就是dp
     * @param width 图片宽 ,支持px，hm 单位， 如果不写单位就是dp
     * @param height 图片高 ,支持px，hm 单位， 如果不写单位就是dp
     */
    drawImage(src, x, y, width, height) {
        x = formatPureNumberPxUnit(x)
        y = formatPureNumberPxUnit(y)
        width = formatPureNumberPxUnit(width)
        height = formatPureNumberPxUnit(height)
        var img = new Image();
        img.src = src;
        img.onload = () => {
            this.ctx.beginPath()
            this.ctx.drawImage(img, x * this.resolution, y * this.resolution, width * this.resolution, height * this.resolution)
        }
    }
}
