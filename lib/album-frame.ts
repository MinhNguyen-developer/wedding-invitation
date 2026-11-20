// Shared by the GPU print and its HTML fallback so the first frame lines up.
export const albumCamera = {
  fov: 37,
  desktopZ: 8,
  portraitZ: 8.8,
  eyeY: .16,
  targetY: -.08,
  desktopX: 1.48,
} as const;

export const albumDesktopViewHeight = 2 * Math.tan(albumCamera.fov * Math.PI / 360)
  * Math.hypot(albumCamera.desktopZ, albumCamera.eyeY - albumCamera.targetY);

export function getAlbumImageSize(aspect: number) {
  const ratio = Math.max(.5, Math.min(2, aspect));
  const height = Math.min(3.5, 3.7 / ratio);
  const width = height * ratio;
  return { width, height, frameWidth: width + .22, frameHeight: height + .26 };
}
