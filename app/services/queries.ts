/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProxyHandlerStatic } from '@comunica/actor-http-proxy';
import { QueryEngine } from '@comunica/query-sparql';
import type { Bindings, BindingsStream } from '@comunica/types';

const engine = new QueryEngine();

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

  return bindingsStream.toArray();
}

export async function fetchDocument(
  publicationLink: string,
): Promise<Bindings[]> {
  console.log(
    'fetchDocument',
    publicationLink,
    new ProxyHandlerStatic('https://proxy.linkeddatafragments.org/'),
  );
  const bindingsStream: BindingsStream = await engine.queryBindings(
    `
        SELECT ?s ?p ?o
        WHERE {
            ?s ?p ?o .
        }
    `,
    {
      sources: [publicationLink],
      proxy: new ProxyHandlerStatic('https://proxy.linkeddatafragments.org/'),
    },
  );

  console.log(bindingsStream);
  return bindingsStream.toArray();
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

  console.log(bindingsStream);

  return bindingsStream.toArray();
}
