export class Client {
    constructor(
        public client_name: string,
        public client_last_name: string,
        public client_bussiness_name: string,
        public client_description: string,
        public client_email: string,
        public client_logo: string,
        public client_file: string,
        public client_state?: string,
        public client_master?: string,
        public _id?: BigInteger,
    ) {}
}
