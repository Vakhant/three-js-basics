import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui';
import bg from './bg.jpg'
import bg2 from './bg2.jpg'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


const monkeyUrl = new URL('./monkey.glb', import.meta.url)

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true // включить тени
renderer.setSize( window.innerWidth, window.innerHeight );
// рамзмеры окна отображения (размеры canvas)
document.body.appendChild( renderer.domElement );
// создание canvas
const scene = new THREE.Scene();


const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
// PerspectiveCamera(field of view %, aspect ratio - соотношение сторон,
// near, far - глубина и приближенность получившегося пространства по форме напоминающего - усеченную пирамиду)
camera.position.set( -10, 30, 30 );
camera.lookAt( 0, 0, 0 );


// -- LIGHT START --

const ambientLight = new THREE.AmbientLight(0x333333) // общее освещение
scene.add(ambientLight)
// const directionalLight = new THREE.DirectionalLight(0x888888, .8) // направленый свет
// directionalLight.position.set( -30, 50, 0 );
// directionalLight.castShadow = true // источник тени
// directionalLight.shadow.camera.bottom = -12 // увеличение полигона направленного источника света
// const dlLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5) // указатель для направленного света (который источник света, размер helper'a)
// const dlLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera) // линии в которых ограничен направленнный источник света
// scene.add(directionalLight, dlLightHelper, dlLightShadowHelper)

const spotLight  = new THREE.SpotLight(0xffffff)
spotLight.position.set( -100, 100, 0 );
const sLightHelper = new THREE.SpotLightHelper(spotLight)
spotLight.castShadow = true // источник тени
spotLight.distance = 500 // угол
// за качество тени отвечает свойство shadowMapSizeWidth и shadowMapSizeHeight в пикселях
scene.add(spotLight, sLightHelper)

// -- LIGHT END --



// scene.fog = new THREE.Fog(0x111111, 0, 300) // (color, near, far) значение увеличивается линейно до фиксированной дальности
scene.fog = new THREE.FogExp2(0x111111, 0.01) // увеличивается линейно не до фикисрованной дальности



// -- КАРТИНКИ НА ФОНЕ И ТЕКСТУРАХ START --

// renderer.setClearColor(0x999999) // цвет фона

const textureLoader = new THREE.TextureLoader()
// scene.background = textureLoader.load(bg)
const cubeTextureLoader = new THREE.CubeTextureLoader()
scene.background = cubeTextureLoader.load([
	bg2,bg2,bg2,bg2,bg2,bg2
]) // 3d фон


const box2Geometry = new THREE.BoxGeometry( 4, 4, 4 );
const box2Material = new THREE.MeshStandardMaterial( { 
	// color: 0xFFFFFF,
	// map: textureLoader.load(bg)
} );
const box2MultiMaterial = [
	new THREE.MeshBasicMaterial({map: textureLoader.load(bg)}),
	new THREE.MeshBasicMaterial({map: textureLoader.load(bg)}),
	new THREE.MeshBasicMaterial({map: textureLoader.load(bg2)}),
	new THREE.MeshBasicMaterial({map: textureLoader.load(bg)}),
	new THREE.MeshBasicMaterial({map: textureLoader.load(bg2)}),
	new THREE.MeshBasicMaterial({map: textureLoader.load(bg)})
] // отдельный фон на каждую сторону
const box2 = new THREE.Mesh( box2Geometry, box2MultiMaterial );
box2.position.set( 0, 15, 10 );
box2.name = 'theBox'
// box2.material.map = textureLoader.load(bg)
scene.add( box2 );

// -- КАРТИНКИ НА ФОНЕ И ТЕКСТУРАХ END --


// -- HELPERS START --

const orbit = new OrbitControls(camera, renderer.domElement) // перемещение в пространстве
orbit.update()

const axesHelper = new THREE.AxesHelper(5); // линии координат
const gridHelper = new THREE.GridHelper(30, 30); // координатная сетка
scene.add(axesHelper, gridHelper)

const gui = new dat.GUI()
const options = {
	sphereColor: "#666666",
	wireframe: false,
	speed: 0.01,
	angle: 0.2,
	penumbra: 0,
	intensity: 1,
	distance: 51000
}
gui.addColor(options, 'sphereColor').onChange(function(e){
	sphere.material.color.set(e)
})
gui.add(options, 'wireframe').onChange(function(e){
	sphere.material.wireframe = e
})
gui.add(options, 'speed', 0 , 0.1)
gui.add(options, 'angle', 0 , 1)
gui.add(options, 'penumbra', 0 , 1)
gui.add(options, 'intensity', 0 , 1)
gui.add(options, 'intensity', 0 , 1)
gui.add(options, 'distance', 0 , 1000)

