export class LocationsModel {
    public hotels: { code: string, name: string, region: string, url: string }[];
    public areas: { code: string, name: string, url: string }[];
}

export var defaultLocations: LocationsModel = {
    hotels: [
        {
            name: "Travelodge Hotel Sydney",
            region: "Sydney, Australia",
            code: "58434",
            url: "sydney"
        },
        {
            name: "Travelodge Hotel Sydney Wynyard",
            region: "Sydney, Australia",
            code: "58437",
            url: "sydney-wynyard"
        },
        {
            name: "Travelodge Hotel Blacktown Sydney",
            region: "Sydney, Australia",
            code: "58438",
            url: "blacktown-sydney"
        },
        {
            name: "Travelodge Hotel Hobart Airport",
            region: "Hobart, Australia",
            code: "60305",
            url: "hobart-airport"
        },
        {
            name: "Travelodge Hotel Manly Warringah Sydney",
            region: "Sydney, Australia",
            code: "58442",
            url: "manly-warringah-sydney"
        },
        {
            name: "Travelodge Hotel Bankstown Sydney",
            region: "Sydney, Australia",
            code: "58433",
            url: "bankstown-sydney"
        },
        {
            name: "Travelodge Hotel Garden City Brisbane",
            region: "Brisbane, Australia",
            code: "58431",
            url: "garden-city-brisbane"
        },
        {
            name: "Travelodge Resort Darwin",
            region: "Darwin, Australia",
            code: "58439",
            url: "resort-darwin"
        },
        {
            name: "Travelodge Hotel Sydney Martin Place",
            region: "Sydney, Australia",
            code: "58441",
            url: "sydney-martin-place"
        },
        {
            name: "Travelodge Hotel Melbourne Southbank",
            region: "Melbourne, Australia",
            code: "58427",
            url: "melbourne-southbank"
        },
        {
            name: "Travelodge Hotel Melbourne Docklands",
            region: "Melbourne, Australia",
            code: "58435",
            url: "melbourne-docklands"
        },
        {
            name: "Travelodge Hotel Macquarie North Ryde Sydney",
            region: "Sydney, Australia",
            code: "58445",
            url: "macquarie-north-ryde-sydney"
        },
        {
            name: "Travelodge Hotel Newcastle",
            region: "Newcastle, Australia",
            code: "58426",
            url: "newcastle"
        },
        {
            name: "Travelodge Hotel Perth",
            region: "Perth, Australia",
            code: "58440",
            url: "perth"
        },
        {
            name: "Travelodge Hotel Wellington",
            region: "Wellington, New Zealand",
            code: "58423",
            url: "wellington"
        },
        {
            name: "Travelodge Hotel Rockhampton",
            region: "Rockhampton, Australia",
            code: "58432",
            url: "rockhampton"
        },
        {
            name: "Travelodge Hotel Hobart",
            region: "Hobart, Australia",
            code: "58969",
            url: "hobart"
        },
        {
            name: "Travelodge Sydney Airport",
            region: "Sydney, Australia",
            code: "77433",
            url: "sydney-airport"
        }
    ],
    areas: [
        {
            name: "Sydney",
            code: "SYD",
            url: "sydney"
        },
        {
            name: "Melbourne",
            code: "MEL",
            url: "melbourne"
        },
        {
            name: "Brisbane",
            code: "BNE",
            url: "brisbane"
        },
        {
            name: "Darwin",
            code: "DWN",
            url: "darwin"
        },
        {
            name: "Hobart",
            code: "HOB",
            url: "hobart"
        },
        {
            name: "Newcastle",
            code: "NEWC",
            url: "newcastle"
        },
        {
            name: "Perth",
            code: "PER",
            url: "perth"
        }
    ]
}

export var wordpressLocationSearchTerms: {} =
    {
        '0': 'Australia',
        '1': 'Brisbane',
        '2': 'Travelodge Hotel Garden City Brisbane',
        '3': 'Darwin',
        '4': 'Travelodge Hotel Resort Darwin',
        '5': 'Hobart',
        '6': 'Travelodge Hotel Hobart',
        '7': 'Travelodge Hotel Hobart Airport',
        '8': 'Melbourne',
        '9': 'Travelodge Hotel Melbourne Docklands',
        '10': 'Travelodge Hotel Melbourne Southbank',
        '11': 'Newcastle',
        '12': 'Travelodge Hotel Newcastle',
        '13': 'PERTH',
        '14': 'Travelodge Hotel Perth',
        '15': 'Rockhampton',
        '16': 'Travelodge Hotel Rockhampton',
        '17': 'Sydney',
        '18': 'Travelodge Hotel Bankstown Sydney',
        '19': 'Travelodge Hotel Blacktown',
        '20': 'Travelodge Hotel Macquarie North Ryde',
        '21': 'Travelodge Hotel Manly Warringah',
        '22': 'Travelodge Hotel Sydney Martin Place',
        '23': 'Travelodge Hotel Sydney',
        '24': 'Travelodge Hotel Sydney Airport',
        '25': 'Travelodge Hotel Sydney Wynyard',
        '26': 'Wellington',
        '27': 'Travelodge Hotel Wellington',
        //'28': 'Hong Kong',
        //'29': 'Travelodge Hotel Kowloon'
    };