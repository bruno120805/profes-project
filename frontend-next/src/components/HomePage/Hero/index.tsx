import hero_image from './assets/hero_image.svg';
import NextImage from 'next/image';
import ContentWrapper from '@/components/ContentWrapper';
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] });

export function TypographyH1() {
  return (
    <h1 className="max-w-4xl scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl -mt-5" style={{...inter.style}}>
      Califica tu profesor y encuentra 
      los apuntes de sus materias.
    </h1>
  )
}

export function TypographyH4() {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-3 " style={{...inter.style}}>
      Escribe el nombre de la universidad
      para empezar.
    </h4>
  )
}


const Hero = () => {
  return (
    <section className="min-h-screen relative ">
      <ContentWrapper>

        <div className='relative z-10'>
          <TypographyH1 />
          <TypographyH4 />
        </div>

      </ContentWrapper>

      <div 
        className="
          absolute
          bg-cover
          w-2/4
          min-h-screen
          right-0
          z-0
          -mt-40  
        ">

        <NextImage
          src={hero_image.src}
          alt="Hero Image"
          height={547}
          width={547}
          className="object-contain"
        />

      </div>
    </section>
  );
};

export default Hero;
