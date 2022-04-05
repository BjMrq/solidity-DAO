/* eslint-disable @typescript-eslint/no-var-requires */
const glob = require("glob");
const R = require("ramda");
const { writeFileSync } = require("fs");

// (async () => {
//   const thing = await fs.promises.readdir("../contracts/deployments");
//   console.log(thing);
// })();

const deployedNetwork = {
  localhost: "1337",
  kovan: "42",
  rinkeby: "4",
  test: "9",
};

const reduceAllNetworkInfos = (networkInfo, filePath) => {
  const [networkName, contractNameAndExtension] = filePath.split("/").slice(-2);

  return {
    ...networkInfo,
    [contractNameAndExtension]: {
      ...networkInfo[contractNameAndExtension],
      [deployedNetwork[networkName]]: {
        address: require(filePath).address,
      },
    },
  };
};

glob(
  "../contracts/deployments/**/*.json",
  { ignore: "../contracts/deployments/**/solcInputs/*" },
  function (er, files) {
    const contractNetworkInfos = files.reduce(reduceAllNetworkInfos, {});

    Object.entries(contractNetworkInfos).forEach(
      ([contractNameAndExtension, networkInfo]) => {
        writeFileSync(
          `./src/contracts/abis/deployments/${contractNameAndExtension}`,
          JSON.stringify(
            R.assoc(
              "networks",
              networkInfo,
              require(`../contracts/artifacts/contracts/${contractNameAndExtension.replace(
                ".json",
                ""
              )}.sol/${contractNameAndExtension}`)
            ),
            undefined,
            2
          )
        );
      }
    );
  }
);
