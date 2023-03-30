import { useState } from "react";
import {
  Meta,
  Links,
  Outlet,
  Scripts,
  LiveReload,
  ScrollRestoration,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import type {
  MetaFunction,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/node";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { bscTestnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import type { Chain } from "wagmi";
import {
  RainbowKitProvider,
  ConnectButton,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";

import globalStylesUrl from "./styles/global.css";
import rainbowStylesUrl from "@rainbow-me/rainbowkit/styles.css";
import toastStyles from "react-toastify/dist/ReactToastify.min.css";
import { Link } from "@remix-run/react";

import { ToastContainer } from "react-toastify";

type Env = { PUBLIC_ENABLE_TESTNETS?: string };

type LoaderData = { ENV: Env };

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "The Grid",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: globalStylesUrl },
  { rel: "stylesheet", href: rainbowStylesUrl },
  { rel: "stylesheet", href: toastStyles },
];

export const loader: LoaderFunction = () => {
  const data: LoaderData = {
    ENV: {
      PUBLIC_ENABLE_TESTNETS: process.env.PUBLIC_ENABLE_TESTNETS || "false",
    },
  };

  return json(data);
};

export default function App() {
  const [{ client, chains }] = useState(() => {
    const { chains, provider } = configureChains(
      [bscTestnet],
      [publicProvider()]
    );

    const { connectors } = getDefaultWallets({
      appName: "The Grid",
      chains,
    });

    const client = createClient({
      provider,
      connectors,
      autoConnect: true,
    });

    return {
      client,
      chains,
    };
  });

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-50">
        {client && chains ? (
          <WagmiConfig client={client}>
            <RainbowKitProvider
              chains={chains as Chain[]}
              showRecentTransactions={true}
            >
              <div className="w-full max-w-[800px] mx-auto">
                <header className="flex items-center py-3 px-5 justify-between">
                  <Link to="/">
                    <h1 className="text-2xl font-bold text-primary scale">
                      The Grid
                    </h1>
                  </Link>
                  <ConnectButton />
                </header>
                <main className="px-5">
                  <Outlet />
                </main>
              </div>
            </RainbowKitProvider>
          </WagmiConfig>
        ) : null}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
