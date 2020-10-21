const getNetworks = () => {
  const networkOptions = document.querySelector("#networks").children;
  const networks = [];
  for (child in networkOptions) {
    if (isNaN(child)) break;
    let dataPlans = [];
    const planList = networkOptions[child].getElementsByClassName(
      "network-data-plans"
    );
    if (planList.length) {
      for (item in planList) {
        if (isNaN(item)) break;
        dataPlans.push({
          code: planList[item].getAttribute("code"),
          value: planList[item].getAttribute("val"),
          amount: planList[item].getAttribute("amount"),
        });
      }
    }

    networks.push({
      code: networkOptions[child].getAttribute("code"),
      value: networkOptions[child].getAttribute("val"),
      label: networkOptions[child].getAttribute("label"),
      dataPlans,
    });
  }

  return networks;
};

const getNetworkPlans = (network) =>
  getNetworks().find((n) => n.value === network).dataPlans;

const setBundlePlansFor = (network) =>
  (document.querySelector("#plans").innerHTML =
    "<option value=''>Data Bundle Plan</option>" +
    getNetworkPlans(network)
      .map((plan) => `<option value="${plan.code}">${plan.value}</option>`)
      .join(""));

const setAmount = (value) =>
  (document.querySelector("#amount").value = getNetworkPlans(
    document.querySelector("#network").value
  ).find((plan) => plan.code === value).amount);
