import baseAxios from "@/axios/db";

export default {
  namespaced: true,
  actions: {
    async pushOrder({commit, rootGetters}, order) {
      const cart = rootGetters["cart/cart"];
      const goods = rootGetters["goods/goods"];

      for (const [key, value] of Object.entries(cart)) {
        const good = goods.find(g => g.id === key);
        const toOrder = {
          name: good.title,
          price: good.price,
          count: value
        };
        const count = good.count - value;
        order.list.push(toOrder);
        commit("goods/updateGoodCount", {id: key, count}, {root: true});
        await baseAxios.patch(`/products/${key}.json`, {count});
      }

      commit("cart/clearCart", null, {root: true});
      await baseAxios.post("/orders.json", order);
    }
  },
}
