import NextImage from "next/image";
import NextLink from "next/link";

import navigation_logo from "./assets/navigation_logo.svg";
import ContentWrapper from "@/components/ContentWrapper";
import { buttonVariants } from "@/components/ui/button";

const MainNavigation = () => {
  return (
    <div className="w-full flex items-center h-[110px] max-xl:p-4">
      <ContentWrapper>
        <ul className="inline-flex mr-auto">
          <li>
            <NextLink href="/">
              <NextImage
                src={navigation_logo.src}
                alt="Navigation Logo"
                height={30}
                width={30}
              />
            </NextLink>
          </li>

          <li>
            <NextLink className="ml-[26px]" href="#">
              País
            </NextLink>
          </li>

          <li>
            <NextLink className="ml-[26px]" href="/about">
              Acerca de
            </NextLink>
          </li>
        </ul>
        <ul className="inline-flex ml-auto">
          <li>
            <NextLink
              className={`${buttonVariants({ variant: "outline" })}`}
              href="#"
            >
              Iniciar sesión
            </NextLink>
          </li>

          <li>
            <NextLink
              className={`ml-4 ${buttonVariants({ variant: "default" })}`}
              href="#"
            >
              Crear cuenta
            </NextLink>
          </li>
        </ul>
      </ContentWrapper>
    </div>
  );
};

export default MainNavigation;
