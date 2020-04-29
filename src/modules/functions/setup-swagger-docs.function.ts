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
    processDocument(document);

    // Write the Json to directory
    await writeJson(join(outputDirectory, 'openApi.json'), JSON.stringify(document));
}

function processDocument(document: OpenAPIObject): OpenAPIObject {
    // Available methods we need to update operationIds
    const methods = ['get', 'put', 'post', 'delete'];
    const tags = new Set<string>();
    // Go through document paths and methods to prepend the tag (name of controller)
    if (document && document.paths) {
        const paths = Object.keys(document.paths);
        for (const path of paths) {
            for (const method of methods) {
                if (document.paths[path][method] && document.paths[path][method].operationId) {
                    const operationId = document.paths[path][method].operationId;
                    if (document.paths[path][method].tags && document.paths[path][method].tags.length > 0) {
                        let tag = document.paths[path][method].tags[0];
                        tags.add(tag);
                        if (tag && tag.length > 0) {
                            tag = tag.replace(/\s/g, '');
                        }
                        document.paths[path][method].operationId = `${encodeURI(tag)}/${operationId}`;
                    }
                }
            }
        }
    }
    const sortedTags = Array.from(tags).sort((strA, strB) => {
        const strANoAdmin = strA.replace('Admin - ', '');
        const strBNoAdmin = strB.replace('Admin - ', '');
        return strANoAdmin.localeCompare(strBNoAdmin, 'en');
    }).map(tagName => ({
         name: tagName
    }));
    document.tags = sortedTags;

    return document;
}
