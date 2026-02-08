import '@testing-library/jest-dom';

global.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(cb, 0);
