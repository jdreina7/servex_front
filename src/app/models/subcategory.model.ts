export class Subcategory {
    constructor(
        public subcat_name: string,
        public subcat_description: string,
        public subcat_img: string,
        public subcat_file: string,
        public subcat_category: string,
        public subcat_subcategory1: string,
        public subcat_subcategory2: string,
        public subcat_subcategory3: string,
        public subcat_subcategory4: string,
        public subcat_client: string,
        public subcat_state?: string,
        public subcat_master?: string,
        public _id?: BigInteger,
    ) {}
}
