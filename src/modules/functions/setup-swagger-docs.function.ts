import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@teamhive/nestjs-swagger';
import { join } from 'path';
import { writeJson } from './write-json.function';

export async function setupSwaggerDocs(app: INestApplication, outputDirectory = process.cwd(), applicationName = 'API') {
    // Setup Swagger Documents
    const options = new DocumentBuilder()
        .setTitle(applicationName)
        .setDescription(`Documentation for ${applicationName}`)
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, options);

    // Fix operationIds for proper navigation
    fixOperationIds(document);

    // Write the Json to directory
    await writeJson(join(outputDirectory, 'openApi.json'), JSON.stringify(document));
}

function fixOperationIds(document: OpenAPIObject): OpenAPIObject {
    // Available methods we need to update operationIds
    const methods = ['get', 'put', 'post', 'delete'];

    // Go through document paths and methods to prepend the tag (name of controller)
    if (document && document.paths) {
        const paths = Object.keys(document.paths);
        for (const path of paths) {
            for (const method of methods) {
                if (document.paths[path][method] && document.paths[path][method].operationId) {
                    const operationId = document.paths[path][method].operationId;
                    if (document.paths[path][method].tags && document.paths[path][method].tags.length > 0) {
                        let tag = document.paths[path][method].tags[0];
                        if (tag && tag.length > 0) {
                            tag = tag.replace(/\s/g, '');
                        }
                        document.paths[path][method].operationId = `${encodeURI(tag)}/${operationId}`;
                    }
                }
            }
        }
    }

    return document;
}
