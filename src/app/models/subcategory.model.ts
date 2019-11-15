export class Subcategory {
    constructor(
        public subcat_name: string,
        public subcat_description: string,
        public subcat_img: string,
        public subcat_category: string,
        public subcat_state?: string,
        public _id?: BigInteger,
    ) {}
}
