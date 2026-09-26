export function optimizeCloudinaryImage(
  imageUrl: string,
  size: 'icon' | 'thumbnail' | 'medium' | 'large' = 'medium',
): string {
  const sizes = {
    icon: 'w_150,c_limit',
    thumbnail: 'w_400,c_limit',
    medium: 'w_800,c_limit',
    large: 'w_1600,c_limit',
  };
  const transformation = `${sizes[size]},q_auto,f_auto`;
  return imageUrl.replace('/upload/', `/upload/${transformation}/`);
}
