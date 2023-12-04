import * as React from "react";
import { useEffect } from "react";
import Header from "../header";
import Contract from "../contract";
import { notTranslation as useTranslations } from "../../utils";
import Logo from "./Logo";
import { useRouter } from "next/router";

const initTheme = () => {
  localStorage.setItem("theme", "light"); // "drak"
};

export default function Layout({ children, lang, mode = 'rpc' }) {
  useEffect(() => {
    initTheme();
  }, []);

  const t = useTranslations("Common", lang);

  const router = useRouter();

  const { search, address } = router.query;

  const chainName = typeof search === "string" ? search : "";
  const addressName = typeof address === "string" ? address : "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[22vw,_auto]">
      <div className="dark:text-[#B3B3B3] text-black dark:bg-[#0D0D0D] bg-white relative h-full">
        <div className="p-5 sticky top-0 bottom-0 m-auto flex flex-col items-center gap-8 h-screen max-w-[400px] mx-auto">
          <figure className="lg:mr-auto">
            <Logo />
            <figcaption className="font-bold text-2xl">{t("help-info")}</figcaption>
          </figure>

          <div className="flex flex-col gap-4 w-full">
            <a
              className="flex items-center justify-center mx-auto lg:ml-0 gap-2 rounded-[50px] max-w-[16.25rem] font-medium py-[18px] px-6 shadow-lg w-full dark:bg-[#2F80ED] bg-[#2F80ED] dark:text-black text-white"
              href="http://localhost:3000/"
              rel="noopener noreferrer"
            >
              <span className="text-base font-medium">{t("networks")}</span>
            </a>

            <a
              className="flex items-center justify-center mx-auto lg:ml-0 gap-2 rounded-[50px] max-w-[16.25rem] font-medium py-[17px] px-6 w-full dark:bg-[#0D0D0D] bg-white dark:text-[#2F80ED] text-[#2F80ED] border dark:border-[#171717] border-[#EAEAEA]"
              href="http://localhost:3000/trade"
              rel="noopener noreferrer"
            >
              <span className="text-base font-medium">{t("trade")}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="dark:bg-[#181818] bg-[#f3f3f3] p-5 relative flex flex-col gap-5">
        {mode === 'rpc' ? (
          <Header lang={lang} chainName={chainName} key={chainName + "header"} />
        ) : (
          <Contract lang={lang} addressName={addressName} key={addressName + "header"} />
        )}
        {children}
      </div>
    </div>
  );
}
