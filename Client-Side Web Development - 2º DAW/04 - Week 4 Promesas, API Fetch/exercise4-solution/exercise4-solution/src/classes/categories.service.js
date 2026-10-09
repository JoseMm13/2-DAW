import { SERVER } from "../constants.js";
import { Http } from "./http.class.js";

export class CategoriesService {
    #http = new Http();

    async getAll() {
        const resp = await this.#http.get(`${SERVER}/categories`);
        return resp.categories;
    }
}
