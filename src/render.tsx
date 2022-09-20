import React, {lazy, Suspense} from 'react';

const Component = lazy(() => new Promise<any>((res) => {
  /*
   * NOTE:
   * Add timeout for loading on client to imitate long loading assets
   */
  setTimeout(() => res(import(/* webpackChunkName: "component" */ "./component")), typeof window === 'undefined' ? 0: 2000);
}));

export const App = () => {
  return <>
    <h1>App</h1>
    <h2>Component: </h2>
    <Suspense>
      <Component />
    </Suspense>
  </>
}