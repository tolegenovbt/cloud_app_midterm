const config = {};

config.storage_connection_string = "DefaultEndpointsProtocol=https;AccountName=storbekzat;AccountKey=FZTxGq0Vq5L5G/bJ8OXaxoG1H04F58Slzk/8zqGYNdU9y23g9Tl5Hzkki+BJRNuSuY9Md6mT2LhDJDktTQW9yA==;EndpointSuffix=core.windows.net"
config.sas_token = "sp=r&st=2021-10-23T07:00:10Z&se=2021-10-30T15:00:10Z&sv=2020-08-04&sr=c&sig=2mOMJpkMS3V0KvF%2BwC7QZAe7ZygTszsvc2lBtMcBz2w%3D"
config.storContainerName = "images"
config.storThumbContainerName = "thumbnails"
config.sas_token_thumb = "sp=r&st=2021-10-23T16:36:39Z&se=2021-10-30T00:36:39Z&spr=https&sv=2020-08-04&sr=c&sig=Av0vQDHuMzCsOJdaCdie9A3luP3G2q6Z3YqIAMeyC2Y%3D"
config.host = "https://dbbekzat.documents.azure.com:443/";
config.authKey = "kknngJiLmx9Y0zWMKKrt74qHoExhh9Ufkqo9cYOG3gccBAmIx04EA0qyWJhJQ4WXehm29aexYKTPatsWeWLQfw==";
config.databaseId = "Yachts";
config.containerId = "Items";

if (config.host.includes("https://localhost:")) {
  console.log("Local environment detected");
  console.log("WARNING: Disabled checking of self-signed certs. Do not have this code in production.");
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.log(`Go to http://localhost:8080 to try the sample.`);
}

module.exports = config;