import { OpenAPIGenerator } from '@orpc/openapi';
import { experimental_ValibotToJsonSchemaConverter as ValibotToJsonSchemaConverter } from '@orpc/valibot';
import { name as title, version } from '../package.json';
import { appRouter } from './orpc/router';

const generator = new OpenAPIGenerator({
	schemaConverters: [new ValibotToJsonSchemaConverter()],
});

export async function handleOpenApiSpec(): Promise<Response> {
	const spec = await generator.generate(appRouter, {
		info: {
			title,
			version,
		},
		servers: [{ url: '/api' }],
		security: [{ bearerAuth: [] }],
		components: {
			/** If you need to authenticate the endpoints and document it, uncomment this */
			// securitySchemes: {
			// 	bearerAuth: {
			// 		type: "http",
			// 		scheme: "bearer",
			// 	},
			// },
		},
	});

	return new Response(JSON.stringify(spec), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
}

const scalarHtml = `
    <!doctype html>
    <html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' x='.1em' font-size='90'>⚡</text></svg>" type="image/svg+xml" />

      </head>
      <body>
        <script
          id="api-reference"
          data-url="/spec.json"
          data-configuration="${JSON.stringify({
						authentication: {
							preferredSecurityScheme: 'bearerAuth',
						},
					}).replaceAll('"', '&quot;')}">
        </script>
        <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
      </body>
    </html>
  `;

export async function handleApiDocs(): Promise<Response> {
	return new Response(scalarHtml, {
		status: 200,
		headers: {
			'Content-Type': 'text/html',
		},
	});
}
