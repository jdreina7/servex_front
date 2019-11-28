export class Category {
    constructor(
        public cat_name: string,
        public cat_description: string,
        public cat_img: string,
        public cat_file: string,
        public cat_support_subcategories: string,
        public cat_state?: string,
        public _id?: BigInteger,
    ) {}
}
