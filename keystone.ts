// Welcome to Keystone!
//
// This file is what Keystone uses as the entry-point to your headless backend
//
// Keystone imports the default export of this file, expecting a Keystone configuration object
//   you can find out more at https://keystonejs.com/docs/apis/config

import { config } from "@keystone-6/core";

// to keep this file tidy, we define our schema in a different file
import { lists } from "./schema";

// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data
import { withAuth, session } from "./auth";
import getAllowdOrigins from "./helpers/corsHelper";
import configHelper from "./helpers/configHelper";
import dotenv from "dotenv";

dotenv.config();

const { isProduction, getPort, getMaxFileSize } = configHelper;

const isRunningOnProduction = isProduction();

const {
  S3_BUCKET_NAME: bucketName = "keystone-test",
  S3_REGION: region = "ap-southeast-2",
  S3_ACCESS_KEY_ID: accessKeyId = "keystone",
  S3_SECRET_ACCESS_KEY: secretAccessKey = "keystone",
  S3_ENDPOINT: endpoint = "http://localhost:9000",
} = process.env;

const databaseUrl = process.env.DATABASE_URL || "file:./keystone.db";

export default withAuth(
  config({
    server: {
      cors: {
        origin: getAllowdOrigins(),
        credentials: true,
      },
      port: getPort(),
      maxFileSize: getMaxFileSize(),
      healthCheck: true,
      // extendExpressApp: (app, commonContext) => {},
      // extendHttpServer: (httpServer, commonContext, graphQLSchema) => {},
    },
    graphql: {
      debug: !isRunningOnProduction,
      path: "/api/graphql",
      playground: !isRunningOnProduction,
      cors: {
        origin: getAllowdOrigins(),
        credentials: true,
      },
    },

    db: {
      // we're using sqlite for the fastest startup experience
      //   for more information on what database might be appropriate for you
      //   see https://keystonejs.com/docs/guides/choosing-a-database#title
      provider: "sqlite",
      url: databaseUrl,
    },
    storage: {
      minioImage: {
        kind: "s3",
        type: "image",
        bucketName,
        region,
        accessKeyId,
        secretAccessKey,
        endpoint,
        forcePathStyle: true,
      },
      minioFile: {
        kind: "s3",
        type: "file",
        bucketName,
        region,
        accessKeyId,
        secretAccessKey,
        endpoint,
        forcePathStyle: true,
      },
    },

    lists,

    session,

    ui: {
      isAccessAllowed: (context) => Boolean(context.session?.data?.id),
    },

    telemetry: !isRunningOnProduction,
  })
);
