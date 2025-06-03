import axios from "axios"

enum Gender {
    Male = 'male',
    Female = 'female'
}

enum Role {
    Admin = 'admin',
    Moderator = 'moderator',
    User = 'user'
}

enum ResponseStatus {
    Failed = 'failed',
    Success = 'success',
}

interface Hair {
    color: string,
    type: string,
}

interface Coordinates {
    lat: number;
    lng: number;
}

interface Address {
    address: string,
    city: string,
    state: string,
    stateCode: string,
    postalCode: string,
    coordinates: Coordinates,
    country: string
}

interface Bank {
    cardExpire: string,
    cardNumber: string,
    cardType: string,
    currency: string,
    iban: string,
}

interface Company {
    department: string;
    name: string,
    title: string,
    address: Address
}

interface Crypto {
    coin: string,
    wallet: string,
    network: string,
}

interface UserData {
    id: number,
    firstName: string,
    lastName: string,
    maidenName: string,
    age: number,
    gender: Gender,
    email: string,
    phone: string,
    username: string,
    password: string,
    birthDate: string,
    image: string,
    bloodGroup: string,
    height: number,
    weight: number,
    eyeColor: string,
    hair: Hair,
    ip: string,
    address: Address,
    macAddress: string,
    university: string,
    bank: Bank,
    company: Company,
    ein: string,
    ssn: string,
    userAgent: string,
    crypto: Crypto,
    role: Role
}

interface ResponseSuccessData {
    users: UserData[],
    limit: number,
    skip: number,
    total: number,
}

interface ResponseErrorData {
    errorMessage: string,
    errorCode: number,
}

interface ResponseSuccess {
    status: ResponseStatus.Success,
    data: ResponseSuccessData,
}

interface ResponseFailed {
    status: ResponseStatus.Failed,
    data: ResponseErrorData,
}

type Response = ResponseFailed | ResponseSuccess

function isSuccessResponse (response: Response): response is ResponseSuccess {
    return response.status === ResponseStatus.Success
}

async function fetchUsers(): Promise<ResponseSuccessData | ResponseErrorData> {
    const response: Response = await axios.get('https://dummyjson.com/users');

    if (isSuccessResponse(response)) {
        return response.data
    }
    return response.data
}

async function showUsers() {
    const result = await fetchUsers();
    console.log('result', result)
}

// Вызов функции
showUsers();
