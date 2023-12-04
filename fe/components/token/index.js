import * as React from "react";
import RPCList from "../RPCList";
import { useRouter } from "next/router";
import Link from "next/link";
import { notTranslation as useTranslations } from "../../utils";
import { useChain } from "../../stores";

export default function Token({ chain, lang }) {
  const t = useTranslations("Common", lang);
  const router = useRouter();

  const icon = React.useMemo(() => {
    return chain.chainSlug ? `https://icons.llamao.fi/icons/chains/rsz_${chain.chainSlug}.jpg` : "/unknown-logo.png";
  }, [chain]);

  const chainId = useChain((state) => state.id);
  const updateChain = useChain((state) => state.updateChain);

  const handleClick = () => {
    if (chain.chainId === chainId) {
      updateChain(null);
    } else {
      updateChain(chain.chainId);
    }
  };

  const showAddlInfo = chain.chainId === chainId;

  if (!chain) {
    return <></>;
  }

  return (
    <>
      <div className="shadow dark:bg-[#0D0D0D] bg-white p-8 pb-0 rounded-[10px] flex flex-col gap-3 overflow-hidden">
        <Link href={`/chain/${chain.chainId}`} prefetch={false} className="flex items-center mx-auto gap-2">
          <img
            src={icon}
            width={26}
            height={26}
            className="rounded-full flex-shrink-0 flex relative"
            alt={chain.name + " logo"}
          />
          <span className="text-xl font-semibold whitespace-nowrap overflow-hidden text-ellipsis relative top-[1px] dark:text-[#B3B3B3]">
            {chain.name}
          </span>
        </Link>

        <table>
          <thead>
            <tr>
              <th className="font-normal text-gray-500 dark:text-[#B3B3B3]">ChainID</th>
              <th className="font-normal text-gray-500 dark:text-[#B3B3B3]">{t("currency")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-center font-bold px-4 dark:text-[#B3B3B3]">{`${chain.chainId} (0x${Number(
                chain.chainId,
              ).toString(16)})`}</td>
              <td className="text-center font-bold px-4 dark:text-[#B3B3B3]">
                {chain.nativeCurrency ? chain.nativeCurrency.symbol : "none"}
              </td>
            </tr>
          </tbody>
        </table>

        {(lang === "en") && (
          <button
            className="w-full rounded-[50px] p-2 flex items-center mb-2 justify-center dark:hover:bg-[#0D0D0D] hover:bg-[#f6f6f6]"
            onClick={handleClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-4 h-4"
              style={{
                transform: showAddlInfo ? "rotate(180deg)" : "",
                transition: "all 0.2s ease",
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        )}
      </div>

      {showAddlInfo && <RPCList chain={chain} lang={lang} />}
    </>
  );
}
