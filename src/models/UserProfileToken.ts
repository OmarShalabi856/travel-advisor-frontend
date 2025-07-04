export type UserProfileToken = {
    userId:string,
    userName:string,
    email:string,
    accessToken:string | null,
    refreshToken:string | null
}