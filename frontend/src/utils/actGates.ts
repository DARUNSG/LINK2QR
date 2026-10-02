import { clamp01, smoothstep } from './math';
import { ActGates } from '../types/scroll';

/**
 * Computes individual Act Gate values (0 to 1) for a given sp and real p.
 * Ensures every boundary overlaps adjacent acts by 0.06 - 0.14 on the act axis.
 */
export function computeActGates(sp: number, p: number): ActGates {
  // Act 1: 0.00 to 0.22 (fade out 0.14 - 0.22)
  const act1 = sp <= 0.14 ? 1 : 1 - smoothstep(0.14, 0.22, sp);

  // Act 2: 0.14 to 0.42 (fade in 0.14 - 0.20, fade out 0.36 - 0.42)
  const act2In = smoothstep(0.14, 0.20, sp);
  const act2Out = 1 - smoothstep(0.36, 0.42, sp);
  const act2 = Math.min(act2In, act2Out);

  // Act 3: 0.34 to 0.64 (fade in 0.34 - 0.40, fade out 0.58 - 0.64)
  const act3In = smoothstep(0.34, 0.40, sp);
  const act3Out = 1 - smoothstep(0.58, 0.64, sp);
  const act3 = Math.min(act3In, act3Out);

  // Act 4: 0.56 to 0.78 (fade in 0.56 - 0.62, fade out 0.72 - 0.78)
  const act4In = smoothstep(0.56, 0.62, sp);
  const act4Out = 1 - smoothstep(0.72, 0.78, sp);
  const act4 = Math.min(act4In, act4Out);

  // Act 5: 0.70 to 0.88 (fade in 0.70 - 0.76, fade out 0.82 - 0.88)
  const act5In = smoothstep(0.70, 0.76, sp);
  const act5Out = 1 - smoothstep(0.82, 0.88, sp);
  const act5 = Math.min(act5In, act5Out);

  // Act 6: Closing wipe runs on real p (0.82 to 1.00)
  const act6 = smoothstep(0.82, 0.98, p);

  return { act1, act2, act3, act4, act5, act6 };
}
