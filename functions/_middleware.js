/**
 * 301 fra www.chokolademuffin.dk til chokolademuffin.dk.
 *
 * Baggrund: begge værtsnavne er tilknyttet Pages-projektet og serverer samme
 * indhold. Uden en omdirigering får vi to indekserbare kopier af alle 49
 * opskrifter. Cloudflare Pages' `_redirects` kan kun matche på sti, ikke på
 * værtsnavn, og en Redirect Rule på zonen kræver Zone-adgang, som drifts-
 * tokenet ikke har. Derfor løses det her i edge-middleware i stedet.
 *
 * Hvis der senere oprettes en Redirect Rule på zonen, skal denne fil fjernes,
 * så vi ikke har to lag, der gør det samme.
 */

const CANONICAL_HOST = 'chokolademuffin.dk';
const REDIRECT_HOSTS = new Set(['www.chokolademuffin.dk']);

export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (REDIRECT_HOSTS.has(url.hostname.toLowerCase())) {
    const target = `https://${CANONICAL_HOST}${url.pathname}${url.search}`;
    return new Response(null, {
      status: 301,
      headers: {
        Location: target,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  return context.next();
}
