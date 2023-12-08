import * as React from "react";
import Head from "next/head";
import Layout from "../../components/Layout";
import GameImage from "../../components/game";



export default function Game() {
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
      <Layout lang="en" mode="provider"><GameImage></GameImage></Layout>
    </>
  );
}