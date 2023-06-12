import { useRef, useEffect } from 'react'
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";

// props.bin defines bin
export default function BinThreeJS(props) {

    const canvasRef = useRef(null);

    var controls

    useEffect(() => {
        // Create a ThreeJS scene and camera
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, props.width / props.height, 1, 1000);
        // vision slightly from above

        // Calculate the distance based on the maximum dimension of the cuboid
        const maxDimension = Math.max(props.bin.x, props.bin.y, props.bin.z);
        const distance = maxDimension / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));

        // Set the camera position to ensure the cuboid is entirely visible (1.5 as factor for z pratically turns out to be good choice)
        camera.position.z = distance * 1.5;
        camera.position.x = maxDimension / 2;
        camera.position.y = maxDimension / 2;

        // Create a ThreeJS renderer and attach it to the canvas
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
        renderer.setSize(props.width, props.height);
        renderer.setClearColor("#FAFAFA");

        // orbit controls 
        controls = new OrbitControls(camera, renderer.domElement)
        // update as soon as change is made
        controls.update()

        // Create a ThreeJS cube and add it to the scene
        const geometry = new THREE.BoxGeometry(props.bin.x, props.bin.y, props.bin.z);
        // blue box
        const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        const binObject = new THREE.Mesh(geometry, material);
        scene.add(binObject);
        binObject.position.set(0, 0, 0)

        // add lines to the cube as well (white)
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
        scene.add(line);

        // Animate the cube (not used)
        const animate = () => {
            requestAnimationFrame(animate);
            // binObject.rotation.x += 0.01;
            // binObject.rotation.y += 0.01;
            renderer.render(scene, camera);
        };
        animate();

        // axex Helper, remove later
        // const axesHelper = new THREE.AxesHelper(5);
        // scene.add(axesHelper);

    }, [props.bin]);

    return (
        <div>
            <canvas ref={canvasRef} />
        </div>
    );
}