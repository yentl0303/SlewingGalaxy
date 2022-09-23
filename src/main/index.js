// 1.导入threejs
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
// 2.初始化场景
const scene = new THREE.Scene();

// 3.初始化透视相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// 4.设置相机位置
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix(); // 更新投影矩阵
camera.position.set(0, 0, 5);
// 5.将相机添加进场景
scene.add(camera);

//6.加入辅助坐标轴
const axse = new THREE.AxesHelper(5);
scene.add(axse);

//7.初始化渲染器
const renderer = new THREE.WebGL1Renderer();
// 设置画布大小
renderer.setSize(window.innerWidth, window.innerHeight);

// 8.将渲染器加入dom
document.body.appendChild(renderer.domElement);

const clock = new THREE.Clock();
// 10.创建轨道控制器
const control = new OrbitControls(camera, renderer.domElement);

//9.渲染器渲染场景
function animate(t) {
  const elapsedTime = clock.getElapsedTime();
  // t.uniforms.uTime.value = elapsedTime;
  
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
