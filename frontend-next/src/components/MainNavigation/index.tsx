import NextLink from "next/link";
import { Inter } from 'next/font/google'

import ContentWrapper from "@/components/ContentWrapper";
import { buttonVariants } from "@/components/ui/button";

const inter = Inter({ subsets: ['latin'] });

type MainNavigationProps = {
  children: React.ReactNode,
}

const MainNavigation = (props: MainNavigationProps) => {
  const { children } = props;

  return (
    <div className="w-full flex items-center h-[110px] max-xl:p-4">
      <ContentWrapper>
        <ul className="inline-flex mr-auto">

          <li>
            <NextLink href="#">
              País
            </NextLink>
          </li>

          <li>
            <NextLink className="ml-[26px]" href="#">
              Acerca de
            </NextLink>
          </li>

        </ul>
        <ul className="inline-flex ml-auto">
          <li>
            <NextLink className={`${buttonVariants({ variant: "outline" })}`} href="#">
              Iniciar sesión
            </NextLink>
          </li>

          <li>
            <NextLink className={`ml-4 ${buttonVariants({ variant: "default" })}`} href="#">
              Crear cuenta
            </NextLink>
          </li>

        </ul>
      </ContentWrapper>
    </div>
  )
}

export default MainNavigation
