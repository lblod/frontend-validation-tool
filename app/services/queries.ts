/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProxyHandlerStatic } from '@comunica/actor-http-proxy';
import { QueryEngine } from '@comunica/query-sparql';

const engine = new QueryEngine();

export default engine;

import type { Bindings, BindingsStream } from '@comunica/types';

const proxyUrl = 'https://corsproxy.io/?'; // CORS Anywhere proxy

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


export async function getMaturityProperties(maturityLevel: string) {
  const source: string =
    'https://raw.githubusercontent.com/snenenenenenene/validation-monitoring-module/master/files/notulen.ttl';

  const bindingsStream: BindingsStream = await engine.queryBindings(
    `
      PREFIX lblodBesluit: <http://lblod.data.gift/vocabularies/besluit/>
      PREFIX sh: <http://www.w3.org/ns/shacl#>
      SELECT ?path
      WHERE {
          ?s lblodBesluit:maturiteitsniveau "${maturityLevel}" ;
            sh:path ?path .
      }
      `,
    {
      sources: [source],
    },
  );

  return (bindingsStream as any).toArray();
}
