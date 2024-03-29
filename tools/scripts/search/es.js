/**
 * Script that helps manage Algolia index.
 *
 * Usage: node ./tools/fundamenty-cli.js search/es [action] [-f]
 * Where [action] can be init, clear or index
 *
 * `init` action - Creates index using es_index_config.json 
 * `clear` action - clears all entries in the index.
 * `index` action - indexes the content. The contents are read from ./_site/api.
 * 
 * The files in `./_site/api` are generated with `yarn build`
 *
 * Env variables:
 * - ES_URL: the hostname (without https), REQUIRED
 * - ES_ADMIN_ACCESS_KEY=
 * - ES_ADMIN_ACCESS_SECRET=
 * - ES_READ_ACCESS_KEY=
 * - ES_READ_ACCESS_SECRET=
 * When adding to the pipeline, make sure to configure those envs.
 */
const utils = require("../../utils");
const { Client } = require("@elastic/elasticsearch");

const META = {
  name: "search/es",
  dir: __dirname,
  description: "Manage indexing for ElasticSearch",
  command: {
    arguments: "<action>",
    options: [
      "-f, --flatten", // flatten the object prior indexing
      "-i, --input <input>", // Input file override
      "-n, --index <indexname>" // ElasticSearch's index name
    ], 
  },
};

const VALID_ACTIONS = ["init", "clear", "index"];

const ES_URL = process.env.ES_URL;
const ES_ADMIN_ACCESS_KEY = process.env.ES_ADMIN_ACCESS_KEY;
const ES_ADMIN_ACCESS_SECRET = process.env.ES_ADMIN_ACCESS_SECRET;
const ES_INDEX_NAME = process.env.ES_INDEX_NAME;

const API_PATH = "./_site/api";

async function createIndex(client, indexName) {
  const index_config = require("./es_index_config.json");

  try {
    utils.logger.info(`Creating index [${indexName}]...`);
    return await client.indices.create({
      index: indexName,
      body: index_config,
    });
  } catch (error) {
    utils.logger.error("Error while creating index: " + error);
  }
}

async function clearIndex(client, indexName) {
  let matchIndex = null;
  try {
    matchIndex = await client.indices.get({
      index: indexName,
    });
  } catch (error) {
    if (error.meta.statusCode == 404) {
      // If 404, it's ok
      utils.logger.info(`Index [${indexName}] not found`);
    } else {
      utils.logger.error("Fetching error Error: %j", error);
    }
  }

  if (matchIndex) {
    // Successfully retrieved the index, we want to delete it and re-create it
    utils.logger.debug(`Deleting existing index [${ES_INDEX_NAME}]...`);
    await client.indices.delete({
      index: indexName,
      ignore_unavailable: true,
    });
    utils.logger.info(`Index [${indexName}] deleted.`);
  }

  await createIndex(client, indexName);
}

async function pushToIndex(client, indexName, dataFilePaths, flatten) {
  flatten = flatten ? flatten : false;
  for (dataFilePath of dataFilePaths) {
    utils.logger.debug(`Reading objects from file: ${dataFilePath}`);
    const json = utils.readJson(dataFilePath);

    utils.logger.info(
      `Indexing ${json.length} ${flatten ? 'flattened': ''} objs from [${dataFilePath}] to [es:${indexName}]...`
    );
    
    let ctr = 0;
    for (jsonObj of json) {
      try {
        // ES does not like '/' as id, just remove them
        objId = jsonObj.objectID.replace(new RegExp("/", "g"), "");

        const objToIndex = flatten ? utils.flattenObject(jsonObj, '_') : jsonObj;

        utils.logger.debug('Indexing: %j', objToIndex);

        await client.index({
          index: indexName,
          id: objId, // jsonObj.objectID,
          // type: '_doc', // uncomment this line if you are using {es} ≤ 6
          body: objToIndex
        });
      } catch (error) {
        utils.logger.error("Error while indexing: %j", error);
      }
    }
  }

  utils.logger.info("Indexing objects completed.");
}

/**
 *
 * @param {*} config
 * @param {ScriptContext} context
 */
async function run(config, context) {
  const params = utils.parseArgs(META, context.args);

  utils.logger.info(`Executing ${META.name} (%j)`, params);

  const accessString = (ES_ADMIN_ACCESS_KEY) ? `${ES_ADMIN_ACCESS_KEY}:${ES_ADMIN_ACCESS_SECRET}@` : '';
  const esUrl =  `https://${accessString}${ES_URL}`;
  const indexName = params.index || ES_INDEX_NAME;
  utils.logger.info(`Connecting to ES node: ${esUrl}`);

  const client = new Client({
    node: esUrl,
  });

  const outputPath = utils.getOutputPath(config);

  if (params.action === "init") {
    await createIndex(client, indexName);
  } else if (params.action === "clear") {
    await clearIndex(client, indexName);
  } else if (params.action === "index") {
    let inputFiles = (params.input) ? params.input.split(',')
      : inputFiles = [`${API_PATH}/pages.json`,
        `${API_PATH}/posts.json`,
        `${API_PATH}/radar.json`,
        `${API_PATH}/products.json`];
    await pushToIndex(client, indexName, inputFiles, params.flatten);
  }
}

module.exports = {
  META,
  run,
};
