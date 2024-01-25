import _ from "lodash";
import settings from "../settings";
const { HANDLING_CHARGE_RATE, MINIMUM_HANDLING_FEE } = settings
const utils = {
  infoMerge : (datas) => {
    const result = datas.reduce((mergeResult, prev, next) => {
      const isNotExist =
        mergeResult && mergeResult.filter((item) => _.trim(item.number) === _.trim(prev.number)).length === 0;
        let handingFee = prev.price * 1000 * prev.sheet * HANDLING_CHARGE_RATE < MINIMUM_HANDLING_FEE ? MINIMUM_HANDLING_FEE : Math.round(prev.price * 1000 * prev.sheet * HANDLING_CHARGE_RATE);

      if (isNotExist) {
        mergeResult.push({
          cost: prev.cost,
          income: 0,
          name: prev.name,
          number: prev.number,
          price: prev.price * prev.sheet,
          sale_cost: 0,
          sale_date: 0,
          sale_price: 0,
          sale_sheet: 0,
          sheet: prev.sheet,
          status: "unsale",
          handingFee: handingFee,
          stocksDetail: [prev]
        });
      } else {
        const index = _.findIndex(
          mergeResult,
          (e) => _.trim(e.number) === _.trim(prev.number),
          0
        );
        mergeResult[index] = {
          ...mergeResult[index],
          cost: mergeResult[index].cost + prev.cost,
          price: mergeResult[index].price + prev.price * prev.sheet,
          sheet: mergeResult[index].sheet + prev.sheet,
          handingFee: mergeResult[index].handingFee +  handingFee
        };
        mergeResult[index]['stocksDetail'].push(prev)
      }
      return mergeResult;
    }, []);
    return result;
  }
};

export default utils;