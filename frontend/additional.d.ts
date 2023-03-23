declare module "iron-session" {
    export interface IronSessionData {
        user?: User;
    }
}

type User = {
    email: string
}