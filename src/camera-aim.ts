import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera';

export const cameraAim = (rootNode: Element, camera: PerspectiveCamera) => {
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2;
    let aimX = centerX;
    let aimY = centerY;
    const aimNode = document.createElement('div');
    const setAimPosition = () => {
        aimNode.style.left = `${aimX}px`;
        aimNode.style.top = `${aimY}px`;
    }
    camera.position.z = 600;
    camera.position.x = -1 * centerX / 2;
    setAimPosition();
    aimNode.style.position = 'fixed'
    aimNode.style.transition = `top 0.5s ease-out, left 0.5s ease-out`;
    rootNode.appendChild(aimNode);

    const getPositionFromAim = () => {
        const {top, left} = window.getComputedStyle(aimNode);
        return { top: parseInt(top), left: parseInt(left) }
    };

    let cameraIsUpdating = false;
    const updateCameraPosition = () => {
        const { top, left } = getPositionFromAim();
        if (top !== aimY || left !== aimX) {
            cameraIsUpdating = true;
            const distanceX = centerX - left;
            const distanceY = centerY - top;
            camera.rotation.y = distanceX / centerX * 0.05;
            camera.rotation.x = distanceY / centerY * 0.05;
            requestAnimationFrame(updateCameraPosition)
        } else {
            cameraIsUpdating = false;
        }
    };
    let mouseMoveTimer: number = 0;
    window.addEventListener('mousemove', (e) => {
        if (!mouseMoveTimer) {
            mouseMoveTimer = window.setTimeout(() => {
                aimX = e.clientX;
                aimY = e.clientY;
                setAimPosition();
                if (!cameraIsUpdating) {
                    updateCameraPosition();
                }
                mouseMoveTimer = 0;
            }, 100)
        }
    })
};
