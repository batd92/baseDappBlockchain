import * as React from "react";
import Head from "next/head";
import { notTranslation as useTranslations } from "../../utils";
import Layout from "../../components/Layout";
import EnvWallet from "../../components/env-wallet";


function Wallet({ chain }) {
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
      <Layout lang="en" mode="provider"><EnvWallet></EnvWallet></Layout>
    </>
  );
}

export default Wallet;
