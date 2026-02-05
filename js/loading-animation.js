const canvas = document.getElementById('canvas-3d');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xffffff);
camera.position.z = 80;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 200);
pointLight.position.set(30, 30, 30);
scene.add(pointLight);

const pastelColors = [
    0xFFB3BA,
    0xFFDFBA,
    0xFFFFBA,
    0xBAFFC9,
    0xBAE1FF,
    0xE0BBE4,
    0xFEC8D8,
    0xD4A5A5,
    0xFFAACC,
    0xAADDFF
];

const spheres = [];
const sphereCount = 25;

for (let i = 0; i < sphereCount; i++) {
    const size = Math.random() * 4 + 2;
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        color: pastelColors[Math.floor(Math.random() * pastelColors.length)],
        shininess: 80,
        transparent: true,
        opacity: 0.85
    });

    const sphere = new THREE.Mesh(geometry, material);

    const angle = (i / sphereCount) * Math.PI * 2;
    const radius = 20 + Math.random() * 30;
    sphere.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 30,
        Math.sin(angle) * radius
    );

    sphere.userData = {
        speed: 0.001 + Math.random() * 0.003,
        radius: radius,
        angle: angle,
        yOffset: Math.random() * Math.PI * 2,
        ySpeed: 0.5 + Math.random() * 0.5
    };

    scene.add(sphere);
    spheres.push(sphere);
}

let time = 0;
function animateLoading() {
    time += 0.01;

    spheres.forEach((sphere, index) => {
        sphere.userData.angle += sphere.userData.speed;

        sphere.position.x = Math.cos(sphere.userData.angle) * sphere.userData.radius;
        sphere.position.z = Math.sin(sphere.userData.angle) * sphere.userData.radius;
        sphere.position.y = Math.sin(time * sphere.userData.ySpeed + sphere.userData.yOffset) * 15;

        const scale = 1 + Math.sin(time * 2 + index) * 0.1;
        sphere.scale.set(scale, scale, scale);
    });

    camera.position.x = Math.sin(time * 0.2) * 5;
    camera.position.y = Math.cos(time * 0.15) * 5;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animateLoading);
}

animateLoading();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainMenu = document.getElementById('main-menu');

    loadingScreen.style.transition = 'opacity 1s ease-out';
    loadingScreen.style.opacity = '0';

    setTimeout(() => {
        loadingScreen.style.display = 'none';
        mainMenu.style.display = 'block';
        mainMenu.style.opacity = '0';

        setTimeout(() => {
            mainMenu.style.transition = 'opacity 1s ease-in';
            mainMenu.style.opacity = '1';
        }, 50);
    }, 1000);
}, 3000);
