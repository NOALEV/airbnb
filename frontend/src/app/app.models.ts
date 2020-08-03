export class Property {
    constructor(public id: number,
                public title: string, 
                public desc: string,
                public propertyType: string,
                public bedType: string,

                public preview:object[],
                public images:string[],
                public city: string,
                public zipCode: string[],
                public neighborhood: string[],
                public street: string[],
                public location: Location,
                public formattedAddress: string,
                public features: string[],
                public bedrooms: number,
                public accommodates: number,

                public bathrooms: number,
                public garages: number,
             
                public yearBuilt: number,
                
                public gallery: Gallery[],
                public published: string,
                public lastUpdate: string,
                ){ }
}







export class Location {
    constructor(public id: number, 
                public lat: number,
                public lng: number){ }
}




export class Gallery {
    constructor(public id: number, 
                public small: string,
                public medium: string,
                public big: string){ }
}




export class Pagination {
    constructor(public page: number,
                public perPage: number,
                public prePage: number,
                public nextPage: number,
                public total: number,
                public totalPages: number){ }
}

