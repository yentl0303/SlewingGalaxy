// 1.导入threejs
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 2.初始化场景
const scene = new THREE.Scene()

// 3.初始化透视相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
// 4.设置相机位置
camera.aspect = window.innerWidth / window.innerHeight
camera.updateProjectionMatrix() // 更新投影矩阵
camera.position.set(0, 0, 6)
// 5.将相机添加进场景
scene.add(camera)

//6.加入辅助坐标轴
const axse = new THREE.AxesHelper(10)
scene.add(axse)

//13.设置星系参数
const params = {
  count: 3000, // 星球个数
  size: 0.1,
  radius: 5,
  branches: 3,
  spin: 0.5,
  color: '#ff6030',
  outColor: '#1b3984',
  rotateScale: 0.3, // 弯曲程度影响
}
// 导入纹理
const texture = new THREE.TextureLoader()
const particlesTexture = texture.load('asstes/particles/1.png')
//14.生成点
// 14.1
let geometry = null // 图形
let points = null // 点
let material = null // 点材质
function generateGalaxy () {
  // 14.1生成顶点几何
  geometry = new THREE.BufferGeometry()
  // 14.2随机生成位置
  // 缓冲区数组
  // 顶点数组
  const positions = new Float32Array(params.count * 3)
  // 顶点颜色数组
  const colors = new Float32Array(params.count * 3)
  // 结束颜色
  const centerColor = new THREE.Color(params.color)
  const endColor = new THREE.Color(params.endColor)
  // 14.3 循环生成点
  for (let i = 0; i < params.count; i++) {
    // 14.3.3 当前点应该在哪一条分支上
    const branchAngel = (i % params.branches) * ((2 * Math.PI) / params.branches);

    // 14.3.1当前点
    const current = i * 3
    // 14.3.2当前点距离圆心的距离
    const distance = Math.random() * params.radius * Math.pow(Math.random(), 3) 

    // 14.3.5随机设置xyz偏移值
    const randomX = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5
    const randomY = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5
    const randomZ = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5

    // 14.3.4设置坐标
    // 设置当前点x值坐标
    positions[current] = Math.cos(branchAngel + distance * params.rotateScale) * distance + randomX
    // 设置当前点Y值坐标
    positions[current + 1] = 0 + randomY
    // 设置当前点Z值坐标
    positions[current + 2] = Math.sin(branchAngel + distance * params.rotateScale) * distance + randomZ
    // 14.3.6 混合颜色，形成渐变色
    const mixColor = centerColor.clone();
    mixColor.lerp(endColor, distance / params.radius)
    colors[current] = mixColor.r
    colors[current + 1] = mixColor.g
    colors[current + 2] = mixColor.b
  }

  // 14.4设置点材质
  material = new THREE.PointsMaterial({
    // color: new THREE.Color(params.color), // 另外设置颜色要删掉材质颜色，要不然会占据主导地位
    size: params.size,
    sizeAttenuation: true, // 近大远小
    map: particlesTexture, // 贴图
    alphaMap: particlesTexture, // 透明贴图和物体贴图可以是同一个
    transparent: true, // 设置透明贴图必须允许透明
    depthWrite: false, // 深度缓冲关闭，可以遮挡物体会渲染
    blending: THREE.AdditiveBlending, // 叠加算法，AdditiveBlending重叠物体相加，颜色更深
    vertexColors: true, // 顶点颜色开启，不开启设置不了顶点颜色
  })
  // 14.5为图形添加设置属性
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  // 14.5生成点
  points = new THREE.Points(geometry, material)

  // 14.7添加进场景
  scene.add(points)
}
generateGalaxy()

//7.初始化渲染器
const renderer = new THREE.WebGL1Renderer()
// 允许在场景中使用阴影贴图
renderer.shadowMap.enabled = true
// 设置画布大小
renderer.setSize(window.innerWidth, window.innerHeight)

// 11.设置屏幕大小改变画布自适应
window.addEventListener('resize', () => {
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新投影矩阵
  camera.updateProjectionMatrix()
  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 设置渲染器像素比例
  renderer.setPixelRatio(window.devicePixelRatio)
})

// 8.将渲染器加入dom
document.body.appendChild(renderer.domElement)

const clock = new THREE.Clock()
// 10.创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 12.设置控制阻尼
controls.enableDamping = true

//9.渲染器渲染场景
function animate () {
  const elapsedTime = clock.getElapsedTime()
  // 控制器不起效果的原因是控制轨道每一帧都要更新
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
animate()
