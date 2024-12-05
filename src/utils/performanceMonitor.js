import * as THREE from 'three';
import Stats from 'stats.js';

export class PerformanceMonitor {
  constructor() {
    this.stats = new Stats();
    this.stats.showPanel(0);
    
    if (process.env.NODE_ENV === 'development') {
      document.body.appendChild(this.stats.dom);
    }

    // Track frame drops
    this.lastTime = performance.now();
    this.framesToTrack = [];
    this.droppedFrames = 0;
  }

  begin() {
    this.stats.begin();
    this.lastTime = performance.now();
  }

  end() {
    const currentTime = performance.now();
    const frameTime = currentTime - this.lastTime;
    
    // Track frame times for the last 60 frames
    this.framesToTrack.push(frameTime);
    if (this.framesToTrack.length > 60) {
      this.framesToTrack.shift();
    }

    // Consider a frame dropped if it took longer than 16.67ms (60 FPS)
    if (frameTime > 16.67) {
      this.droppedFrames++;
      
      // If we're dropping too many frames, reduce quality
      if (this.droppedFrames > 10) {
        this.reduceQuality();
        this.droppedFrames = 0;
      }
    }

    this.stats.end();
  }

  reduceQuality() {
    // Reduce rendering quality if performance is poor
    THREE.WebGLRenderer.instance?.setPixelRatio(
      Math.max(1, window.devicePixelRatio - 0.5)
    );
  }
}

export const monitor = new PerformanceMonitor();