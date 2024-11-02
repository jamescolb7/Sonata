import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import LayoutContent from './components/layout';
import '@fontsource-variable/inter/index.css';
import "./tailwind.css";
import { Provider } from "jotai";
import ProgressBar from './components/progress'

import { getAuth } from "./middleware/middlewareAuth";
import { serverOnly$ } from 'vite-env-only/macros';

export const middleware = serverOnly$([getAuth]);

const prod = process.env.NODE_ENV;

export function ErrorBoundary() {
  const error = useRouteError() as Error;

  return (
    <>
      {prod === "production" ? <>
        <h1 className="text-2xl font-bold">Something Went Wrong!</h1>
        <p>The application may have experienced an error, or you may not be <Link to={'/login'}>logged in</Link>!</p>
      </> : <>
        {error && <>
          <h1>Error</h1>
          <p>{error.message}</p>
          <p>The stack trace is:</p>
          <pre>{error.stack}</pre>
        </>}
      </>}
    </>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="/manifest.json" rel="manifest"></link>
        <link rel="shortcut icon" type="image/png" href="/icons/logo.png" />
        <link rel="apple-touch-icon" href="/icons/logo.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Sonata" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <Meta />
        <Links />
      </head>
      <body className="dark min-h-screen bg-background antialiased">
        <ProgressBar />
        <Provider>
          <div className="flex flex-row">
            <LayoutContent>
              {children}
            </LayoutContent>
          </div>
          <ScrollRestoration />
          <Scripts />
        </Provider>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
