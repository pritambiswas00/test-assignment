import Image from "next/image"

type ProductImageProps = {
  src: string
  alt: string
  className?: string
  sizes?: string
}

export default function ProductImage({
  src,
  alt,
  className,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: ProductImageProps) {
  return <Image src={src} alt={alt} fill sizes={sizes} className={className} />
}
