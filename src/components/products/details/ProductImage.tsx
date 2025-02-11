
interface ProductImageProps {
  image?: string;
  name: string;
}

export function ProductImage({ image, name }: ProductImageProps) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="w-48 h-48 object-cover rounded-lg border"
      />
    );
  }

  return (
    <div className="w-48 h-48 bg-gray-100 rounded-lg border flex items-center justify-center text-gray-400">
      No Image
    </div>
  );
}
