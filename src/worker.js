export default {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
      
      // Handle artwork image requests
      if (url.pathname.startsWith('/artwork/')) {
        try {
          const key = url.pathname.replace('/artwork/', '');
          const object = await env.ARTWORK_BUCKET.get(key);
          
          if (object === null) {
            return new Response('Image not found', { status: 404 });
          }
  
          const headers = new Headers();
          headers.set('content-type', object.httpMetadata.contentType);
          headers.set('cache-control', 'public, max-age=31536000');
          
          return new Response(object.body, {
            headers,
          });
        } catch (error) {
          return new Response('Error loading image', { status: 500 });
        }
      }
  
      // Serve static assets from the site
      try {
        const response = await env.ASSETS.fetch(request);
        return response;
      } catch {
        return new Response('Not found', { status: 404 });
      }
    },
  };