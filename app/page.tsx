import ParallaxGallery from './ParallaxGallery'

export default function Home() {
  return (
    <div className="w-full h-full">
      <main className="w-full h-full">
        <h3 className='text-2xl font-bold ml-10 mt-5'>
          Demo animation ramdom cards
        </h3>
        <div className="text-align w-full mt-2 ml-10 hover:underline">
          ref: <a href="https://business.pinterest.com/pinterest-predicts/">https://business.pinterest.com/pinterest-predicts</a>
        </div>
        <div className="text-align w-full mt-1 ml-10 hover:underline">
          source code: <a href="https://github.com/mydearxym/epam-nextjs-boilerplate">https://github.com/mydearxym/epam-nextjs-boilerplate</a>
        </div>
        
        <ParallaxGallery />
      </main>
    </div>
  );
}
