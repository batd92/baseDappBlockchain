import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { notTranslation as useTranslations } from "../../utils";
import AddNetwork from "../../components/chain";
import Layout from "../../components/Layout";
import EnvTrade from "../../components/env-trade";
import Logs from "../../components/logs";


function Provider({ chain }) {
  const t = useTranslations("Common", "en");

  const icon = React.useMemo(() => {
    return chain?.chainSlug ? `https://icons.llamao.fi/icons/chains/rsz_${chain.chainSlug}.jpg` : "/unknown-logo.png";
  }, [chain]);

  return (
    <>
      <Head>
        <title>{`Tool | APT Root`}</title>
        <meta
          name="description"
          content={`Find the smart contract.`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout lang="en" mode="provider">
      <Logs></Logs>
      <EnvTrade></EnvTrade>

        {/* <RPCList chain={chain} lang="en" /> */}
      </Layout>
    </>
  );
}

export default Provider;
