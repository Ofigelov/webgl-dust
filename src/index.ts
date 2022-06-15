import './dust.scss';
import * as THREE from 'three';
import { AnaglyphEffect } from 'three/examples/jsm/effects/AnaglyphEffect'
//import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { customAlphabet } from 'nanoid';
import { cameraAim } from 'camera-aim';
import { dustScroll } from 'dust-scroll';

const _positionAlphabet = customAlphabet('0123456789', 3)
const rndPosition = (modifier = 2): number => Math.floor((+_positionAlphabet() - 500) * modifier)

const colors = [0x4676F0, 0x0064B9, 0xD072F1, 0x9F5EF1, 0x6D48FF, 0xFD5101, 0xFFFFFF]

const init = () => {
    const rootNode = document.documentElement.querySelector('#dustRoot');
    if (!rootNode) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 200, 3000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor(0x000000, 0)
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const anaglyphEffect = new AnaglyphEffect(renderer);
    anaglyphEffect.setSize(window.innerWidth, window.innerHeight);
    rootNode.appendChild(renderer.domElement);

    let resizeTimer: number = 0;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
            camera.aspect = window.innerWidth / window.innerHeight;
            anaglyphEffect.setSize(window.innerWidth, window.innerHeight);
        }, 100)
    })
    cameraAim(rootNode, camera);

    const geometry = new THREE.TetrahedronGeometry(1, 1);

    const dustGroups = new Array(3).fill('').map((_, index) => {
        const _dust = new THREE.Group();
        _dust.position.y += 1000 * index;
        colors.forEach((color) => {
            const material = new THREE.MeshPhongMaterial({
                color: color,
                transparent: true,
            })
            for (let i = 0; i < 33; i++) {
                const element = new THREE.Mesh(geometry, material);
                element.position.set(rndPosition(1), rndPosition(6), rndPosition(1));
                element.rotation.set(rndPosition(0.5), rndPosition(0.5), rndPosition(0.5));
                _dust.add(element);
            }
            scene.add(_dust);
        })
        return _dust;
    })

    /*const cube = new THREE.Mesh(
        new THREE.BoxGeometry(10, 10, 10),
        new THREE.MeshPhongMaterial({
            color: 0x0064B9,
        })
    );
    cube.position.set(0, 0, 0);
    scene.add(cube);*/

    const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(-15, -5, 10);
    scene.add(directionalLight);

    anaglyphEffect.render(scene, camera);

    dustScroll(dustGroups);

    const rotate = () => {
        dustGroups.forEach((dust) => {
            dust.position.y -= 0.2;
            dust.rotation.y -= 0.0005;
        })
        requestAnimationFrame(rotate)
    }

    setInterval(() => {
        dustGroups.forEach(dust => {
            if (dust.position.y < -4000) dust.position.y += 8000;
        })
    }, 1000)

    const updateScene = () => {
        anaglyphEffect.render(scene, camera);
        requestAnimationFrame(updateScene)
    }

    updateScene();
    rotate();

    rootNode.classList.add('is-active');
}

init();
