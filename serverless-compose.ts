const dependsOnLayer = ["restaurant-layer-lib"];

const serverlessCompose = {
  services: {
    "restaurant-layer-lib": {
      path: "./layers/lib",
    },
    orders: {
      path: "src/services/orders",
      dependsOn: dependsOnLayer,
    },
    kitchen: {
      path: "src/services/kitchen",
      dependsOn: dependsOnLayer,
    },
    warehouse: {
      path: "src/services/warehouse",
      dependsOn: dependsOnLayer,
    },
    artificialIntelligence: {
      path: "src/services/artificial-intelligence",
      dependsOn: dependsOnLayer,
    },
  },
}

module.exports = serverlessCompose;