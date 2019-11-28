export class Product {
    constructor(
        public prod_name: string,
        public prod_description: string,
        public prod_img: string,
        public prod_file: string,
        public prod_client: string,
        public prod_category: string,
        public prod_subcategory: string,
        public prod_state?: string,
        public prod_master?: string,
        public _id?: BigInteger,
    ) {}
}
