const config = {};

config.storage_connection_string = ""
config.sas_token = """
config.storContainerName = ""
config.storThumbContainerName = ""
config.sas_token_thumb = ""
config.host = ""
config.authKey = ""
config.databaseId = ""
config.containerId = ""

if (config.host.includes("https://localhost:")) {
  console.log("Local environment detected");
  console.log("WARNING: Disabled checking of self-signed certs. Do not have this code in production.");
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.log(`Go to http://localhost:8080 to try the sample.`);
}

module.exports = config;
