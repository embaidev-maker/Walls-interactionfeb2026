const menuCanvas = document.getElementById('menu-canvas');
const menuScene = new THREE.Scene();
const menuCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const menuRenderer = new THREE.WebGLRenderer({ canvas: menuCanvas, antialias: true, alpha: false });

menuRenderer.setSize(window.innerWidth, window.innerHeight);
menuRenderer.setPixelRatio(window.devicePixelRatio);
menuRenderer.setClearColor(0xffffff);
menuCamera.position.z = 60;

const menuAmbientLight = new THREE.AmbientLight(0xffffff, 0.6);
menuScene.add(menuAmbientLight);

const menuPointLight = new THREE.PointLight(0xffffff, 0.8, 150);
menuPointLight.position.set(20, 20, 20);
menuScene.add(menuPointLight);

const pastelColors = [
    0xFFB3BA,
    0xFFDFBA,
    0xFFFFBA,
    0xBAFFC9,
    0xBAE1FF,
    0xE0BBE4,
    0xFEC8D8,
    0xFFAACC,
    0xAADDFF
];

const menuSpheres = [];
const menuSphereCount = 20;

for (let i = 0; i < menuSphereCount; i++) {
    const size = Math.random() * 3 + 1.5;
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        color: pastelColors[Math.floor(Math.random() * pastelColors.length)],
        shininess: 60,
        transparent: true,
        opacity: 0.7
    });

    const sphere = new THREE.Mesh(geometry, material);

    sphere.position.set(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40 - 20
    );

    sphere.userData = {
        speedX: (Math.random() - 0.5) * 0.05,
        speedY: (Math.random() - 0.5) * 0.05,
        originalY: sphere.position.y,
        floatSpeed: Math.random() * 0.02 + 0.01,
        floatRange: Math.random() * 5 + 3
    };

    menuScene.add(sphere);
    menuSpheres.push(sphere);
}

let menuTime = 0;
function animateMenu() {
    menuTime += 0.01;

    menuSpheres.forEach((sphere, index) => {
        sphere.position.x += sphere.userData.speedX;
        sphere.position.y = sphere.userData.originalY + Math.sin(menuTime * sphere.userData.floatSpeed + index) * sphere.userData.floatRange;

        if (sphere.position.x > 50) sphere.position.x = -50;
        if (sphere.position.x < -50) sphere.position.x = 50;

        const scale = 1 + Math.sin(menuTime * 1.5 + index) * 0.05;
        sphere.scale.set(scale, scale, scale);
    });

    menuRenderer.render(menuScene, menuCamera);
    requestAnimationFrame(animateMenu);
}

setTimeout(() => {
    animateMenu();
}, 3000);

window.addEventListener('resize', () => {
    menuCamera.aspect = window.innerWidth / window.innerHeight;
    menuCamera.updateProjectionMatrix();
    menuRenderer.setSize(window.innerWidth, window.innerHeight);
});
