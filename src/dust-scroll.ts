import { Group } from 'three/src/objects/Group';
import TWEEN from '@tweenjs/tween.js';

export const dustScroll = (dustGroups: Group[]) => {
    let scrollTarget = window.pageYOffset;
    let direction = 0;
    const animation = new TWEEN.Tween({ speed: 0 });
    let lastSpeed = 0;
    animation.easing(TWEEN.Easing.Quadratic.InOut);
    animation.onUpdate(({ speed }) => {
        lastSpeed = speed;
    });

    function animate(time: DOMHighResTimeStamp) {
        if (lastSpeed > 0) {
            dustGroups.forEach(dust => {
                dust.position.y -= lastSpeed * direction;
                dust.rotation.y -= lastSpeed * 0.003;
            });
        }
        requestAnimationFrame(animate);
        TWEEN.update(time);
    }

    requestAnimationFrame(animate);

    let scrollTimer: number = 0;

    window.addEventListener('scroll', () => {
        if (!scrollTimer) {
            const target = window.pageYOffset;
            direction = target > scrollTarget ? 1 : -1
            scrollTarget = target;
            if (!animation.isPlaying()) {
                animation.to({ speed: [5, 0] }, 1500).start();
            }
            scrollTimer = window.setTimeout(() => {
                clearTimeout(scrollTimer);
                scrollTimer = 0;
            }, 100)
        }
    })
};
