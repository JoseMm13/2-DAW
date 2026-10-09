import { SERVER } from "../constants.js";
import { Http } from "./http.class.js";

export class ProductsService {
    #http = new Http();

    async getAll() {
        const resp = await this.#http.get(`${SERVER}/products`);
        return resp.products;
    }

    async post(product) {
        const resp = await this.#http.post(`${SERVER}/products`, product);
        return resp.product;
    }

    async delete(id) {
        await this.#http.delete(`${SERVER}/products/${id}`);
    }
}