// -- HELPERS END --


const boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
const boxMaterial = new THREE.MeshStandardMaterial( { color: 0x663377 } );
const box = new THREE.Mesh( boxGeometry, boxMaterial );
box.position.z = 1
scene.add( box );

const planeGeometry = new THREE.PlaneGeometry(30,30)
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, side:THREE.DoubleSide }) // отображение с обеих сторон
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.rotation.x += -0.5 * Math.PI;
plane.receiveShadow = true // принимать(ловить) тень
scene.add( plane );

const plane2Geometry = new THREE.PlaneGeometry(10,10,2,2) // size, size, poligones, poligones
const plane2Material = new THREE.MeshStandardMaterial({ 
	color: 0xFFFFFF,
	wireframe: true 
}) // отображение с обеих сторон
const plane2 = new THREE.Mesh( plane2Geometry, plane2Material );
plane2.position.set( 10, 10, 15 );
const lastPointZ = plane2.geometry.attributes.position.array.length - 1
scene.add( plane2 );

const sphereGeometry = new THREE.SphereGeometry(4, 50, 50)// радиус, количество сегментов
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x666666, wireframe: false }) // wireframe - отрисовка каркаса, скелета, полигонов
const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
sphere.castShadow = true // источник тени
sphere.position.set( -10, 10, 0 );
scene.add( sphere );


// const vShader = `
//  void main() {
// 	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//  }
// `

// const fShader = `
//  void main() {
// 	gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0);
//  }
// `

const sphere2Geometry = new THREE.SphereGeometry(4)
const sphere2Material = new THREE.ShaderMaterial({ 
	vertexShader: document.getElementById('vertexShader').textContent,
	fragmentShader: document.getElementById('fragmentShader').textContent
 })
const sphere2 = new THREE.Mesh( sphere2Geometry, sphere2Material );
sphere2.position.set( -5, 10, 10 );
scene.add( sphere2 );

const assetsLoader = new GLTFLoader()
assetsLoader.load(monkeyUrl.href, function(gltf){
	const model = gltf.scene
	scene.add(model)
	model.position.set(-12, 4, 10)
}, undefined, // функция сообщающая о прогрессе загрузки модели
 function(error){ // возвращает ошибки
	console.error(error);
})

let step = 0
// let speed = 0


const mousePosition = new THREE.Vector2()
window.addEventListener('mousemove', function(e){
	mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1
	mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1
})
const rayCaster = new THREE.Raycaster()

const sphereId = sphere.id

function animate(time) {
	box.rotation.x += 0.01;
	box.rotation.y += 0.01;

	step += options.speed
	sphere.position.y = 10 * Math.abs(Math.sin(step))

	spotLight.angle = options.angle
	spotLight.penumbra = options.penumbra
	spotLight.intensity = options.intensity
	spotLight.distance = options.distance
	sLightHelper.update()

	rayCaster.setFromCamera(mousePosition, camera)
	const intersects = rayCaster.intersectObjects(scene.children)
	console.log(intersects);

	for(let i = 0; i < intersects.length; i++){
		if(intersects[i].object.id === sphereId){
			intersects[i].object.material.color.set(0xFFFFFF)
		}
		if(intersects[i].object.name === 'theBox'){
			intersects[i].object.rotation.x = time / 1000;
			intersects[i].object.rotation.y = time / 1000;
		}
	}
	
	plane2.geometry.attributes.position.array[0] = 10*Math.random()
	plane2.geometry.attributes.position.array[1] = 10*Math.random()
	plane2.geometry.attributes.position.array[2] = 10*Math.random()
	plane2.geometry.attributes.position.array[lastPointZ] = 10*Math.random()
	plane2.geometry.attributes.position.needsUpdate = true

	renderer.render( scene, camera );
}
renderer.setAnimationLoop(animate)

window.addEventListener('resize', function(){
	camera.aspect = window.innerWidth/window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight, )
})
// This will create a loop that causes the renderer to draw the scene every time the screen is refreshed (on a typical screen this means 60 times per second).
// If you're new to writing games in the browser, you might say "why don't we just create a setInterval ?" The thing is - we could, but requestAnimationFrame
// has a number of advantages. Perhaps the most important one is that it pauses when the user navigates to another browser tab, hence not wasting their precious processing power and battery life.








