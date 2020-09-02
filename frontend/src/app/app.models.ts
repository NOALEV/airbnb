export class Property {
    constructor(public _id: string,
        public _userId: string,
        public title: string,
        public desc: string,
        public propertyType: string,
        public bedType: string,
        public getPrediction:boolean,
        public predictionUs:number,
        public predictionEur:number,
        public prediction:number,
        public preview: object[],
        public images: string[],
        public city: string,
        public zipCode: string[],
        public neighborhood: string[],
        public street: string[],
        public location: Location,
        public formattedAddress: string,
        public features: string[],
        public bedrooms: number,
        public accommodates: number,
        public area: Area,
        public bathrooms: number,
        public garages: number,

        public yearBuilt: number,
        public ratingsCount: number,
        public ratingsValue: number,

        public gallery: Gallery[],
        public priceDollar: PriceDollar,
        public published: string,
        public lastUpdate: string,
    ) { }
}







export class Location {
    constructor(public id: number,
        public lat: number,
        public lng: number) { }
}




export class Gallery {
    constructor(public id: number,
        public small: string,
        public medium: string,
        public big: string) { }
}

export class PriceDollar {
    constructor(public sale: number,
        public rent: number) { }
}

export class Area {
    constructor(public value: number,
        public unit: string,
    ) { }
}

export class Pagination {
    constructor(public page: number,
        public perPage: number,
        public prePage: number,
        public nextPage: number,
        public total: number,
        public totalPages: number) { }
}

export class Feedback {
    constructor(public username: string,
                public message: string,
               ){ }
}

