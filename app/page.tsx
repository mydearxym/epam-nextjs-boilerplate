import Image from "next/image";
import ParallaxGallery from './ParallaxGallery'

export default function Home() {
  return (
    <div className="w-full h-full">
      <main className="w-full h-full">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">demo for epam</li>
          <li>cards animation</li>
        </ol>
        <ParallaxGallery />
      </main>
    </div>
  );
}
