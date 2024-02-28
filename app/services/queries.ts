/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProxyHandlerStatic } from '@comunica/actor-http-proxy';
// import { QueryEngine } from '@comunica/query-sparql';

// const engine = new QueryEngine();

import { QueryEngine } from '@comunica/query-sparql';

// Create a new instance of QueryEngine
const engine = new QueryEngine();

// Export the engine instance if needed
export default engine;

import type { Bindings, BindingsStream } from '@comunica/types';

const proxyUrl = 'http://localhost:8085/'; // CORS Anywhere proxy

export async function getPublicationFromFileContent(
  content: string,
): Promise<Bindings[]> {
  const bindingsStream: BindingsStream = await engine.queryBindings(
    `
        SELECT ?s ?p ?o
        WHERE {
            ?s ?p ?o .
        }
    `,
    {
      sources: [
        {
          type: 'stringSource',
          value: content,
          mediaType: 'text/html',
          baseIRI: 'http://example.org/',
        },
      ],
    },
  );

  return (bindingsStream as any).toArray();
}

export async function fetchDocument(
  publicationLink: string,
): Promise<Bindings[]> {
  const bindingsStream: BindingsStream = await engine
    .queryBindings(
      `
        SELECT ?s ?p ?o
        WHERE {
            ?s ?p ?o .
        }
    `,
      {
        sources: [publicationLink],
        httpProxyHandler: new ProxyHandlerStatic(proxyUrl),
      },
    )
    .catch((error) => {
      console.error('Error fetching data:', error);
      throw error;
    });

  return (bindingsStream as any).toArray();
}

export async function getBlueprintOfDocumentType(
  documentType: string,
): Promise<Bindings[]> {
  const blueprintLink: any = {
    NOTULEN:
      'https://raw.githubusercontent.com/lblod/notulen-prepublish-service/master/test/shapes/meeting.ttl',
    BESLUITENLIJST:
      'https://raw.githubusercontent.com/lblod/notulen-prepublish-service/master/test/shapes/decision-list.ttl',
    AGENDA:
      'https://raw.githubusercontent.com/lblod/notulen-prepublish-service/master/test/shapes/basic-agenda.ttl',
  };
  const bindingsStream: BindingsStream = await engine.queryBindings(
    `
        SELECT ?s ?p ?o 
        WHERE {
            ?s ?p ?o .
        }
        `,
    {
      sources: [blueprintLink[documentType.toUpperCase()]],
    },
  );

  return (bindingsStream as any).toArray();
}
