export interface ItemRectLike {
  top: number;
  height: number;
}

// Given item rectangles (top/height) and a cursor Y position (clientY),
// compute the insertion index [0..items.length].
export function computeDropIndex(items: ItemRectLike[], clientY: number): number {
  if (items.length === 0) return 0;
  // Compute midline for each item; insert before first midline greater than clientY
  for (let i = 0; i < items.length; i++) {
    const mid = items[i].top + items[i].height / 2;
    if (clientY < mid) return i;
  }
  return items.length;
}


