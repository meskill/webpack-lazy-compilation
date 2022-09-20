import { resolve } from 'path'
import fs from 'fs'
import fastify from 'fastify'
import { fastifyStatic } from '@fastify/static'
import React from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { App } from './render'

const STATIC_SERVER = "http://localhost:3000/static";
const STATS_FILE_PATH = resolve(__dirname, "..", "client", "stats.json");

const app = fastify({
  logger: false
});

app.register(fastifyStatic, {
  root: resolve(__dirname, "..", "client"),
  prefix: '/static/'
})

app.get('*', async (_, reply) => {

  const assets = /*
    NOTE:
    Imagine we somehow can figure out what assets should be handled to current response
    Usually, it is done by some of the app logic or tools like [@loadable/component](https://loadable-components.com/docs/server-side-rendering/#3-setup-chunkextractor-server-side)
  */ ['main', 'component'];

  const statsFile = JSON.parse(await fs.promises.readFile(STATS_FILE_PATH, 'utf-8'));

  const scriptsAndStyles = assets.flatMap(assetName => {
    const assets: string[] | undefined = statsFile.assetsByChunkName[assetName];

    /**
     * NOTE:
     * Preload scripts and styles required for current page
     * in order to prevent long wait and styles flashing
     */
    return assets?.map(asset => {
      if (asset.endsWith('.js')) {
        return <script src={`${STATIC_SERVER}/${asset}`} defer></script>
      }

      if (asset.endsWith('.css')) {
        return <link rel="stylesheet" href={`${STATIC_SERVER}/${asset}`} />
      }
    });
  });

  const stream = renderToPipeableStream(
  <html>
      <head>
          <title>Webpack App</title>
          <>
            {scriptsAndStyles}
          </>
      </head>
      <body>
          <h2>Webpack Stats File:</h2>
          <pre>
            {JSON.stringify(statsFile, null, 2)}
          </pre>

          <div id="application">
            <App/>
          </div>
      </body>

  </html>,
  {
    onAllReady() {
      reply.type('text/html')
      stream.pipe(reply.raw)
    },
  })

  return reply;
})

app.listen({ port: 3000 }, (err) => {
  if (err) {
    throw err;
  }

  console.log('Server started');
})