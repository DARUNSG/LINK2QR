export interface ScrollState {
  p: number; // 0 to 1 real scroll
  sp: number; // clamp01(p / 0.82)
  time: number;
  mouseX: number;
  mouseY: number;
  isMobile: boolean;
  reducedMotion: boolean;
}

export interface ActGates {
  act1: number; // Figure & Lattice (0.00 - 0.22)
  act2: number; // Corridor & Grid Room Entry (0.16 - 0.42)
  act3: number; // Web Thwip & Velocity Swings (0.35 - 0.62)
  act4: number; // Chamber of Scarlet & Cobalt (0.55 - 0.78)
  act5: number; // Horizon Dawn & Acceleration (0.70 - 0.88)
  act6: number; // Closing Wipe (0.82 - 1.00 on p)
}

declare global {
  interface Window {
    __SCROLL_STATE: ScrollState;
    ACT_GATES: ActGates;
  }
}
