export class User {
    constructor(
        public usr_name: string,
        public usr_last_name: string,
        public usr_email: string,
        public usr_password: string,
        public usr_img: string,
        public usr_role: string,
        public usr_state?: string,
        public _id?: BigInteger,
    ) {}
}
