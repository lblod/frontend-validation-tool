import { ProxyHandlerStatic } from '@comunica/actor-http-proxy';
import { QueryEngine } from '@comunica/query-sparql';
import type { Bindings, BindingsStream } from '@comunica/types';

const engine = new QueryEngine();

const NUMBER_OF_RETRY_COUNTS = 2;

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
  proxyURL?: string,
): Promise<Bindings[]> {
  const bindingsStream: BindingsStream = await engine.queryBindings(
    `
        SELECT ?s ?p ?o
        WHERE {
            ?s ?p ?o .
        }
    `,
    {
      sources: [publicationLink],
      ...(proxyURL && { proxy: new ProxyHandlerStatic(proxyURL) }),
    },
  );
  return bindingsStream.toArray();
}

export async function getBlueprintOfDocumentType(
  documentType: string,
): Promise<Bindings[]> {
  const blueprintLink: any = {
    Notulen:
      'https://raw.githubusercontent.com/lblod/notulen-prepublish-service/master/test/shapes/meeting.ttl',
    BesluitenLijst:
      'https://raw.githubusercontent.com/lblod/notulen-prepublish-service/master/test/shapes/decision-list.ttl',
    Agenda:
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
      sources: [blueprintLink[documentType]],
    },
  );

  return bindingsStream.toArray();
}
